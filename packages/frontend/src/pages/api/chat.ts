import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from '@langchain/core/messages';
import { DynamicStructuredTool, DynamicTool } from '@langchain/core/tools';
import { ChatOpenAI } from '@langchain/openai';
import { NextApiRequest, NextApiResponse } from 'next';

import { Message } from '@/home/types';
import { searchCoinTool } from '@/tools/coins';
import { chainTVLTool, listChainProtocolsTool } from '@/tools/defillama';
import { kanaSwapQuoteTool } from '@/tools/kanaswap';
// import { findSwapRouteTool } from '@/tools/thalaswap';
import { formatUnitsTool, parseUnitsTool } from '@/tools/units';
import { currentWalletAddressTool } from '@/tools/wallet';

export const maxDuration = 300; // 5 minutes

type ExtendedTool = DynamicTool | DynamicStructuredTool<any>;

const tools: ExtendedTool[] = [
  currentWalletAddressTool,
  searchCoinTool,
  // findSwapRouteTool,
  kanaSwapQuoteTool,
  // thalaSwapABITool,
  chainTVLTool,
  listChainProtocolsTool,
  parseUnitsTool,
  formatUnitsTool,
];

const toolsByName = {
  currentWalletAddress: currentWalletAddressTool,
  searchCoin: searchCoinTool,
  // findSwapRoute: findSwapRouteTool,
  kanaSwapQuote: kanaSwapQuoteTool,
  chainTVL: chainTVLTool,
  listChainProtocols: listChainProtocolsTool,
  // getThalaSwapABI: thalaSwapABITool,
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

  try {
    const data = req.body as { messages: Message[] };
    // const lastMessage = data.messages[data.messages.length - 1].content;
    console.log(data.messages.map((v: any) => console.log(v)));

    const llm = new ChatOpenAI({
      model: 'gpt-4o',
      temperature: 0,
      streaming: true,
      apiKey:
        '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',
    });
    const llmWithTools = llm.bind({ tools });

    let messages: BaseMessage[] = data.messages.flatMap((v) => {
      if (v.role === 'user') {
        return new HumanMessage(v.content);
      }
      if (v.role === 'assistant') {
        return new AIMessage(v.content);
      }
      if (v.role === 'tool') {
        return [
          new AIMessage('', {
            ...v.kwargs,
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
            ...v.kwargs,
            content: JSON.stringify(v.kwargs.content),
          }),
        ];
      }
      if (v.role === 'error') {
        return [];
      }
      return [];
    });
    let finalResponse: string | null = null;

    const stream = new ReadableStream({
      async start(controller) {
        while (finalResponse === null) {
          const response = await llmWithTools.invoke([
            new SystemMessage({
              content:
                'If asked a list, try to answer with a markdown table with much information as possible. Always try to state the source of the information.',
            }),
            ...messages,
          ]);
          console.log(JSON.stringify(response));

          if (
            'additional_kwargs' in response &&
            response.additional_kwargs.tool_calls
          ) {
            let hasStopFlag: boolean = false;

            const toolMessages: ToolMessage[] = [];
            for (const toolCall of response.additional_kwargs.tool_calls ||
              []) {
              if (toolCall.type === 'function' && toolCall.function) {
                const { name, arguments: argsString } = toolCall.function;
                try {
                  const args = JSON.parse(argsString);

                  controller.enqueue(
                    JSON.stringify({
                      type: 'pre_tool_call',
                      data: {
                        tool_call_id: toolCall.id,
                        name: name,
                        additional_kwargs: {
                          // tool_calls: [toolCall],
                          tool_call: toolCall,
                        },
                      },
                    }) + '\n',
                  );

                  const result = await runTool(name, args);

                  if (result === 'STOP_CURRENT_WALLET_ADDRESS') {
                    hasStopFlag = true;
                  }

                  const toolMessage = new ToolMessage({
                    content: result,
                    tool_call_id: toolCall.id,
                    name: name,
                    additional_kwargs: {
                      // tool_calls: [toolCall],
                      tool_call: toolCall,
                    },
                  });
                  toolMessages.push(toolMessage);

                  controller.enqueue(
                    JSON.stringify({
                      type: 'tool_calls',
                      data: [toolMessage],
                    }) + '\n',
                  );
                } catch (error) {
                  console.error(`Error executing tool ${name}:`, error);
                }
              }
            }

            messages.push(response as AIMessage);
            messages.push(...toolMessages);

            // Send the tool calls and results as a JSONL stream
            // controller.enqueue(
            //   JSON.stringify({ type: 'tool_calls', data: toolMessages }) + '\n',
            // );

            if (hasStopFlag) {
              controller.enqueue(
                JSON.stringify({ type: 'final_response' }) + '\n',
              );
              controller.close();
              return;
            }
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
  } catch (err) {
    return res
      .status(500)
      .send(
        (err as Error).message ||
          'An error occurred while processing your request.',
      );
  }
}
