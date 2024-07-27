import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  ToolMessage,
} from '@langchain/core/messages';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { ChatOpenAI } from '@langchain/openai';
import { NextApiRequest, NextApiResponse } from 'next';

import { searchCoinTool } from '@/tools/coins';
import { findSwapRouteTool, thalaSwapABITool } from '@/tools/thalaswap';
import { formatUnitsTool, parseUnitsTool } from '@/tools/units';

export const maxDuration = 300; // 5 minutes

type ExtendedTool = DynamicStructuredTool<any>;

const tools: ExtendedTool[] = [
  searchCoinTool,
  findSwapRouteTool,
  thalaSwapABITool,
  parseUnitsTool,
  formatUnitsTool,
];

const toolsByName = {
  searchCoin: searchCoinTool,
  findSwapRoute: findSwapRouteTool,
  getThalaSwapABI: thalaSwapABITool,
  parseUnits: parseUnitsTool,
  formatUnits: formatUnitsTool,
};

const runTool = async (
  toolName: string,
  args: Record<string, unknown> & { name: string; args: any },
) => {
  const tool = toolsByName[toolName as keyof typeof toolsByName];
  if (!tool) throw new Error(`Tool ${toolName} not found`);
  return await tool.invoke(args);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    // return new Response('Method not allowed', { status: 405 });
    return res.status(405).send('Method not allowed');
  }

  const data = req.body;
  const lastMessage = data.messages[data.messages.length - 1].content;

  const llm = new ChatOpenAI({
    model: 'gpt-4o',
    temperature: 0,
    streaming: true,
    apiKey: 'sk-proj-EaGZZ3Nzj3Jj9AE2nXUFT3BlbkFJO7ZctA8pLqCbWitCCeoO',
  });

  const llmWithTools = llm.bind({ tools });

  let messages: BaseMessage[] = [new HumanMessage(lastMessage)];
  let finalResponse: string | null = null;

  const stream = new ReadableStream({
    async start(controller) {
      while (finalResponse === null) {
        const response = await llmWithTools.invoke(messages);
        console.log(JSON.stringify(response));

        if (
          'additional_kwargs' in response &&
          response.additional_kwargs.tool_calls
        ) {
          const toolMessages: ToolMessage[] = [];
          for (const toolCall of response.additional_kwargs.tool_calls || []) {
            if (toolCall.type === 'function' && toolCall.function) {
              const { name, arguments: argsString } = toolCall.function;
              try {
                const args = JSON.parse(argsString);
                const result = await runTool(name, args);
                console.log(JSON.stringify(result), name, args);

                toolMessages.push(
                  new ToolMessage({
                    content: result,
                    tool_call_id: toolCall.id,
                    name: name,
                  }),
                );
              } catch (error) {
                console.error(`Error executing tool ${name}:`, error);
              }
            }
          }

          messages.push(response as AIMessage);
          messages.push(...toolMessages);

          // Send the tool calls and results as a JSONL stream
          controller.enqueue(
            JSON.stringify({ type: 'tool_calls', data: toolMessages }) + '\n',
          );
        } else if (typeof response.content === 'string') {
          finalResponse = response.content;
          messages.push(response as AIMessage);

          // Send the final response as a JSONL stream
          controller.enqueue(
            JSON.stringify({ type: 'final_response', data: finalResponse }) +
              '\n',
          );
        }
      }
      controller.close();
    },
  });

  // return new Response(stream, {
  //   headers: {
  //     'Content-Type': 'application/x-ndjson',
  //     'Transfer-Encoding': 'chunked',
  //   },
  // });
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
}
