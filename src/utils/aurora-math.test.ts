import { describe, expect, it } from 'vitest';
import { calculateAuroraWave, refractColor } from './aurora-math';

describe('aurora-math utility', () => {
  describe('calculateAuroraWave', () => {
    it('returns deterministic numeric wave heights', () => {
      const h1 = calculateAuroraWave(100, 1000);
      const h2 = calculateAuroraWave(100, 1000);
      expect(typeof h1).toBe('number');
      expect(h1).toBe(h2);
    });

    it('produces continuous wave variation across time', () => {
      const h1 = calculateAuroraWave(100, 0);
      const h2 = calculateAuroraWave(100, 10);
      expect(h1).not.toBe(h2);
      expect(Math.abs(h1 - h2)).toBeLessThan(5);
    });

    it('respects custom parameters for frequency and amplitude', () => {
      const defaultVal = calculateAuroraWave(100, 100);
      const highAmpVal = calculateAuroraWave(100, 100, { baseAmplitude: 200 });
      expect(Math.abs(highAmpVal)).toBeGreaterThan(Math.abs(defaultVal));
    });
  });

  describe('refractColor', () => {
    it('returns valid rgba string for min displacement (-1)', () => {
      const color = refractColor(-1, 0.8);
      expect(color).toBe('rgba(10, 25, 47, 0.8)');
    });

    it('returns valid rgba string for max displacement (1)', () => {
      const color = refractColor(1, 1);
      expect(color).toBe('rgba(0, 242, 254, 1)');
    });

    it('interpolates midpoint color displacement (0)', () => {
      const color = refractColor(0, 0.5);
      expect(color).toBe('rgba(5, 134, 151, 0.5)');
    });

    it('clamps values below -1 or above 1 safely', () => {
      expect(refractColor(-5, 0.8)).toBe('rgba(10, 25, 47, 0.8)');
      expect(refractColor(10, 0.8)).toBe('rgba(0, 242, 254, 0.8)');
    });
  });
});
