import { describe, expect, it } from 'vitest';
import {
  calculatePointerDistortion,
  calculateWaveY,
  clampDpr,
  interpolateAuroraColor,
} from './aurora-math';

describe('aurora-math utilities', () => {
  describe('clampDpr', () => {
    it('returns 1 for invalid or non-positive values', () => {
      expect(clampDpr(0)).toBe(1);
      expect(clampDpr(-1.5)).toBe(1);
      expect(clampDpr(NaN)).toBe(1);
      expect(clampDpr(Infinity)).toBe(1);
    });

    it('returns exact DPR for standard display ratios up to 2', () => {
      expect(clampDpr(1)).toBe(1);
      expect(clampDpr(1.25)).toBe(1.25);
      expect(clampDpr(1.5)).toBe(1.5);
      expect(clampDpr(2)).toBe(2);
    });

    it('caps high retina pixel ratios at 2', () => {
      expect(clampDpr(3)).toBe(2);
      expect(clampDpr(4)).toBe(2);
    });
  });

  describe('calculateWaveY', () => {
    it('computes expected wave position deterministically', () => {
      const baseY = 100;
      const amplitude = 20;
      const frequency = 0.01;
      const time = 0;

      const y = calculateWaveY(0, time, baseY, amplitude, frequency);
      // sin(0) = 0 for both primary and secondary waves, so should equal baseY
      expect(y).toBeCloseTo(100, 5);
    });

    it('varies height smoothly with x and time parameters', () => {
      const y1 = calculateWaveY(10, 0, 100, 20, 0.05);
      const y2 = calculateWaveY(10, 1, 100, 20, 0.05);

      expect(typeof y1).toBe('number');
      expect(typeof y2).toBe('number');
      expect(y1).not.toBe(y2);
    });
  });

  describe('calculatePointerDistortion', () => {
    it('returns 0 when pointer is beyond distortion radius', () => {
      const distortion = calculatePointerDistortion(0, 0, 200, 200, 100, 30);
      expect(distortion).toBe(0);
    });

    it('returns 0 for non-positive interaction radius', () => {
      expect(calculatePointerDistortion(10, 10, 10, 10, 0, 30)).toBe(0);
      expect(calculatePointerDistortion(10, 10, 10, 10, -50, 30)).toBe(0);
    });

    it('returns maximum displacement when pointer is at exact coordinates', () => {
      const maxDisplacement = 40;
      const distortion = calculatePointerDistortion(50, 50, 50, 50, 100, maxDisplacement);
      expect(distortion).toBeCloseTo(maxDisplacement, 5);
    });

    it('calculates smooth intermediate displacement inside interaction radius', () => {
      const distortion = calculatePointerDistortion(0, 0, 50, 0, 100, 50);
      expect(distortion).toBeGreaterThan(0);
      expect(distortion).toBeLessThan(50);
    });
  });

  describe('interpolateAuroraColor', () => {
    it('returns valid hsla string in dark theme', () => {
      const colorMin = interpolateAuroraColor(0, true);
      const colorMax = interpolateAuroraColor(1, true);

      expect(colorMin).toMatch(/^hsla\(\d+, \d+%, \d+%, \d+(\.\d+)?\)$/);
      expect(colorMax).toMatch(/^hsla\(\d+, \d+%, \d+%, \d+(\.\d+)?\)$/);
      expect(colorMin).not.toBe(colorMax);
    });

    it('returns valid hsla string in light theme', () => {
      const color = interpolateAuroraColor(0.5, false);
      expect(color).toMatch(/^hsla\(\d+, \d+%, \d+%, \d+(\.\d+)?\)$/);
    });

    it('clamps factors outside [0, 1] range', () => {
      const colorUnder = interpolateAuroraColor(-0.5, true);
      const colorZero = interpolateAuroraColor(0, true);
      expect(colorUnder).toBe(colorZero);

      const colorOver = interpolateAuroraColor(1.5, true);
      const colorOne = interpolateAuroraColor(1, true);
      expect(colorOver).toBe(colorOne);
    });
  });
});
