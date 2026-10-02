import { describe, expect, it } from 'vitest';
import {
  calculateRefractionDisplacement,
  calculateSpatialStep,
  calculateWaveHeight,
  cubicSmoothstepFalloff,
} from './aurora-math';

describe('aurora-math utilities', () => {
  describe('calculateSpatialStep', () => {
    it('returns 4 for mobile viewports', () => {
      expect(calculateSpatialStep(320)).toBe(4);
      expect(calculateSpatialStep(480)).toBe(4);
    });

    it('scales step sampling step dynamically for larger desktop viewports', () => {
      expect(calculateSpatialStep(1200)).toBe(10);
      expect(calculateSpatialStep(1920)).toBe(16);
    });

    it('handles non-positive viewport widths safely', () => {
      expect(calculateSpatialStep(0)).toBe(4);
      expect(calculateSpatialStep(-500)).toBe(4);
    });
  });

  describe('cubicSmoothstepFalloff', () => {
    it('returns 1 at center (distance = 0)', () => {
      expect(cubicSmoothstepFalloff(0, 100)).toBe(1);
    });

    it('returns 0 at edge or outside radius (distance >= radius)', () => {
      expect(cubicSmoothstepFalloff(100, 100)).toBe(0);
      expect(cubicSmoothstepFalloff(150, 100)).toBe(0);
    });

    it('calculates quadratic falloff at mid-point', () => {
      // (1 - 50/100)^2 = 0.5^2 = 0.25
      expect(cubicSmoothstepFalloff(50, 100)).toBeCloseTo(0.25);
    });

    it('returns 0 for non-positive radius', () => {
      expect(cubicSmoothstepFalloff(10, 0)).toBe(0);
      expect(cubicSmoothstepFalloff(10, -50)).toBe(0);
    });
  });

  describe('calculateWaveHeight', () => {
    it('computes sine height correctly', () => {
      expect(calculateWaveHeight(0, 0, 0.01, 50)).toBe(0);
      expect(calculateWaveHeight(Math.PI / 2, 0, 1, 10)).toBeCloseTo(10);
    });
  });

  describe('calculateRefractionDisplacement', () => {
    it('returns zero displacement outside effect radius', () => {
      const result = calculateRefractionDisplacement(200, 200, 50, 50, 100);
      expect(result).toEqual({ dx: 0, dy: 0 });
    });

    it('returns calculated offset vector inside radius', () => {
      const result = calculateRefractionDisplacement(100, 50, 50, 50, 100, 20);
      // dist = 50, radius = 100, falloff = 0.25, maxOffset = 20 -> dx = 5, dy = 0
      expect(result.dx).toBeCloseTo(5);
      expect(result.dy).toBeCloseTo(0);
    });
  });
});
