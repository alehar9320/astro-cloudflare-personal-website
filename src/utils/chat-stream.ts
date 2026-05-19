const DATA_PREFIX = 'data:';
const DONE_MARKER = '[DONE]';

interface SseParserState {
  currentEventLines: string[];
  partialLine: string;
  sawSseEvents: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

const SSE_DATA_REGEX = /(^|\n)\s*data:\s*/;
const SSE_EVENT_REGEX = /(^|\n)\s*event:\s*[\w-]+/;

function looksLikeSsePayload(raw: string): boolean {
  return SSE_DATA_REGEX.test(raw) || SSE_EVENT_REGEX.test(raw) || raw.includes(DONE_MARKER);
}

function extractResponseFromPayload(payload: string): string {
  if (!payload || payload === DONE_MARKER) {
    return '';
  }

  try {
    const parsed: unknown = JSON.parse(payload);

    if (isRecord(parsed) && typeof parsed.response === 'string') {
      return parsed.response;
    }
  } catch {
    return '';
  }

  return '';
}

function consumeLine(state: SseParserState, line: string): string {
  if (line === '') {
    const payload = state.currentEventLines.join('\n').trim();
    state.currentEventLines = [];
    if (payload) {
      state.sawSseEvents = true;
    }
    return extractResponseFromPayload(payload);
  }

  if (line.startsWith(DATA_PREFIX)) {
    state.currentEventLines.push(line.slice(DATA_PREFIX.length).trimStart());
  }

  return '';
}

function processBufferedText(state: SseParserState, input: string, isFinalChunk: boolean): string {
  const normalizedInput = `${state.partialLine}${input}`.replaceAll('\r\n', '\n');
  const lines = normalizedInput.split('\n');
  const lastIndex = isFinalChunk ? lines.length : Math.max(lines.length - 1, 0);
  let parsedText = '';

  for (let index = 0; index < lastIndex; index += 1) {
    parsedText += consumeLine(state, lines[index]);
  }

  state.partialLine = isFinalChunk ? '' : lines[lines.length - 1];

  if (isFinalChunk) {
    if (state.currentEventLines.length > 0) {
      const payload = state.currentEventLines.join('\n').trim();
      const extracted = extractResponseFromPayload(payload);
      if (extracted) {
        state.sawSseEvents = true;
        parsedText += extracted;
      }
      state.currentEventLines = [];
    }

    // Support plain text fallback: if we never saw any SSE events, return the raw input
    if (!state.sawSseEvents && parsedText === '') {
      return normalizedInput;
    }
  }

  return parsedText;
}

export function createChatStreamParser() {
  const state: SseParserState = {
    currentEventLines: [],
    partialLine: '',
    sawSseEvents: false,
  };

  return {
    push(chunk: string) {
      if (!state.sawSseEvents && !looksLikeSsePayload(chunk)) {
        return chunk;
      }
      return processBufferedText(state, chunk, false);
    },
    flush() {
      return processBufferedText(state, '', true);
    },
  };
}

export function extractAssistantTextFromSse(raw: string) {
  const parser = createChatStreamParser();
  const text = parser.push(raw) + parser.flush();

  if (text.trim().length > 0) {
    return text;
  }

  return looksLikeSsePayload(raw) ? '' : raw;
}
