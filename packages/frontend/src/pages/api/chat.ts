import { BaseLanguageModelInput } from '@langchain/core/language_models/base';
import {
  AIMessage,
  AIMessageChunk,
  BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from '@langchain/core/messages';
import { Runnable } from '@langchain/core/runnables';
import { ChatOpenAI, ChatOpenAICallOptions } from '@langchain/openai';
import { NextApiRequest, NextApiResponse } from 'next';

import { Message } from '@/home/types';
import { ExtendedTool, getAllTools } from '@/tools/index';

export const maxDuration = 300;

const tools = getAllTools();
const toolRegistry = tools.reduce(
  (acc, tool) => {
    acc[tool.name] = tool;
    return acc;
  },
  {} as Record<string, ExtendedTool>,
);

const llmWithTools = new ChatOpenAI({
  model: 'gpt-4',
  temperature: 0.2,
  topP: 0.1,
  streaming: true,
  apiKey: process.env.OPENAI_API_KEY,
}).bind({ tools });

interface ReasoningStep {
  thought: string;
  action: string;
  toolName: string;
  args: Record<string, unknown>;
}

interface ToolResult {
  toolName: string;
  result: unknown;
  interpretation: string;
}

type StreamResponse =
  | { type: 'reasoning_step'; data: ReasoningStep }
  | { type: 'tool_result'; data: ToolResult }
  | { type: 'final_response'; data: string };

async function runTool(toolName: string, args: Record<string, unknown>) {
  const tool = toolRegistry[toolName];
  if (!tool) throw new Error(`Tool ${toolName} not found`);
  return await tool.invoke(args);
}

// Separate function to get reasoning
async function getReasoning(
  llm: Runnable<BaseLanguageModelInput, AIMessageChunk, ChatOpenAICallOptions>,
  messages: BaseMessage[],
) {
  const reasoningPrompt = `Given the user's request, explain:
1. What specific information you need
2. Which tool you'll use and why
3. How this will help answer the user's query

Start your response with "Reasoning:"`;

  const reasoningResponse = await llm.invoke([
    ...messages,
    new HumanMessage(reasoningPrompt),
  ]);

  const content = reasoningResponse.content.toString();
  const reasoningMatch = content.match(/Reasoning: (.*?)(?=\n|$)/s);
  return reasoningMatch ? reasoningMatch[1].trim() : content.trim();
}

// Separate function to get tool interpretation
async function getToolInterpretation(
  llm: Runnable<BaseLanguageModelInput, AIMessageChunk, ChatOpenAICallOptions>,
  toolName: string,
  result: unknown,
) {
  const interpretPrompt = `Here is the result from the ${toolName} tool:
${JSON.stringify(result, null, 2)}

Explain what this result means and how it helps answer the user's query.
Be specific and concise.`;

  const interpretResponse = await llm.invoke([
    new HumanMessage(interpretPrompt),
  ]);
  return interpretResponse.content.toString().trim();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  try {
    const data = req.body as { messages: Message[] };

    // Convert messages
    const messages: BaseMessage[] = data.messages.flatMap((v) => {
      switch (v.role) {
        case 'user':
          return new HumanMessage(v.content);
        case 'assistant':
          return new AIMessage(v.content);
        case 'tool':
          return [
            new AIMessage('', {
              tool_calls: [
                {
                  ...v.kwargs.additional_kwargs.tool_call,
                  function: {
                    ...v.kwargs.additional_kwargs.tool_call.function,
                    arguments: JSON.stringify(
                      v.kwargs.additional_kwargs.tool_call.function.arguments,
                    ),
                  },
                },
              ],
            }),
            new ToolMessage({
              content: JSON.stringify(v.kwargs.content) || '',
              tool_call_id: v.kwargs.tool_call_id,
              name: v.kwargs.name,
            }),
          ];
        default:
          return [];
      }
    });

    const systemPrompt = `You are a crypto assistant. Use the available tools to provide accurate information:

Remember to verify all information about crypto assets using tools.`;

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // First get tool selection and reasoning
          const response = await llmWithTools.invoke([
            new SystemMessage(systemPrompt),
            ...messages,
          ]);

          if (response.additional_kwargs?.tool_calls) {
            for (const toolCall of response.additional_kwargs.tool_calls) {
              if (toolCall.type === 'function' && toolCall.function) {
                const { name, arguments: argsString } = toolCall.function;
                const args = JSON.parse(argsString);

                // Get reasoning for this specific tool use
                const reasoning = await getReasoning(llmWithTools, messages);

                // Stream reasoning step
                const reasoningStep: ReasoningStep = {
                  thought: reasoning,
                  action: `Using ${name} tool`,
                  toolName: name,
                  args: args,
                };

                controller.enqueue(
                  JSON.stringify({
                    type: 'reasoning_step',
                    data: reasoningStep,
                  }) + '\n',
                );

                // Execute tool
                try {
                  const result = await runTool(name, args);

                  // Get interpretation of the results
                  const interpretation = await getToolInterpretation(
                    llmWithTools,
                    name,
                    result,
                  );

                  const toolResult: ToolResult = {
                    toolName: name,
                    result: result,
                    interpretation: interpretation,
                  };

                  controller.enqueue(
                    JSON.stringify({
                      type: 'tool_result',
                      data: toolResult,
                    }) + '\n',
                  );
                } catch (error) {
                  console.error(`Tool execution error:`, error);
                  throw error;
                }
              }
            }
          }

          // Get final response
          const finalResponse = await llmWithTools.invoke([
            ...messages,
            new SystemMessage(
              'Provide a final comprehensive response based on all the information gathered.',
            ),
          ]);

          controller.enqueue(
            JSON.stringify({
              type: 'final_response',
              data: finalResponse.content.toString().trim(),
            }) + '\n',
          );
        } catch (error) {
          console.error('Stream processing error:', error);
          throw error;
        } finally {
          controller.close();
        }
      },
    });

    res.setHeader('Content-Type', 'application/x-ndjson');
    res.setHeader('Transfer-Encoding', 'chunked');

    await stream.pipeTo(
      new WritableStream({
        write(chunk) {
          res.write(chunk);
        },
        close() {
          res.end();
        },
      }),
    );
  } catch (err) {
    console.error('Handler error:', err);
    return res
      .status(500)
      .send(
        (err as Error).message ||
          'An error occurred while processing your request.',
      );
  }
}
