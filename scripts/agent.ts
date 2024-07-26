import { ChatOpenAI } from '@langchain/openai';

import { searchCoinTool } from './tools/coins';
import { findSwapRouteTool, thalaSwapABITool } from './tools/thalaswap';

const llm = new ChatOpenAI({
  model: 'gpt-4o',
  temperature: 0,
  apiKey: process.env.API_KEY,
});

const llmWithTools = llm.bindTools([
  searchCoinTool,
  findSwapRouteTool,
  thalaSwapABITool,
]);

const main = async () => {
  const res = await llmWithTools.invoke(
    // 'Get route of APT->USDC and print each pool state',
    'APT->USDC 경로 안에 있는 각각의 풀 상태를 알려줘',
  );

  console.log(res);
};

main();
