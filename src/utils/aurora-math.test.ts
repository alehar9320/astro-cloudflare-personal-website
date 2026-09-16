import { describe, expect, it } from 'vitest';
import { calculateRefractionOffset, clampDpr, harmonicWave } from './aurora-math';

describe('aurora-math utilities', () => {
  describe('clampDpr', () => {
    it('returns 1 for invalid or <= 0 DPR values', () => {
      expect(clampDpr(NaN)).toBe(1);
      expect(clampDpr(0)).toBe(1);
      expect(clampDpr(-1)).toBe(1);
    });

    it('returns DPR when below maxDpr', () => {
      expect(clampDpr(1)).toBe(1);
      expect(clampDpr(1.5)).toBe(1.5);
    });

    it('caps DPR at default maxDpr (2)', () => {
      expect(clampDpr(3)).toBe(2);
      expect(clampDpr(4)).toBe(2);
    });

    it('respects custom maxDpr parameter', () => {
      expect(clampDpr(3, 1.5)).toBe(1.5);
    });
  });

  describe('harmonicWave', () => {
    it('calculates deterministic wave height offsets', () => {
      const val1 = harmonicWave(0, 0, 0.01, 20);
      expect(typeof val1).toBe('number');
      expect(Number.isNaN(val1)).toBe(false);

      const val2 = harmonicWave(100, 1.5, 0.02, 30, Math.PI / 4);
      expect(typeof val2).toBe('number');
      expect(Number.isNaN(val2)).toBe(false);
    });

    it('produces zero displacement at origin time zero with zero phase when sin terms are zero', () => {
      expect(harmonicWave(0, 0, 0.01, 20, 0)).toBe(0);
    });
  });

  describe('calculateRefractionOffset', () => {
    it('returns zero displacement when point is outside interaction radius', () => {
      const offset = calculateRefractionOffset(300, 300, 0, 0, 100, 20);
      expect(offset).toEqual({ dx: 0, dy: 0 });
    });

    it('returns zero displacement when point coincides exactly with pointer center', () => {
      const offset = calculateRefractionOffset(100, 100, 100, 100, 150, 30);
      expect(offset).toEqual({ dx: 0, dy: 0 });
    });

    it('calculates outward displacement vector within interaction radius', () => {
      // Point (150, 100), Center (100, 100) -> 50 units right
      const offset = calculateRefractionOffset(150, 100, 100, 100, 100, 30);
      expect(offset.dx).toBeGreaterThan(0);
      expect(offset.dy).toBe(0);
    });

    it('smoothly attenuates displacement strength towards radius edge', () => {
      const nearCenter = calculateRefractionOffset(110, 100, 100, 100, 100, 30);
      const nearEdge = calculateRefractionOffset(190, 100, 100, 100, 100, 30);
      expect(nearCenter.dx).toBeGreaterThan(nearEdge.dx);
    });
  });
});
