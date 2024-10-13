import { Route as ThalaSwapRoute } from '@thalalabs/router-sdk';

import { CoinData } from '@/constants/aptos-coins';
import { KanaSwapRouteOption } from '@/tools/kanaswap';

export type ParsedLine =
  | {
      type: 'pre_tool_call';
      data: {
        tool_call_id: string;
        name: string;
        additional_kwargs: {
          tool_call: OpenAIToolCall;
        };
      };
    }
  | {
      type: 'tool_calls';
      // FIXME: ?
      data: SerializedToolMessage[];
    }
  | {
      type: 'final_response';
      data: any;
    };

export type SerializedJSON = string;
export type CoinType = `0x${string}`;

// FIXME: Check with Anthropic too
export type OpenAIToolCall = {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: SerializedJSON; // JSON stringified
  };
};

export type AntikytheraToolArgs =
  | {
      content: CoinData[];
      name: 'searchCoin';
      tool_call_id: string;
      additional_kwargs: {
        // Custom
        tool_call: OpenAIToolCall & {
          function: {
            name: 'searchCoin';
            arguments: {
              query: string;
              // TODO:
              field: 'symbol';
            };
          };
        };
      };
    }
  | {
      content: {
        foundRoutes: Omit<KanaSwapRouteOption, 'chainId'>[];
      };
      name: 'kanaSwapQuote';
      tool_call_id: string;
      additional_kwargs: {
        // Custom
        tool_call: OpenAIToolCall & {
          function: {
            name: 'kanaSwapQuote';
            arguments: {
              inputToken: CoinType;
              outputToken: CoinType;
              amountIn: string;
              slippage: string;
            };
          };
        };
      };
    }
  | {
      content: object;
      name: string;
    };

export type SerializedToolMessage = {
  lc: number;
  type: string; // 'constructor' ?
  id: string[]; // ["langchain_core", "messages", "ToolMessage"]
  kwargs: {
    content: SerializedJSON;
    tool_call_id: string;
    additional_kwargs: {
      // Custom
      tool_call: OpenAIToolCall;
    };
  };
};

export type AntiKytheraToolMessage = SerializedToolMessage & {
  kwargs: AntikytheraToolArgs;
};

export type BasicMessage = {
  role: 'user' | 'assistant' | 'error';
  content: string;
};
export type ToolMessage = {
  role: 'tool';
  status: 'resolved' | 'pending';
} & AntiKytheraToolMessage;

export type Message = BasicMessage | ToolMessage;
export type BasicMessageProps = {
  message: BasicMessage;
};

export const decodeToolMessage = (
  toolMessage: SerializedToolMessage,
): AntiKytheraToolMessage => {
  toolMessage.kwargs.content = JSON.parse(toolMessage.kwargs.content);

  if ('tool_call' in toolMessage.kwargs.additional_kwargs) {
    // 단일 tool_call 만 있다고 가정
    toolMessage.kwargs.additional_kwargs.tool_call.function.arguments =
      JSON.parse(
        toolMessage.kwargs.additional_kwargs.tool_call.function.arguments,
      );
  } else if ('tool_calls' in toolMessage.kwargs.additional_kwargs) {
    // 여러 개의 tool_calls 가 존재할 때 하나만 있다고 가정
    const toolCall = (toolMessage.kwargs.additional_kwargs as any)
      .tool_calls[0];
    (toolMessage.kwargs.additional_kwargs as any).tool_call = {
      ...toolCall,
      function: {
        ...toolCall.function,
        arguments: JSON.parse(toolCall.function.arguments),
      },
    };
  }

  return toolMessage as AntiKytheraToolMessage;
};
