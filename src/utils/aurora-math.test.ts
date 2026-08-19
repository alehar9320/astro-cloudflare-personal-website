import { describe, expect, it } from 'vitest';
import {
  AURORA_PALETTES,
  calculateMagnetosphereVector,
  calculateSineSuperposition,
  getAuroraPalette,
  lerp,
} from './aurora-math';

describe('aurora-math utilities', () => {
  describe('lerp', () => {
    it('interpolates correctly at 0, 0.5, and 1', () => {
      expect(lerp(0, 100, 0)).toBe(0);
      expect(lerp(0, 100, 0.5)).toBe(50);
      expect(lerp(0, 100, 1)).toBe(100);
    });

    it('clamps interpolation amount between 0 and 1', () => {
      expect(lerp(10, 20, -0.5)).toBe(10);
      expect(lerp(10, 20, 1.5)).toBe(20);
    });
  });

  describe('calculateSineSuperposition', () => {
    it('returns deterministic output for given inputs', () => {
      const val1 = calculateSineSuperposition(100, 1.5);
      const val2 = calculateSineSuperposition(100, 1.5);
      expect(val1).toBe(val2);
      expect(typeof val1).toBe('number');
    });

    it('varies with time and x position', () => {
      const valAtT1 = calculateSineSuperposition(100, 1.0);
      const valAtT2 = calculateSineSuperposition(100, 2.0);
      expect(valAtT1).not.toBe(valAtT2);
    });
  });

  describe('calculateMagnetosphereVector', () => {
    it('returns zero displacement when point is outside maxRadius', () => {
      const vec = calculateMagnetosphereVector(0, 0, 500, 500, 100);
      expect(vec.dx).toBe(0);
      expect(vec.dy).toBe(0);
      expect(vec.influence).toBe(0);
    });

    it('returns positive displacement when point is within maxRadius', () => {
      const vec = calculateMagnetosphereVector(50, 50, 0, 0, 100, 40);
      expect(vec.dx).toBeGreaterThan(0);
      expect(vec.dy).toBeGreaterThan(0);
      expect(vec.influence).toBeGreaterThan(0);
      expect(vec.influence).toBeLessThanOrEqual(1);
    });

    it('handles identical point and mouse coords safely', () => {
      const vec = calculateMagnetosphereVector(100, 100, 100, 100);
      expect(vec.dx).toBe(0);
      expect(vec.dy).toBe(0);
      expect(vec.influence).toBe(0);
    });
  });

  describe('getAuroraPalette', () => {
    it('retrieves default palette for invalid key', () => {
      const palette = getAuroraPalette('non_existent');
      expect(palette).toEqual(AURORA_PALETTES.arctic);
    });

    it('cycles through palettes by numeric index', () => {
      const p0 = getAuroraPalette(0);
      const p1 = getAuroraPalette(1);
      const p2 = getAuroraPalette(2);
      const p3 = getAuroraPalette(3); // should wrap around to index 0

      expect(p0.name).toBe(AURORA_PALETTES.arctic.name);
      expect(p1.name).toBe(AURORA_PALETTES.cyanShimmer.name);
      expect(p2.name).toBe(AURORA_PALETTES.deepBorealis.name);
      expect(p3.name).toBe(p0.name);
    });
  });
});
