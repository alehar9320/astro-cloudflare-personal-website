import { describe, it, expect, vi } from 'vitest';
import * as astroZod from '../__tests__/mocks/astro-zod';
import { normalizeRelease, splitReleaseBody } from '../utils/github-releases';
import { createChatStreamParser } from '../utils/chat-stream';
import { POST } from '../pages/api/chat';
import { env as workersEnv } from 'cloudflare:workers';

const mockEnv = workersEnv as any;

describe('StuntDouble Coverage Gap-Filler', () => {
  it('covers astro-zod mock explicitly', () => {
    expect(astroZod.z).toBeDefined();
    const schema = astroZod.z.string();
    expect(schema.parse('test')).toBe('test');
    // Ensure all exported members are touched
    expect(typeof astroZod.z.object).toBe('function');
  });

  it('handles normalizeRelease edge cases: undefined tag_name', () => {
    expect(normalizeRelease({ tag_name: undefined })).toBeNull();
  });

  it('handles normalizeRelease edge cases: whitespace name', () => {
    const release = normalizeRelease({ tag_name: 'v1.0.0', name: '   ' });
    expect(release?.title).toBe('v1.0.0');
  });

  it('handles normalizeRelease edge cases: missing html_url', () => {
    const release = normalizeRelease({ tag_name: 'v1.0.0' });
    expect(release?.url).toContain('github.com');
  });

  it('handles splitReleaseBody with empty body', () => {
    expect(splitReleaseBody('')).toEqual([]);
  });

  it('handles chat-stream parser with \\r\\n line endings', () => {
    const parser = createChatStreamParser();
    const chunk = 'data: {"response":"Hello"}\r\n\r\ndata: {"response":" World"}\r\n\r\n';
    expect(parser.push(chunk)).toBe('Hello World');
  });

  it('falls back to anonymous for rate limiting when IP header is missing', async () => {
    const ai = { run: vi.fn().mockResolvedValue(new ReadableStream()) };
    const get = vi.fn().mockResolvedValue('0');
    const put = vi.fn().mockResolvedValue(undefined);
    const store = { get, put } as unknown as KVNamespace;
    mockEnv.AI = ai;
    mockEnv.CHAT_STORE = store;

    const request = new Request('https://example.com/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Hi' }] }),
    });

    const response = await POST({ request, locals: {} } as any);
    expect(response.status).toBe(200);
    expect(get).toHaveBeenCalledWith('chat-limit:anonymous');
  });
});
