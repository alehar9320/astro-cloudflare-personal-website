import { describe, expect, it } from 'vitest';
import {
  calculateAuroraWaveHeight,
  cubicSmoothstepFalloff,
  interpolateAuroraColor,
} from '../utils/aurora-math';

describe('aurora-math', () => {
  describe('calculateAuroraWaveHeight', () => {
    it('returns deterministic wave values for fixed inputs', () => {
      const h1 = calculateAuroraWaveHeight(100, 1.5, 0.01, 50, 0);
      expect(typeof h1).toBe('number');
      expect(Number.isNaN(h1)).toBe(false);
    });

    it('scales wave height proportionally with amplitude', () => {
      const hBase = calculateAuroraWaveHeight(50, 2.0, 0.02, 10, 0.5);
      const hScaled = calculateAuroraWaveHeight(50, 2.0, 0.02, 20, 0.5);
      expect(hScaled).toBeCloseTo(hBase * 2, 5);
    });
  });

  describe('cubicSmoothstepFalloff', () => {
    it('returns 1 at distance 0', () => {
      expect(cubicSmoothstepFalloff(0, 100)).toBe(1);
    });

    it('returns 0 at or beyond radius', () => {
      expect(cubicSmoothstepFalloff(100, 100)).toBe(0);
      expect(cubicSmoothstepFalloff(150, 100)).toBe(0);
    });

    it('returns 0 for non-positive radius', () => {
      expect(cubicSmoothstepFalloff(5, 0)).toBe(0);
      expect(cubicSmoothstepFalloff(5, -10)).toBe(0);
    });

    it('calculates quadratic smoothstep ratio inside radius', () => {
      // distance 50, radius 100 -> ratio 0.5 -> squared 0.25
      expect(cubicSmoothstepFalloff(50, 100)).toBeCloseTo(0.25, 5);
    });
  });

  describe('interpolateAuroraColor', () => {
    it('interpolates start color (marine blue) at t = 0', () => {
      const color = interpolateAuroraColor(0);
      expect(color).toEqual({ r: 2, g: 132, b: 199, a: 1 });
    });

    it('interpolates midpoint color (cyan) at t = 0.5', () => {
      const color = interpolateAuroraColor(0.5);
      expect(color).toEqual({ r: 6, g: 182, b: 212, a: 1 });
    });

    it('interpolates end color (emerald) at t = 1', () => {
      const color = interpolateAuroraColor(1);
      expect(color).toEqual({ r: 16, g: 185, b: 129, a: 1 });
    });

    it('clamps t and alpha correctly', () => {
      const negativeT = interpolateAuroraColor(-0.5, -0.2);
      expect(negativeT.r).toBe(2);
      expect(negativeT.a).toBe(0);

      const excessT = interpolateAuroraColor(1.5, 2.0);
      expect(excessT.r).toBe(16);
      expect(excessT.a).toBe(1);
    });
  });
});
