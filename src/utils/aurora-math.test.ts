import { describe, expect, it } from 'vitest';
import {
  calculateRibbonY,
  cubicSmoothstep,
  getMobileScale,
  interpolateColor,
  pointerDisplacement,
  type RgbColor,
  type WaveHarmonic,
} from './aurora-math';

describe('aurora-math utilities', () => {
  describe('cubicSmoothstep', () => {
    it('returns 0 when distance equals or exceeds radius', () => {
      expect(cubicSmoothstep(100, 100)).toBe(0);
      expect(cubicSmoothstep(150, 100)).toBe(0);
    });

    it('returns 0 when radius is 0 or negative', () => {
      expect(cubicSmoothstep(10, 0)).toBe(0);
      expect(cubicSmoothstep(10, -5)).toBe(0);
    });

    it('returns 1 when distance is 0 or negative', () => {
      expect(cubicSmoothstep(0, 100)).toBe(1);
      expect(cubicSmoothstep(-10, 100)).toBe(1);
    });

    it('returns smooth intermediate values within distance < radius', () => {
      const mid = cubicSmoothstep(50, 100);
      expect(mid).toBeGreaterThan(0);
      expect(mid).toBeLessThan(1);
      expect(mid).toBeCloseTo(0.5, 2);
    });
  });

  describe('calculateRibbonY', () => {
    it('returns 0 when width or harmonics are empty', () => {
      const harmonics: WaveHarmonic[] = [{ amplitude: 20, frequency: 1, speed: 1, phase: 0 }];
      expect(calculateRibbonY(10, 0, 0, harmonics)).toBe(0);
      expect(calculateRibbonY(10, 100, 0, [])).toBe(0);
    });

    it('calculates expected wave height for harmonics', () => {
      const harmonics: WaveHarmonic[] = [
        { amplitude: 10, frequency: 1, speed: 0, phase: 0 },
        { amplitude: 5, frequency: 2, speed: 0, phase: 0 },
      ];
      // At x = 0, sin(0) = 0 for both
      expect(calculateRibbonY(0, 100, 0, harmonics)).toBeCloseTo(0, 5);

      // At x = 25 (normalized 0.25): sin(0.25 * 2pi) = sin(pi/2) = 1 (amplitude 10), sin(0.5 * 2pi) = sin(pi) = 0
      expect(calculateRibbonY(25, 100, 0, harmonics)).toBeCloseTo(10, 5);
    });
  });

  describe('pointerDisplacement', () => {
    it('returns zero displacement when distance exceeds radius', () => {
      const res = pointerDisplacement(200, 200, 0, 0, 100, 50);
      expect(res).toEqual({ dx: 0, dy: 0 });
    });

    it('returns zero displacement when points coincide', () => {
      const res = pointerDisplacement(50, 50, 50, 50, 100, 50);
      expect(res).toEqual({ dx: 0, dy: 0 });
    });

    it('calculates direction vector scaled by smoothstep factor and strength', () => {
      const res = pointerDisplacement(100, 0, 0, 0, 200, 40);
      expect(res.dy).toBeCloseTo(0, 5);
      expect(res.dx).toBeGreaterThan(0);
      expect(res.dx).toBeLessThanOrEqual(40);
    });
  });

  describe('interpolateColor', () => {
    const cyan: RgbColor = [0, 242, 254];
    const blue: RgbColor = [15, 23, 42];

    it('returns colorA when factor is 0 or less', () => {
      expect(interpolateColor(cyan, blue, 0)).toBe('rgb(0, 242, 254)');
      expect(interpolateColor(cyan, blue, -0.5)).toBe('rgb(0, 242, 254)');
    });

    it('returns colorB when factor is 1 or more', () => {
      expect(interpolateColor(cyan, blue, 1)).toBe('rgb(15, 23, 42)');
      expect(interpolateColor(cyan, blue, 1.5)).toBe('rgb(15, 23, 42)');
    });

    it('interpolates midpoint RGB values at factor 0.5', () => {
      const mid = interpolateColor(cyan, blue, 0.5);
      // r = Math.round(0 + (15 - 0)*0.5) = 8
      // g = Math.round(242 + (23 - 242)*0.5) = Math.round(242 - 109.5) = 133
      // b = Math.round(254 + (42 - 254)*0.5) = Math.round(254 - 106) = 148
      expect(mid).toBe('rgb(8, 133, 148)');
    });
  });

  describe('getMobileScale', () => {
    it('returns mobile scale for narrow screens', () => {
      expect(getMobileScale(360)).toEqual({ scale: 0.5, harmonicCount: 2 });
      expect(getMobileScale(600)).toEqual({ scale: 0.75, harmonicCount: 2 });
    });

    it('returns full scale for desktop screens', () => {
      expect(getMobileScale(1024)).toEqual({ scale: 1, harmonicCount: 3 });
    });
  });
});
