import { vi } from 'vitest';

const stringMock = {
  optional: vi.fn().mockReturnThis(),
  min: vi.fn().mockReturnThis(),
};

export const z = {
  object: vi.fn(() => ({
    optional: vi.fn().mockReturnThis(),
  })),
  string: vi.fn(() => stringMock),
  coerce: {
    date: vi.fn().mockReturnThis(),
  },
  array: vi.fn().mockReturnThis(),
};
