import { describe, expect, it } from 'vitest';
import { calculateHarmonicWave, clampDevicePixelRatio, lerp } from './aurora-math';

describe('aurora-math utilities', () => {
  describe('lerp', () => {
    it('correctly interpolates values at boundaries and midpoints', () => {
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(0, 10, 1)).toBe(10);
    });

    it('clamps interpolation factor t between 0 and 1', () => {
      expect(lerp(0, 10, -0.5)).toBe(0);
      expect(lerp(0, 10, 1.5)).toBe(10);
    });
  });

  describe('calculateHarmonicWave', () => {
    it('produces deterministic output for given inputs', () => {
      const val1 = calculateHarmonicWave(100, 1.0, 0.01, 20);
      const val2 = calculateHarmonicWave(100, 1.0, 0.01, 20);
      expect(val1).toBe(val2);
    });

    it('scales with baseAmplitude', () => {
      const smallWave = calculateHarmonicWave(50, 0.5, 0.01, 10);
      const largeWave = calculateHarmonicWave(50, 0.5, 0.01, 100);
      expect(Math.abs(largeWave)).toBeGreaterThan(Math.abs(smallWave));
    });
  });

  describe('clampDevicePixelRatio', () => {
    it('clamps DPR to maximum threshold (default 2)', () => {
      expect(clampDevicePixelRatio(1)).toBe(1);
      expect(clampDevicePixelRatio(1.5)).toBe(1.5);
      expect(clampDevicePixelRatio(3)).toBe(2);
    });

    it('respects custom maxDpr parameter', () => {
      expect(clampDevicePixelRatio(4, 3)).toBe(3);
    });
  });
});
