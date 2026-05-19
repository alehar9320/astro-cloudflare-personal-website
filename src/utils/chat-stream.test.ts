import { describe, expect, it } from 'vitest';

import { createChatStreamParser, extractAssistantTextFromSse } from './chat-stream';

function event(response: string) {
  return `data: ${JSON.stringify({ response, p: 'abc' })}\n\n`;
}

describe('chat stream parser', () => {
  it('extracts readable text from a complete SSE transcript', () => {
    const raw = `${event('As')}${event(' a')}${event(' strategic Product Leader')}${event(' at IFS')}${'data: [DONE]\n\n'}`;

    expect(extractAssistantTextFromSse(raw)).toBe('As a strategic Product Leader at IFS');
  });

  it('buffers partial chunks until a full event arrives', () => {
    const parser = createChatStreamParser();

    expect(parser.push('data: {"response":"As","p":"abc"}')).toBe('');
    expect(parser.push('\n\ndata: {"response":" a","p":"abc"}\n\n')).toBe('As a');
    expect(parser.flush()).toBe('');
  });

  it('flushes a trailing event that ends without a terminating newline', () => {
    const parser = createChatStreamParser();

    expect(parser.push('data: {"response":"End","p":"abc"}')).toBe('');
    expect(parser.flush()).toBe('End');
  });

  it('ignores invalid and metadata-only SSE payloads', () => {
    const raw =
      'data: {"response":null,"usage":{"prompt_tokens":1}}\n\n' +
      'data: {"response":"Hello"}\n\n' +
      'data: not-json\n\n';

    expect(extractAssistantTextFromSse(raw)).toBe('Hello');
  });

  it('returns an empty string for SSE-shaped payloads without assistant text', () => {
    expect(extractAssistantTextFromSse('data: not-json\n\n')).toBe('');
  });

  it('treats event-only payloads as SSE and ignores them when they have no response text', () => {
    expect(extractAssistantTextFromSse('event: message\n\n')).toBe('');
  });

  it('falls back to plain text when the input is not SSE', () => {
    expect(extractAssistantTextFromSse('Hello world')).toBe('Hello world');
  });

  it('supports plain text streams with multiple chunks', () => {
    const parser = createChatStreamParser();

    expect(parser.push('Hello ')).toBe('Hello ');
    expect(parser.push('world')).toBe('world');
    expect(parser.flush()).toBe('');
  });

  it('ignores "event:" when it is not at the start of a line', () => {
    const text = 'Next event: tomorrow';
    expect(extractAssistantTextFromSse(text)).toBe(text);
  });

  it('falls back to raw text if SSE starts but is invalid', () => {
    const parser = createChatStreamParser();

    expect(parser.push('data: {"response": "hi"')).toBe('');
    expect(parser.flush()).toBe('data: {"response": "hi"');
  });
});
