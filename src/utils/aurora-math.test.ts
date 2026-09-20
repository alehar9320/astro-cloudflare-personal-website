import { describe, expect, it } from 'vitest';
import {
  calculatePointerDisplacement,
  calculateWaveHeight,
  cubicSmoothstepFalloff,
  getMobileQualityScale,
} from './aurora-math';

describe('aurora-math', () => {
  describe('calculateWaveHeight', () => {
    it('returns deterministic numerical wave offset', () => {
      const height = calculateWaveHeight(100, 1.5, 0.02, 30, 0);
      expect(typeof height).toBe('number');
      expect(Number.isNaN(height)).toBe(false);
    });

    it('scales linearly with amplitude', () => {
      const baseHeight = calculateWaveHeight(50, 0, 0.01, 10);
      const scaledHeight = calculateWaveHeight(50, 0, 0.01, 20);
      expect(scaledHeight).toBeCloseTo(baseHeight * 2, 5);
    });

    it('shifts correctly with phase', () => {
      const h1 = calculateWaveHeight(10, 0, 0.01, 15, 0);
      const h2 = calculateWaveHeight(10, 0, 0.01, 15, Math.PI);
      expect(h1).not.toEqual(h2);
    });
  });

  describe('cubicSmoothstepFalloff', () => {
    it('returns 1 at zero distance', () => {
      expect(cubicSmoothstepFalloff(0, 100)).toBe(1);
      expect(cubicSmoothstepFalloff(-5, 100)).toBe(1);
    });

    it('returns 0 at or beyond radius', () => {
      expect(cubicSmoothstepFalloff(100, 100)).toBe(0);
      expect(cubicSmoothstepFalloff(150, 100)).toBe(0);
      expect(cubicSmoothstepFalloff(50, 0)).toBe(0);
      expect(cubicSmoothstepFalloff(50, -10)).toBe(0);
    });

    it('computes exact cubic smoothstep square attenuation (1 - d/r)^2', () => {
      // At distance = 50, radius = 100: normalized = 1 - 0.5 = 0.5 -> 0.5^2 = 0.25
      expect(cubicSmoothstepFalloff(50, 100)).toBe(0.25);
      // At distance = 25, radius = 100: normalized = 0.75 -> 0.75^2 = 0.5625
      expect(cubicSmoothstepFalloff(25, 100)).toBe(0.5625);
    });
  });

  describe('calculatePointerDisplacement', () => {
    it('returns zero displacement outside interaction radius', () => {
      const disp = calculatePointerDisplacement(0, 0, 200, 200, 100);
      expect(disp).toEqual({ dx: 0, dy: 0, intensity: 0 });
    });

    it('returns radial displacement pointing away from pointer', () => {
      // Pointer at (100, 100), point at (130, 100), radius 100 -> dx > 0, dy approx 0
      const disp = calculatePointerDisplacement(100, 100, 130, 100, 100);
      expect(disp.intensity).toBeGreaterThan(0);
      expect(disp.dx).toBeGreaterThan(0);
      expect(disp.dy).toBeCloseTo(0, 5);
    });

    it('handles exact zero distance without returning NaN', () => {
      const disp = calculatePointerDisplacement(100, 100, 100, 100, 100);
      expect(disp.intensity).toBe(1);
      expect(Number.isNaN(disp.dx)).toBe(false);
      expect(Number.isNaN(disp.dy)).toBe(false);
      expect(disp.dx).toBe(0);
      expect(disp.dy).toBe(0);
    });
  });

  describe('getMobileQualityScale', () => {
    it('returns 0.5 for mobile width < 640', () => {
      expect(getMobileQualityScale(375, 1)).toBe(0.5);
      expect(getMobileQualityScale(600, 2)).toBe(0.5);
    });

    it('returns 0.5 for high device pixel ratio > 2.5', () => {
      expect(getMobileQualityScale(1200, 3)).toBe(0.5);
    });

    it('returns 1.0 for standard desktop viewports', () => {
      expect(getMobileQualityScale(1024, 1)).toBe(1.0);
      expect(getMobileQualityScale(1440, 2)).toBe(1.0);
    });
  });
});
