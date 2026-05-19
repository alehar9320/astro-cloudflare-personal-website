const DATA_PREFIX = 'data:';
const DONE_MARKER = '[DONE]';

interface SseParserState {
  currentEventLines: string[];
  partialLine: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function looksLikeSsePayload(raw: string): boolean {
  return raw.includes(DATA_PREFIX) || raw.includes(DONE_MARKER) || raw.includes('event:');
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

  if (isFinalChunk && state.currentEventLines.length > 0) {
    parsedText += extractResponseFromPayload(state.currentEventLines.join('\n').trim());
    state.currentEventLines = [];
  }

  return parsedText;
}

export function createChatStreamParser() {
  const state: SseParserState = {
    currentEventLines: [],
    partialLine: '',
  };

  return {
    push(chunk: string) {
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
