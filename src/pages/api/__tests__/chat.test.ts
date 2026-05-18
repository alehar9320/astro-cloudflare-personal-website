import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../chat';

describe('Chat API', () => {
  const mockAI = {
    run: vi.fn(),
  };
  const mockStore = {
    get: vi.fn(),
    put: vi.fn(),
  };

  const createRequest = (body: unknown, headers: Record<string, string> = {}) => {
    return new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify(body),
    });
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns 500 if AI binding is missing', async () => {
    const context = {
      request: createRequest({ messages: [] }),
      locals: { runtime: { env: {} } },
    } as unknown as Parameters<typeof POST>[0];

    const response = await POST(context);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('AI binding not found');
  });

  it('enforces rate limits', async () => {
    mockStore.get.mockResolvedValue('20');
    const context = {
      request: createRequest({ messages: [] }, { 'cf-connecting-ip': '1.2.3.4' }),
      locals: { runtime: { env: { AI: mockAI, CHAT_STORE: mockStore } } },
    } as unknown as Parameters<typeof POST>[0];

    const response = await POST(context);
    expect(response.status).toBe(429);
    const data = await response.json();
    expect(data.error).toContain('Rate limit exceeded');
    expect(mockStore.get).toHaveBeenCalledWith('chat-limit:1.2.3.4');
  });

  it('handles missing CHAT_STORE gracefully', async () => {
    const mockStream = new ReadableStream();
    mockAI.run.mockResolvedValue(mockStream);

    const context = {
      request: createRequest({ messages: [{ role: 'user', content: 'hello' }] }),
      locals: { runtime: { env: { AI: mockAI } } },
    } as unknown as Parameters<typeof POST>[0];

    const response = await POST(context);
    expect(response.status).toBe(200);
    expect(mockAI.run).toHaveBeenCalled();
  });

  it('validates message history length', async () => {
    mockStore.get.mockResolvedValue('0');
    const context = {
      request: createRequest({ messages: new Array(11).fill({ role: 'user', content: 'hi' }) }),
      locals: { runtime: { env: { AI: mockAI, CHAT_STORE: mockStore } } },
    } as unknown as Parameters<typeof POST>[0];

    const response = await POST(context);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Invalid message history');
  });

  it('validates message content size', async () => {
    mockStore.get.mockResolvedValue('0');
    const context = {
      request: createRequest({ messages: [{ role: 'user', content: 'a'.repeat(501) }] }),
      locals: { runtime: { env: { AI: mockAI, CHAT_STORE: mockStore } } },
    } as unknown as Parameters<typeof POST>[0];

    const response = await POST(context);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Message too long');
  });

  it('returns a stream on successful request and increments counter', async () => {
    mockStore.get.mockResolvedValue('5');
    const mockStream = new ReadableStream();
    mockAI.run.mockResolvedValue(mockStream);

    const context = {
      request: createRequest({ messages: [{ role: 'user', content: 'hello' }] }),
      locals: { runtime: { env: { AI: mockAI, CHAT_STORE: mockStore } } },
    } as unknown as Parameters<typeof POST>[0];

    const response = await POST(context);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/event-stream');
    expect(mockStore.put).toHaveBeenCalledWith(expect.any(String), '6', { expirationTtl: 3600 });
    expect(mockAI.run).toHaveBeenCalled();
  });

  it('handles null rate limit value (first request)', async () => {
    mockStore.get.mockResolvedValue(null);
    const mockStream = new ReadableStream();
    mockAI.run.mockResolvedValue(mockStream);

    const context = {
      request: createRequest({ messages: [{ role: 'user', content: 'hello' }] }),
      locals: { runtime: { env: { AI: mockAI, CHAT_STORE: mockStore } } },
    } as unknown as Parameters<typeof POST>[0];

    const response = await POST(context);
    expect(response.status).toBe(200);
    expect(mockStore.put).toHaveBeenCalledWith(expect.any(String), '1', { expirationTtl: 3600 });
  });

  it('returns 500 on internal error and logs it', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockAI.run.mockRejectedValue(new Error('AI failed'));

    const context = {
      request: createRequest({ messages: [{ role: 'user', content: 'hello' }] }),
      locals: { runtime: { env: { AI: mockAI } } },
    } as unknown as Parameters<typeof POST>[0];

    const response = await POST(context);
    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Internal server error');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('validates messages is an array', async () => {
    const context = {
      request: createRequest({ messages: 'not an array' }),
      locals: { runtime: { env: { AI: mockAI } } },
    } as unknown as Parameters<typeof POST>[0];

    const response = await POST(context);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Invalid message history');
  });
});
