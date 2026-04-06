import { vi } from 'vitest';
export const z = {
  object: vi.fn(() => ({
    optional: vi.fn(),
  })),
  string: vi.fn(() => ({
    optional: vi.fn(),
  })),
  coerce: {
    date: vi.fn(),
  },
  array: vi.fn(),
};
