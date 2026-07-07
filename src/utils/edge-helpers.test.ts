import { describe, expect, it, vi } from 'vitest';
import { getEdgeContext, getClientIp } from './edge-helpers';

describe('edge-helpers', () => {
  describe('getEdgeContext', () => {
    it('extracts env from locals.runtime', () => {
      const locals = {
        runtime: {
          env: { AI: { run: vi.fn() } },
        },
      } as unknown as App.Locals;
      const context = getEdgeContext(locals);
      expect(context.AI).toBeDefined();
    });

    it('falls back to process.env if locals.runtime is missing', () => {
      const originalEnv = process.env;
      process.env = { ...originalEnv, TEST_VAR: 'test' } as unknown as NodeJS.ProcessEnv;

      const locals = {} as App.Locals;
      const context = getEdgeContext(locals);
      expect((context as unknown as Record<string, string>).TEST_VAR).toBe('test');

      process.env = originalEnv;
    });

    it('handles missing process.env gracefully', () => {
      const originalProcess = global.process;
      // @ts-expect-error - testing environment where process is missing
      delete global.process;

      const locals = {} as App.Locals;
      const context = getEdgeContext(locals);
      expect(context).toEqual({});

      global.process = originalProcess;
    });
  });

  describe('getClientIp', () => {
    it('prioritizes cf-connecting-ip', () => {
      const request = new Request('http://localhost', {
        headers: {
          'cf-connecting-ip': '1.1.1.1',
          'x-forwarded-for': '2.2.2.2',
        },
      });
      expect(getClientIp(request)).toBe('1.1.1.1');
    });

    it('falls back to x-forwarded-for', () => {
      const request = new Request('http://localhost', {
        headers: {
          'x-forwarded-for': '2.2.2.2, 3.3.3.3',
        },
      });
      expect(getClientIp(request)).toBe('2.2.2.2');
    });

    it('returns anonymous if no IP headers are present', () => {
      const request = new Request('http://localhost');
      expect(getClientIp(request)).toBe('anonymous');
    });
  });
});
