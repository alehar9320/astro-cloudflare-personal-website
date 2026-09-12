import { describe, expect, it } from 'vitest';
import { calculateWaveHeight, clampDpr, formatRgba, interpolateRgb } from './aurora-math';

describe('aurora-math utilities', () => {
  describe('clampDpr', () => {
    it('caps high DPI ratios at 2.0', () => {
      expect(clampDpr(3)).toBe(2);
      expect(clampDpr(2.5)).toBe(2);
      expect(clampDpr(2)).toBe(2);
    });

    it('passes through ratios between 1.0 and 2.0', () => {
      expect(clampDpr(1.5)).toBe(1.5);
      expect(clampDpr(1)).toBe(1);
    });

    it('fallbacks to 1 for invalid or sub-zero inputs', () => {
      expect(clampDpr(0)).toBe(1);
      expect(clampDpr(-1)).toBe(1);
      expect(clampDpr(NaN)).toBe(1);
    });
  });

  describe('calculateWaveHeight', () => {
    it('returns a numeric wave superposition value', () => {
      const height = calculateWaveHeight(10, 20, 1.5, 0.05, 40);
      expect(typeof height).toBe('number');
      expect(Number.isNaN(height)).toBe(false);
    });

    it('scales proportionally with amplitude', () => {
      const h1 = calculateWaveHeight(10, 20, 0, 0.05, 10);
      const h2 = calculateWaveHeight(10, 20, 0, 0.05, 20);
      expect(h2).toBeCloseTo(h1 * 2, 5);
    });

    it('produces time-dependent variation', () => {
      const h1 = calculateWaveHeight(5, 5, 0, 0.1, 10);
      const h2 = calculateWaveHeight(5, 5, 1, 0.1, 10);
      expect(h1).not.toBe(h2);
    });
  });

  describe('interpolateRgb', () => {
    const start: [number, number, number] = [0, 100, 200];
    const end: [number, number, number] = [100, 200, 255];

    it('returns start color at factor 0', () => {
      expect(interpolateRgb(start, end, 0)).toEqual(start);
    });

    it('returns end color at factor 1', () => {
      expect(interpolateRgb(start, end, 1)).toEqual(end);
    });

    it('interpolates midpoint correctly', () => {
      expect(interpolateRgb(start, end, 0.5)).toEqual([50, 150, 228]);
    });

    it('clamps factors outside [0, 1]', () => {
      expect(interpolateRgb(start, end, -0.5)).toEqual(start);
      expect(interpolateRgb(start, end, 1.5)).toEqual(end);
    });
  });

  describe('formatRgba', () => {
    it('formats valid rgb tuple and alpha', () => {
      expect(formatRgba([10, 20, 30], 0.5)).toBe('rgba(10, 20, 30, 0.500)');
    });

    it('clamps alpha between 0 and 1', () => {
      expect(formatRgba([10, 20, 30], 1.5)).toBe('rgba(10, 20, 30, 1.000)');
      expect(formatRgba([10, 20, 30], -0.2)).toBe('rgba(10, 20, 30, 0.000)');
    });
  });
});
