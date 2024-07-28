import { Route as ThalaSwapRoute } from '@thalalabs/router-sdk';

import { CoinData } from '@/constants/aptos-coins';

export type ParsedLine =
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
      // FIXME: Thala Swap 맥락 추가해야 함
      content: ThalaSwapRoute;
      name: 'findSwapRoute';
      tool_call_id: string;
      additional_kwargs: {
        // Custom
        tool_call: OpenAIToolCall & {
          function: {
            name: 'findSwapRoute';
            arguments: {
              fromTokenType: CoinType;
              toTokenType: CoinType;
              amountIn: number;
            };
          };
        };
      };
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

export type Message =
  | {
      role: 'user' | 'assistant' | 'error';
      content: string;
    }
  | ({
      role: 'tool';
    } & AntiKytheraToolMessage);

export const decodeToolMessage = (
  toolMessage: SerializedToolMessage,
): AntiKytheraToolMessage => {
  toolMessage.kwargs.content = JSON.parse(toolMessage.kwargs.content);

  // 단일 tool_call 만 있다고 가정
  toolMessage.kwargs.additional_kwargs.tool_call.function.arguments =
    JSON.parse(
      toolMessage.kwargs.additional_kwargs.tool_call.function.arguments,
    );

  return toolMessage as AntiKytheraToolMessage;
};
