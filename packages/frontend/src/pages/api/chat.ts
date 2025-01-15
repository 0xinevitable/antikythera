// import { ChatAnthropic } from '@langchain/anthropic';
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from '@langchain/core/messages';
import { ChatOpenAI, ChatOpenAICallOptions } from '@langchain/openai';
import { NextApiRequest, NextApiResponse } from 'next';

import { Message } from '@/home/types';
// Import tools dynamically
import { ExtendedTool, getAllTools } from '@/tools';

const tools = getAllTools();
const toolRegistry = tools.reduce(
  (acc, tool) => {
    acc[tool.name] = tool;
    return acc;
  },
  {} as Record<string, ExtendedTool>,
);

// Initialize the model
const model = new ChatOpenAI({
  model: 'gpt-4',
  temperature: 0.2,
  topP: 0.1,
  streaming: true,
  apiKey: process.env.OPENAI_API_KEY,
}).bindTools(tools);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  try {
    const data = req.body as { messages: Message[] };
    const messages: BaseMessage[] = data.messages.flatMap((v) => {
      if (v.role === 'user') return new HumanMessage(v.content);
      if (v.role === 'assistant') return new AIMessage(v.content);
      if (v.role === 'tool') {
        return new ToolMessage({
          content: v.kwargs.content,
          tool_call_id: v.kwargs.tool_call_id,
          name: v.kwargs.name,
          additional_kwargs: v.kwargs.additional_kwargs,
        });
      }
      return [];
    });

    const stream = new ReadableStream({
      async start(controller) {
        let currentState = {
          messages,
          reasoning: [] as string[],
          toolResults: {} as Record<string, any>,
          response: '',
        };

        const emitEvent = (type: string, data: any) => {
          controller.enqueue(JSON.stringify({ type, data }) + '\n');
        };

        try {
          // Analyze step
          emitEvent('llm_start', {});

          const systemPrompt = new SystemMessage({
            content: `You are a helpful assistant that analyzes requests and determines what tools are needed.
- If asked for a list, respond with a markdown table with as much information as possible
- Include data sources in responses
- Never assume information about coins/tokens - always verify through tools
- Use simple search terms for tokens (e.g. "eth" vs "ethereum")
- Break down complex requests into steps
- Explain reasoning for each tool use
- Focus on providing accurate information`,
          });

          const analysisResponse = await model.invoke([
            systemPrompt,
            ...currentState.messages,
            new HumanMessage(`Analyze this request and explain what tools are needed:
${currentState.messages[currentState.messages.length - 1].content}

Format your response as:
REASONING: [Why these tools are needed]
TOOLS: [List of tool operations in JSON format]`),
          ]);

          emitEvent('llm_end', { output: analysisResponse.content });

          const content = analysisResponse.content.toString();
          const [reasoning, toolsStr] = content
            .split('TOOLS:')
            .map((s) => s.trim());
          console.log(reasoning, tools);
          const toolCalls = JSON.parse(
            toolsStr.replace('REASONING:', '').trim(),
          );

          currentState = {
            ...currentState,
            reasoning: [reasoning.replace('REASONING:', '').trim()],
            messages: [...currentState.messages, analysisResponse],
          };

          // Execute tools
          for (const toolCall of toolCalls) {
            if (toolCall.type === 'function' && toolCall.function) {
              const { name, arguments: argsString } = toolCall.function;
              try {
                emitEvent('tool_start', { tool: name, input: argsString });

                const args = JSON.parse(argsString);
                const tool = toolRegistry[name];

                if (!tool) {
                  throw new Error(`Tool ${name} not found`);
                }

                const result = await tool.invoke(args);
                currentState.toolResults[name] = result;

                emitEvent('tool_end', { tool: name, output: result });

                currentState.messages.push(
                  new ToolMessage({
                    content: result,
                    tool_call_id: toolCall.id,
                    name: name,
                    additional_kwargs: { tool_call: toolCall },
                  }),
                );
              } catch (error) {
                console.error(`Error executing tool ${name}:`, error);
                emitEvent('tool_error', {
                  tool: name,
                  error: (error as Error).message,
                });
              }
            }
          }

          // Generate final response
          emitEvent('llm_start', {});

          const context = `Tool Results:\n${JSON.stringify(currentState.toolResults, null, 2)}
Reasoning:\n${currentState.reasoning.join('\n')}`;

          const finalResponse = await model.invoke([
            new SystemMessage({
              content: `Generate a helpful response based on the tool results and reasoning. 
- Format tables using markdown
- Include data sources
- Make information clear and actionable
- Highlight key insights
- Suggest next steps if appropriate`,
            }),
            ...currentState.messages,
            new HumanMessage(`Generate a response based on:\n${context}`),
          ]);

          emitEvent('llm_end', { output: finalResponse.content });
          emitEvent('final_response', finalResponse.content);

          controller.close();
        } catch (error) {
          console.error('Stream Error:', error);
          emitEvent('error', { message: (error as Error).message });
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
  } catch (error) {
    console.error('API Handler Error:', error);
    res.status(500).send((error as Error).message);
  }
}

export const maxDuration = 300; // 5 minutes
