// app/api/thalaswap/route.ts
import { InputValues } from '@langchain/core/dist/utils/types';
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  ToolMessage,
} from '@langchain/core/messages';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { ChatOpenAI } from '@langchain/openai';
import { LangChainAdapter, StreamingTextResponse } from 'ai';
import { NextApiRequest } from 'next';

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

export default async function handler(req: Request) {
  const data = await req.json();
  // console.log(messages);
  const messages: ChatPromptTemplate<InputValues, string>[] = (
    data.messages as { role: string; content: string }[]
  ).map((v) => ChatPromptTemplate.fromMessages([[v.role, v.content]]));

  const model = new ChatOpenAI({
    model: 'gpt-4o',
    temperature: 0,
    streaming: true,
    apiKey: 'sk-proj-EaGZZ3Nzj3Jj9AE2nXUFT3BlbkFJO7ZctA8pLqCbWitCCeoO',
  });

  const llmWithTools = model.bind({ tools });
  // const chatPrompt = ChatPromptTemplate.fromMessages([['human', prompt]]);
  const chatPrompt = ChatPromptTemplate.fromMessages(messages);

  const chain = chatPrompt.pipe(llmWithTools);

  const processStream = async function* () {
    for await (const chunk of stream) {
      console.log({ chunk });
      if ('content' in chunk && chunk.content) {
        yield chunk.content;
      }
      if ('additional_kwargs' in chunk && chunk.additional_kwargs?.tool_calls) {
        for (const toolCall of chunk.additional_kwargs.tool_calls) {
          if (toolCall.type === 'function' && toolCall.function) {
            const { name, arguments: args } = toolCall.function;
            const result = await runTool(name, JSON.parse(args));
            console.log({ result });
            yield `\nTool ${name} result: ${JSON.stringify(result)}\n`;
          }
        }
      }
    }
  };

  const stream = await chain.stream({
    processStream,
  });

  const aiStream = LangChainAdapter.toAIStream(stream);
  return new StreamingTextResponse(aiStream);
}
