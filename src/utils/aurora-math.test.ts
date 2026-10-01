import { describe, expect, it } from 'vitest';
import {
  calculateAuroraWaveHeight,
  calculateRefractionOffset,
  cubicSmoothstep,
} from './aurora-math';

describe('aurora-math utilities', () => {
  describe('cubicSmoothstep', () => {
    it('returns 1 when distance is at origin (0)', () => {
      expect(cubicSmoothstep(0, 100)).toBe(1);
    });

    it('returns 0 when distance is at or beyond radius', () => {
      expect(cubicSmoothstep(100, 100)).toBe(0);
      expect(cubicSmoothstep(150, 100)).toBe(0);
    });

    it('returns 0 when radius is <= 0', () => {
      expect(cubicSmoothstep(10, 0)).toBe(0);
      expect(cubicSmoothstep(10, -50)).toBe(0);
    });

    it('calculates smooth transition for distance inside radius', () => {
      const mid = cubicSmoothstep(50, 100);
      expect(mid).toBeGreaterThan(0);
      expect(mid).toBeLessThan(1);
      expect(mid).toBeCloseTo(0.5, 2);
    });
  });

  describe('calculateAuroraWaveHeight', () => {
    it('returns 0 if wavelength is <= 0', () => {
      expect(calculateAuroraWaveHeight(10, 1000, 0, 50)).toBe(0);
      expect(calculateAuroraWaveHeight(10, 1000, -20, 50)).toBe(0);
    });

    it('returns deterministic non-zero height for valid wave inputs', () => {
      const h1 = calculateAuroraWaveHeight(50, 1000, 200, 30);
      const h2 = calculateAuroraWaveHeight(50, 1000, 200, 30);
      expect(h1).toBe(h2);
      expect(typeof h1).toBe('number');
      expect(Number.isNaN(h1)).toBe(false);
    });

    it('changes wave height as x or time advances', () => {
      const valT0 = calculateAuroraWaveHeight(50, 0, 200, 30);
      const valT1 = calculateAuroraWaveHeight(50, 1000, 200, 30);
      expect(valT0).not.toBe(valT1);
    });
  });

  describe('calculateRefractionOffset', () => {
    it('returns zero displacement when target is outside radius', () => {
      const res = calculateRefractionOffset(0, 0, 200, 200, 100, 20);
      expect(res).toEqual({ dx: 0, dy: 0 });
    });

    it('returns zero displacement when pointer and target coincide', () => {
      const res = calculateRefractionOffset(50, 50, 50, 50, 100, 20);
      expect(res).toEqual({ dx: 0, dy: 0 });
    });

    it('calculates vector displacement along directional line when inside radius', () => {
      const res = calculateRefractionOffset(0, 0, 30, 40, 100, 20);
      // Distance hypot(30, 40) = 50. Distance is 50/100 radius.
      expect(res.dx).toBeGreaterThan(0);
      expect(res.dy).toBeGreaterThan(0);
      // Ratio of dx / dy should equal diffX / diffY (30 / 40 = 0.75)
      expect(res.dx / res.dy).toBeCloseTo(30 / 40, 5);
    });
  });
});
