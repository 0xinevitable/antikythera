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
