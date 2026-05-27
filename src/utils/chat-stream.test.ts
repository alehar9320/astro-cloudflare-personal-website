import { describe, expect, it, vi } from 'vitest';

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
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const raw =
      'data: {"response":null,"usage":{"prompt_tokens":1}}\n\n' +
      'data: {"response":"Hello"}\n\n' +
      'data: not-json\n\n';

    expect(extractAssistantTextFromSse(raw)).toBe('Hello');
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('returns an empty string for SSE-shaped payloads without assistant text', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(extractAssistantTextFromSse('data: not-json\n\n')).toBe('');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'chat_stream_parse_error' })
    );
  });

  it('handles non-Error objects in stream parse catch block', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // Mock JSON.parse to throw a non-Error
    const originalParse = JSON.parse;
    JSON.parse = vi.fn().mockImplementation((input) => {
      if (input === '{"trigger_error":true}') {
        throw 'parse error';
      }
      return originalParse(input);
    });

    expect(extractAssistantTextFromSse('data: {"trigger_error":true}\n\n')).toBe('');
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'chat_stream_parse_error',
        error: 'parse error',
      })
    );

    JSON.parse = originalParse;
  });

  it('treats event-only payloads as SSE and ignores them when they have no response text', () => {
    expect(extractAssistantTextFromSse('event: message\n\n')).toBe('');
  });

  it('falls back to plain text when the input is not SSE', () => {
    expect(extractAssistantTextFromSse('Hello world')).toBe('Hello world');
  });
});
