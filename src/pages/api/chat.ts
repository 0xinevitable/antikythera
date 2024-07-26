// pages/api/thalaswap.ts
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  ToolMessage,
} from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { ChatOpenAI } from '@langchain/openai';
import {
  LangChainStream,
  StreamingTextResponse,
  experimental_StreamData,
} from 'ai';
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

  // units
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

export const runtime = 'edge';

export default async function handler(
  req: Request,
  // res: NextApiResponse,
) {
  // if (req.method !== 'POST') {
  //   return res.status(405).json({ error: 'Method not allowed' });
  // }

  const { messages } = await req.json();
  console.log(messages);

  const model = new ChatOpenAI({
    model: 'gpt-4o',
    temperature: 0,
    streaming: true,
    apiKey: 'sk-proj-EaGZZ3Nzj3Jj9AE2nXUFT3BlbkFJO7ZctA8pLqCbWitCCeoO',
  });

  const llmWithTools = model.bind({ tools });

  const data = new experimental_StreamData();

  const stream = await llmWithTools.stream([new HumanMessage(messages[0])]);

  const textEncoder = new TextEncoder();
  const transformStream = new TransformStream({
    async transform(chunk, controller) {
      if (chunk.content) {
        controller.enqueue(textEncoder.encode(chunk.content));
      }

      console.log(JSON.stringify(chunk));
      if (chunk.additional_kwargs?.tool_calls) {
        for (const toolCall of chunk.additional_kwargs.tool_calls) {
          if (toolCall.type === 'function' && toolCall.function) {
            console.log({ toolCall });
            const { name, arguments: args } = toolCall.function;
            controller.enqueue(
              textEncoder.encode(`\nExecuting tool: ${name}\n`),
            );
            try {
              console.log({ args });
              const result = await runTool(name, JSON.parse(args));
              console.log({ result });
              const resultString = JSON.stringify(result);
              controller.enqueue(
                textEncoder.encode(`\nTool ${name} result: ${resultString}\n`),
              );
              data.append({ type: 'tool_result', tool: name, result });
            } catch (error) {
              console.error(`Error executing tool ${name}:`, error);
              controller.enqueue(
                textEncoder.encode(
                  `\nError executing tool ${name}: ${error.message}\n`,
                ),
              );
            }
          }
        }
      }
    },
    flush(controller) {
      data.close();
    },
  });

  return new StreamingTextResponse(
    stream.pipeThrough(transformStream),
    {},
    data,
  );
}
