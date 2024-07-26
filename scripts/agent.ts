import { BaseLanguageModelInput } from '@langchain/core/language_models/base';
import {
  AIMessage,
  AIMessageChunk,
  BaseMessage,
  HumanMessage,
  ToolMessage,
} from '@langchain/core/messages';
import { Runnable } from '@langchain/core/runnables';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { ChatOpenAI, ChatOpenAICallOptions } from '@langchain/openai';

import { searchCoinTool } from './tools/coins';
import { findSwapRouteTool, thalaSwapABITool } from './tools/thalaswap';
import { formatUnitsTool, parseUnitsTool } from './tools/units';

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
};

const runTool = async (
  toolName: string,
  args: Record<string, unknown> & { name: string; args: any },
) => {
  const tool = toolsByName[toolName as keyof typeof toolsByName];
  if (!tool) throw new Error(`Tool ${toolName} not found`);
  return await tool.invoke(args);
};

const interactiveAgentLoop = async (
  llm: Runnable<BaseLanguageModelInput, AIMessageChunk, ChatOpenAICallOptions>,
  initialPrompt: string,
) => {
  let messages: BaseMessage[] = [new HumanMessage(initialPrompt)];
  let finalResponse: string | null = null;

  while (finalResponse === null) {
    const response = await llm.invoke(messages);

    if (
      'additional_kwargs' in response &&
      response.additional_kwargs.tool_calls
    ) {
      const toolMessages: ToolMessage[] = [];
      for (const toolCall of response.additional_kwargs.tool_calls) {
        if (toolCall.type === 'function' && toolCall.function) {
          const { name, arguments: args } = toolCall.function;
          console.log(`Executing tool: ${name}`);
          const result = await runTool(name, JSON.parse(args));
          console.log(result);
          toolMessages.push(
            new ToolMessage({
              content: result,
              tool_call_id: toolCall.id,
              name: name,
            }),
          );
        }
      }
      messages.push(response as AIMessage);
      messages.push(...toolMessages);
    } else if (typeof response.content === 'string') {
      finalResponse = response.content;
      messages.push(response as AIMessage);
    }
  }

  return finalResponse;
};

const main = async () => {
  const llm = new ChatOpenAI({
    model: 'gpt-4o',
    temperature: 0,
    apiKey: process.env.API_KEY,
  });
  const llmWithTools = llm.bindTools(tools);

  const result = await interactiveAgentLoop(
    llmWithTools,
    // 'Get route of APT->USDC and print each pool state',
    'APT->USDC 경로 안에 있는 각각의 풀 상태를 알려줘. 그리고 100 APT 넣었을 때 결과값 예상해줘.',
  );

  console.log('Final result:', result);
};

main().catch(console.error);
