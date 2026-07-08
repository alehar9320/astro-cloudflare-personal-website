import { describe, it, expect } from 'vitest';
import { calculateAuroraPoint, lerp, simpleNoise } from '../aurora-math';

describe('Aurora Math Utilities', () => {
  describe('calculateAuroraPoint', () => {
    it('returns deterministic values for the same input', () => {
      const result1 = calculateAuroraPoint(100, 10, 50, 0.01, 0.02);
      const result2 = calculateAuroraPoint(100, 10, 50, 0.01, 0.02);
      expect(result1).toBe(result2);
    });

    it('returns different values for different time inputs', () => {
      const result1 = calculateAuroraPoint(100, 10, 50, 0.01, 0.02);
      const result2 = calculateAuroraPoint(100, 11, 50, 0.01, 0.02);
      expect(result1).not.toBe(result2);
    });
  });

  describe('lerp', () => {
    it('correctly interpolates between values', () => {
      expect(lerp(0, 100, 0.5)).toBe(50);
      expect(lerp(10, 20, 0)).toBe(10);
      expect(lerp(10, 20, 1)).toBe(20);
    });
  });

  describe('simpleNoise', () => {
    it('is bounded within expected range', () => {
      for (let t = 0; t < 100; t += 1) {
        const val = simpleNoise(t);
        expect(val).toBeGreaterThanOrEqual(-1);
        expect(val).toBeLessThanOrEqual(1);
      }
    });
  });
});
