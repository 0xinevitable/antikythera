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

  // try {
  const data = await req.json();
  // console.log({ messages: JSON.stringify(messages) });
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

  while (finalResponse === null) {
    const response = await llm.invoke(messages);

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
            const result = JSON.stringify(await runTool(name, args));
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
            // response.additional_kwargs.result += `\n\nError executing tool ${name}: ${error.message}`;
          }
        }
      }

      messages.push(response as AIMessage);
      messages.push(...toolMessages);
    } else if (typeof response.content === 'string') {
      finalResponse = response.content;
      messages.push(response as AIMessage);
    }

    return messages;
  }
}

// console.log({ result: JSON.stringify(result.toJSON()) });

//   if (response.additional_kwargs?.tool_calls) {
//     for (const toolCall of response.additional_kwargs.tool_calls) {
//       if (toolCall.type === 'function' && toolCall.function) {
//         const { name, arguments: argsString } = toolCall.function;
//         try {
//           const args = JSON.parse(argsString);
//           const toolResult = await runTool(name, args);
//           result += `\n\nTool ${name} result:\n${JSON.stringify(toolResult, null, 2)}`;
//         } catch (error) {
//           console.error(`Error executing tool ${name}:`, error);
//           result += `\n\nError executing tool ${name}: ${error.message}`;
//         }
//       }
//     }
//   }

//   res.status(200).json({ result });
// } catch (error) {
//   console.error('Error in API route:', error);
//   res
//     .status(500)
//     .json({ error: 'Internal server error', details: error.message });
// }
