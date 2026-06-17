import { describe, it, expect } from 'vitest';
import { layeredSine, mapRange, lerp } from './creative-math';

describe('creative-math utilities', () => {
  describe('layeredSine', () => {
    it('returns a value between -1 and 1', () => {
      for (let i = 0; i < 100; i++) {
        const val = layeredSine(Math.random() * 100);
        expect(val).toBeGreaterThanOrEqual(-1);
        expect(val).toBeLessThanOrEqual(1);
      }
    });

    it('returns 0 for input 0', () => {
      expect(layeredSine(0)).toBeCloseTo(0);
    });

    it('handles different layers', () => {
      const val1 = layeredSine(1, 1);
      const val2 = layeredSine(1, 4);
      expect(val1).not.toBe(val2);
    });
  });

  describe('mapRange', () => {
    it('correctly maps a value from one range to another', () => {
      expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
      expect(mapRange(0, 0, 10, 0, 100)).toBe(0);
      expect(mapRange(10, 0, 10, 0, 100)).toBe(100);
      expect(mapRange(2.5, 0, 5, 10, 20)).toBe(15);
    });
  });

  describe('lerp', () => {
    it('correctly interpolates between values', () => {
      expect(lerp(0, 100, 0.5)).toBe(50);
      expect(lerp(0, 100, 0)).toBe(0);
      expect(lerp(0, 100, 1)).toBe(100);
      expect(lerp(10, 20, 0.1)).toBeCloseTo(11);
    });
  });
});
