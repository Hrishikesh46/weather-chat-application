const API_ENDPOINT =
  'https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream';
const COLLEGE_ROLL_NUMBER = '19102B0032';

export const createWeatherRequest = (userMessage, conversationHistory) => {
  return {
    messages: [...conversationHistory, { role: 'user', content: userMessage }],
    runId: 'weatherAgent',
    maxRetries: 2,
    maxSteps: 5,
    temperature: 0.5,
    topP: 1,
    runtimeContext: {},
    threadId: COLLEGE_ROLL_NUMBER,
    resourceId: 'weatherAgent',
  };
};

export const sendWeatherMessage = async (
  request,
  onChunk,
  onComplete,
  onError
) => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7',
        Connection: 'keep-alive',
        'Content-Type': 'application/json',
        'x-mastra-dev-playground': 'true',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Stream reader not available');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        console.log('Processing line:', trimmedLine); // Debug log

        // Handle text content chunks (0: prefix)
        if (trimmedLine.startsWith('0:')) {
          let content = trimmedLine.slice(2);

          // Remove surrounding quotes if present
          if (content.startsWith('"') && content.endsWith('"')) {
            content = content.slice(1, -1);
          }

          // Only send non-empty content
          if (content && content.trim()) {
            console.log('Sending chunk:', content); // Debug log
            onChunk(content);
          }
        }
        // Handle completion (d: prefix indicates final completion)
        else if (trimmedLine.startsWith('d:')) {
          console.log('Stream completed with d: prefix'); // Debug log
          onComplete();
          return;
        }
        // Alternative completion check (e: prefix with stop reason)
        else if (trimmedLine.startsWith('e:')) {
          try {
            const parsed = JSON.parse(trimmedLine.slice(2));
            if (
              parsed.finishReason === 'stop' &&
              parsed.isContinued === false
            ) {
              console.log('Stream completed with e: prefix'); // Debug log
              onComplete();
              return;
            }
          } catch (e) {
            // Continue if parsing fails
            console.log('Failed to parse e: line:', e);
          }
        }
        // Ignore other prefixes (f:, 9:, a:) as they're metadata
      }
    }

    console.log('Stream ended naturally'); // Debug log
    onComplete();
  } catch (error) {
    console.error('Stream error:', error); // Debug log
    onError(error instanceof Error ? error.message : 'Network error occurred');
  }
};
