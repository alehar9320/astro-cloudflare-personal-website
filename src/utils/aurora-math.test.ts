import { describe, expect, it } from 'vitest';
import { calculateAuroraWave, calculatePointerRefraction, getAuroraColor } from './aurora-math';

describe('aurora-math utilities', () => {
  describe('calculateAuroraWave', () => {
    it('returns a deterministic wave height for given x and time', () => {
      const height1 = calculateAuroraWave(100, 1000, 30, 0.008, 0.0015);
      const height2 = calculateAuroraWave(100, 1000, 30, 0.008, 0.0015);
      expect(height1).toBe(height2);
    });

    it('scales wave height with amplitude', () => {
      const height10 = calculateAuroraWave(50, 500, 10);
      const height50 = calculateAuroraWave(50, 500, 50);
      expect(Math.abs(height50)).toBeGreaterThan(Math.abs(height10));
    });
  });

  describe('calculatePointerRefraction', () => {
    it('returns zero displacement when point is outside radius', () => {
      const result = calculatePointerRefraction(0, 0, 300, 300, 100, 25);
      expect(result.dx).toBe(0);
      expect(result.dy).toBe(0);
      expect(result.factor).toBe(0);
    });

    it('returns zero displacement when distance is zero', () => {
      const result = calculatePointerRefraction(100, 100, 100, 100, 180, 25);
      expect(result.dx).toBe(0);
      expect(result.dy).toBe(0);
      expect(result.factor).toBe(0);
    });

    it('calculates vector displacement within radius', () => {
      const result = calculatePointerRefraction(150, 100, 100, 100, 100, 20);
      expect(result.factor).toBeGreaterThan(0);
      expect(result.factor).toBeLessThanOrEqual(1);
      expect(result.dx).toBeGreaterThan(0);
      expect(result.dy).toBe(0);
    });
  });

  describe('getAuroraColor', () => {
    it('returns valid rgb color strings for dark theme', () => {
      const lowColor = getAuroraColor(0.1, true);
      const midColor = getAuroraColor(0.5, true);
      const highColor = getAuroraColor(0.9, true);

      expect(lowColor).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
      expect(midColor).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
      expect(highColor).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
    });

    it('returns valid rgb color strings for light theme', () => {
      const lowColor = getAuroraColor(0.2, false);
      const highColor = getAuroraColor(0.8, false);

      expect(lowColor).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
      expect(highColor).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
    });

    it('clamps energy ratio to [0, 1] range', () => {
      const colorMin = getAuroraColor(-0.5, true);
      const color0 = getAuroraColor(0, true);
      const colorMax = getAuroraColor(1.5, true);
      const color1 = getAuroraColor(1, true);

      expect(colorMin).toBe(color0);
      expect(colorMax).toBe(color1);
    });
  });
});
