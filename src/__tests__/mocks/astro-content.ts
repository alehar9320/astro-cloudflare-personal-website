import { vi } from 'vitest';

export const defineCollection = vi.fn((config) => config);
export const getCollection = vi.fn().mockResolvedValue([]);
export const getEntry = vi.fn().mockResolvedValue(null);
