import React, { useCallback, useRef, useState } from 'react';

import { CoinData } from '@/constants/aptos-coins';

interface Message {
  role: 'user' | 'assistant' | 'tool' | 'error';
  tool_name?: string;
  content: React.ReactNode;
}

interface ParsedLine {
  type: 'tool_calls' | 'final_response';
  data: any;
}

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
            for (const toolCall of parsedLine.data) {
              console.log(JSON.stringify(toolCall));
              if (toolCall.kwargs && toolCall.kwargs.content) {
                try {
                  const toolContent = JSON.parse(toolCall.kwargs.content);
                  console.log(toolContent);
                  onUpdate((prev) => [
                    ...prev,
                    {
                      role: 'tool',
                      content:
                        toolCall.kwargs.name === 'searchCoin' ? (
                          <>
                            {(JSON.parse(toolContent) as CoinData[]).map(
                              (coin) => (
                                <div key={coin.token_type.type}>
                                  <img
                                    src={coin.logo_url}
                                    alt={coin.name}
                                    className="w-8 h-8"
                                  />
                                  <h3>{coin.name}</h3>
                                  <p>{coin.symbol}</p>
                                </div>
                              ),
                            )}
                          </>
                        ) : (
                          JSON.stringify(toolContent)
                        ),
                    },
                  ]);
                } catch (error) {
                  console.error('Error parsing tool content:', error);
                  onUpdate((prev) => [
                    ...prev,
                    { role: 'tool', content: toolCall.kwargs.content },
                  ]);
                }
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
    if (error.name === 'AbortError') {
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
            <strong>{message.role}: </strong>
            <pre className="overflow-x-auto whitespace-pre-wrap">
              {message.content}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentPage;
