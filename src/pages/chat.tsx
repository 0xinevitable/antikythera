import { ToolMessage, ToolMessageChunk } from '@langchain/core/messages';
import React, { useCallback, useRef, useState } from 'react';

import { CoinData } from '@/constants/aptos-coins';

type ParsedLine =
  | {
      type: 'tool_calls';
      // FIXME: ?
      data: SerializedToolMessage[];
    }
  | {
      type: 'final_response';
      data: any;
    };

type SerializedJSON = string;

// FIXME: Check with Anthropic too
type OpenAIToolCall = {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: SerializedJSON; // JSON stringified
  };
};

type AntikytheraToolArgs = {
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
};

type SerializedToolMessage = {
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

type AntiKytheraToolMessage = SerializedToolMessage & {
  kwargs: AntikytheraToolArgs;
};

type Message =
  | {
      role: 'user' | 'assistant' | 'error';
      content: React.ReactNode;
    }
  | ({
      role: 'tool';
    } & AntiKytheraToolMessage);

const decodeToolMessage = (
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

const CoinSearchList: React.FC<{ coins: CoinData[] }> = ({ coins }) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);

  if (coins.length === 0) {
    return <p>No results found.</p>;
  }

  const renderedCoins = collapsed ? coins.slice(0, 5) : coins;

  return (
    <ul>
      <span>{`${coins.length} Results`}</span>
      {renderedCoins.map((coin) => (
        <div key={coin.token_type.type} className="flex">
          <img
            src={coin.logo_url}
            alt={coin.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex flex-col">
            <p className="text-[12px] font-bold">{coin.symbol}</p>
            <h3 className="text-[10px]">{coin.name}</h3>
          </div>
        </div>
      ))}
      {coins.length > 5 && (
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="text-blue-500"
        >
          {collapsed ? 'Show more' : 'Show less'}
        </button>
      )}
    </ul>
  );
};

async function fetchStreamingResponse(
  messages: Message[],
  onUpdate: React.Dispatch<React.SetStateAction<Message[]>>,
  signal: AbortSignal,
): Promise<void> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
    signal,
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === '') continue;
        try {
          const parsedLine: ParsedLine = JSON.parse(line);

          if (parsedLine.type === 'tool_calls') {
            console.log('Tool calls:', parsedLine.data);
            for (const serializedToolMessage of parsedLine.data) {
              const toolMessage = decodeToolMessage(serializedToolMessage);
              if (toolMessage.kwargs && toolMessage.kwargs.content) {
                onUpdate((prev) => [
                  ...prev,
                  {
                    role: 'tool',
                    ...toolMessage,
                  },
                ]);
              } else {
                // FIXME: ?
              }
            }
          } else if (parsedLine.type === 'final_response') {
            console.log('Final response:', parsedLine.data);
            onUpdate((prev) => [
              ...prev,
              { role: 'assistant', content: parsedLine.data },
            ]);
          }
        } catch (error) {
          console.error('Error parsing line:', error);
        }
      }
    }
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      console.log('Fetch aborted');
    } else {
      throw error;
    }
  } finally {
    reader.releaseLock();
  }
}

const AgentPage: React.FC = () => {
  const [input, setInput] = useState<string>(
    'APT->USDC 경로 안에 있는 각각의 풀 상태를 알려줘. 그리고 100 APT 넣었을 때 결과값 예상해줘.',
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isLoading) return;

      setIsLoading(true);
      const newMessage: Message = { role: 'user', content: input };
      setMessages((prev) => [...prev, newMessage]);

      abortControllerRef.current = new AbortController();

      try {
        await fetchStreamingResponse(
          [...messages, newMessage],
          setMessages,
          abortControllerRef.current.signal,
        );
      } catch (error) {
        console.error('Error:', error);
        setMessages((prev) => [
          ...prev,
          {
            role: 'error',
            content: 'An error occurred while processing your request.',
          },
        ]);
      } finally {
        setIsLoading(false);
        setInput('');
        abortControllerRef.current = null;
      }
    },
    [input, messages, isLoading],
  );

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl p-4 mx-auto bg-white">
      <h1 className="mb-4 text-2xl font-bold">Agent</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter your query here..."
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="p-2 mt-2 mr-2 text-white bg-blue-500 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Submit'}
        </button>
        {isLoading && (
          <button
            type="button"
            onClick={handleStop}
            className="p-2 mt-2 text-white bg-red-500 rounded"
          >
            Stop
          </button>
        )}
      </form>
      <div className="p-4 bg-gray-100 rounded">
        <h2 className="mb-2 font-bold">Response:</h2>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 p-2 rounded ${
              message.role === 'user'
                ? 'bg-blue-100'
                : message.role === 'assistant'
                  ? 'bg-green-100'
                  : message.role === 'tool'
                    ? 'bg-yellow-100'
                    : 'bg-red-100'
            }`}
          >
            <strong>
              {message.role}:{' '}
              {message.role === 'tool' ? message.kwargs.name : null}
            </strong>
            <pre className="overflow-x-auto whitespace-pre-wrap">
              {message.role !== 'tool' ? message.content : null}
              {message.role === 'tool' &&
                message.kwargs.name === 'searchCoin' && (
                  <CoinSearchList coins={message.kwargs.content} />
                )}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentPage;
