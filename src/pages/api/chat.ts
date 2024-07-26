// app/api/thalaswap/route.ts
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

export default async function handler(req: NextApiRequest<{ prompt: string }>) {
  const { prompt } = req.body;

  const model = new ChatOpenAI({
    model: 'gpt-4o',
    temperature: 0,
    streaming: true,
    apiKey: '',
  });

  const llmWithTools = model.bind({ tools });

  const chatPrompt = ChatPromptTemplate.fromMessages([['human', prompt]]);

  const chain = chatPrompt.pipe(llmWithTools);

  const processStream = async function* () {
    for await (const chunk of stream) {
      if ('content' in chunk && chunk.content) {
        yield chunk.content;
      }
      if ('additional_kwargs' in chunk && chunk.additional_kwargs?.tool_calls) {
        for (const toolCall of chunk.additional_kwargs.tool_calls) {
          if (toolCall.type === 'function' && toolCall.function) {
            const { name, arguments: args } = toolCall.function;
            const result = await runTool(name, JSON.parse(args));
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
