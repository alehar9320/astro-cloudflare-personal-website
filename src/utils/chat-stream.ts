const DATA_PREFIX = 'data:';
const DONE_MARKER = '[DONE]';

interface SseParserState {
  currentEventLines: string[];
  partialLine: string;
}

/**
 * Type guard to check if a value is a non-null object.
 * @param {unknown} value - The value to check.
 * @returns {boolean} True if the value is a Record.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Checks if a raw string contains common SSE markers.
 * @param {string} raw - The raw string to inspect.
 * @returns {boolean} True if it looks like an SSE payload.
 */
function looksLikeSsePayload(raw: string): boolean {
  return raw.includes(DATA_PREFIX) || raw.includes(DONE_MARKER) || raw.includes('event:');
}

/**
 * Parses a single JSON payload from an SSE data line.
 * @param {string} payload - The raw JSON string from the SSE data.
 * @returns {string} The extracted 'response' field or an empty string.
 */
function extractResponseFromPayload(payload: string): string {
  if (!payload || payload === DONE_MARKER) {
    return '';
  }

  try {
    const parsed: unknown = JSON.parse(payload);

    if (isRecord(parsed) && typeof parsed.response === 'string') {
      return parsed.response;
    }
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : String(e);
    console.error({ event: 'chat_stream_parse_error', error });
    return '';
  }

  return '';
}

/**
 * Processes a single line of the SSE stream, updating the parser state.
 * @param {SseParserState} state - The current parser state.
 * @param {string} line - The line to process.
 * @returns {string} The extracted text if a full event was completed.
 */
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

/**
 * Processes a chunk of text, handling partial lines and buffering.
 * @param {SseParserState} state - The parser state.
 * @param {string} input - The new chunk of text.
 * @param {boolean} isFinalChunk - Whether this is the last chunk.
 * @returns {string} The accumulated parsed text.
 */
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

/**
 * Creates a stateful parser for Server-Sent Events (SSE) chat streams.
 * Handles partial chunks and multi-line payloads.
 * @returns {Object} An object with `push` and `flush` methods.
 */
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

/**
 * Extracts the assistant's text from a raw SSE payload.
 * Useful for one-off parsing of full responses.
 * @param {string} raw - The raw SSE payload string.
 * @returns {string} The extracted assistant text.
 */
export function extractAssistantTextFromSse(raw: string) {
  const parser = createChatStreamParser();
  const text = parser.push(raw) + parser.flush();

  if (text.trim().length > 0) {
    return text;
  }

  return looksLikeSsePayload(raw) ? '' : raw;
}
