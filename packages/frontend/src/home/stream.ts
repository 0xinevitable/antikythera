import { Message, ParsedLine, decodeToolMessage } from './types';

export async function fetchStreamingResponse(
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

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Stream not found!');
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let currentAssistantMessage = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;
        console.log(line);
      }
    }
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      console.log('Fetch aborted');
      return;
    }
    throw error;
  } finally {
    reader.releaseLock();
  }
}
