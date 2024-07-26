// app/page.tsx
'use client';

import { useChat, useCompletion } from 'ai/react';
import { useState } from 'react';

// app/page.tsx

// app/page.tsx

// app/page.tsx

// app/page.tsx

// app/page.tsx

// app/page.tsx

export default function ThalaSwapAgent() {
  // const [input, setInput] = useState(
  //   'APT->USDC 경로 안에 있는 각각의 풀 상태를 알려줘. 그리고 100 APT 넣었을 때 결과값 예상해줘.',
  // );
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialInput:
      'APT->USDC 경로 안에 있는 각각의 풀 상태를 알려줘. 그리고 100 APT 넣었을 때 결과값 예상해줘.',
  });

  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   complete(input);
  // };

  return (
    <div className="max-w-lg p-4 mx-auto bg-white">
      <h1 className="mb-4 text-2xl font-bold">ThalaSwap Agent</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={input}
          // onChange={(e) => setInput(e.target.value)}
          onChange={handleInputChange}
          placeholder="Enter your query here..."
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="p-2 mt-2 text-white bg-blue-500 rounded"
        >
          Submit
        </button>
      </form>
      <div className="p-4 bg-gray-100 rounded">
        <h2 className="mb-2 font-bold">Response:</h2>
        <pre className="whitespace-pre-wrap">{JSON.stringify(messages)}</pre>
      </div>
    </div>
  );
}
