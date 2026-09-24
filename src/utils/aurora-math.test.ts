import { describe, expect, it } from 'vitest';
import { computeAuroraWave, cubicSmoothstep, getOptimizedDpr } from './aurora-math';

describe('aurora-math utilities', () => {
  describe('cubicSmoothstep', () => {
    it('returns 1.0 when distance is 0', () => {
      expect(cubicSmoothstep(0, 100)).toBe(1);
    });

    it('returns 0.0 when distance equals or exceeds radius', () => {
      expect(cubicSmoothstep(100, 100)).toBe(0);
      expect(cubicSmoothstep(150, 100)).toBe(0);
    });

    it('returns 0.25 at midpoint distance (distance = radius / 2)', () => {
      // norm = 1 - 50/100 = 0.5. norm * norm = 0.25
      expect(cubicSmoothstep(50, 100)).toBeCloseTo(0.25);
    });

    it('handles negative distance gracefully', () => {
      expect(cubicSmoothstep(-50, 100)).toBeCloseTo(0.25);
    });

    it('returns 0 when radius is 0 or negative', () => {
      expect(cubicSmoothstep(10, 0)).toBe(0);
      expect(cubicSmoothstep(10, -50)).toBe(0);
    });
  });

  describe('computeAuroraWave', () => {
    it('returns 0 when x, time, and amplitude are 0', () => {
      expect(computeAuroraWave(0, 0, 0.005, 0)).toBe(0);
    });

    it('produces deterministic output for given inputs', () => {
      const val1 = computeAuroraWave(100, 1.5, 0.005, 25);
      const val2 = computeAuroraWave(100, 1.5, 0.005, 25);
      expect(val1).toBe(val2);
    });

    it('smoothly varies over time', () => {
      const val1 = computeAuroraWave(100, 0, 0.005, 25);
      const val2 = computeAuroraWave(100, 0.1, 0.005, 25);
      expect(val1).not.toBe(val2);
      expect(Math.abs(val1 - val2)).toBeLessThan(10);
    });
  });

  describe('getOptimizedDpr', () => {
    it('returns 1 for DPR <= 1', () => {
      expect(getOptimizedDpr(1)).toBe(1);
      expect(getOptimizedDpr(0.5)).toBe(1);
    });

    it('caps DPR at 2.0 for higher pixel density displays', () => {
      expect(getOptimizedDpr(2)).toBe(2);
      expect(getOptimizedDpr(3)).toBe(2);
      expect(getOptimizedDpr(4)).toBe(2);
    });

    it('handles invalid or missing DPR values fallback to 1', () => {
      expect(getOptimizedDpr(0)).toBe(1);
      expect(getOptimizedDpr(NaN)).toBe(1);
    });
  });
});
