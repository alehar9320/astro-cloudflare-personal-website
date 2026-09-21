import { vi } from 'vitest';

export const defineCollection = vi.fn((config) => config);
export const getCollection = vi.fn(async () => []);
export const getEntry = vi.fn(async () => null);
