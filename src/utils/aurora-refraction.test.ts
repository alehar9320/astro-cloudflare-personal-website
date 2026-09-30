import { describe, expect, it } from 'vitest';
import {
  calculateDisplacedPoint,
  calculateWaveY,
  cubicSmoothstep,
  formatRgba,
  interpolateAuroraColor,
} from './aurora-refraction';

describe('aurora-refraction utilities', () => {
  describe('cubicSmoothstep', () => {
    it('returns 1 when distance is 0', () => {
      expect(cubicSmoothstep(0, 100)).toBe(1);
    });

    it('returns 0 when distance equals radius or is greater', () => {
      expect(cubicSmoothstep(100, 100)).toBe(0);
      expect(cubicSmoothstep(150, 100)).toBe(0);
    });

    it('returns 0 for non-positive radius or negative distance', () => {
      expect(cubicSmoothstep(50, 0)).toBe(0);
      expect(cubicSmoothstep(50, -10)).toBe(0);
      expect(cubicSmoothstep(-10, 100)).toBe(0);
    });

    it('returns expected smooth attenuation value at midpoint', () => {
      // At distance = 50, radius = 100: norm = 0.5, norm^2 = 0.25
      expect(cubicSmoothstep(50, 100)).toBe(0.25);
    });
  });

  describe('calculateWaveY', () => {
    it('calculates baseline offset when amplitude is 0', () => {
      expect(calculateWaveY(100, 0, 0, 0.01, 0, 200)).toBe(200);
    });

    it('calculates correct sine displacement', () => {
      // sin(0) = 0 => offset 200
      expect(calculateWaveY(0, 0, 50, 0.01, 0, 200)).toBe(200);
      // sin(PI / 2) = 1 => 200 + 50 = 250
      const x = Math.PI / (2 * 0.01);
      expect(calculateWaveY(x, 0, 50, 0.01, 0, 200)).toBeCloseTo(250, 5);
    });
  });

  describe('interpolateAuroraColor', () => {
    it('returns marine blue at factor 0', () => {
      expect(interpolateAuroraColor(0)).toEqual({ r: 9, g: 30, b: 58 });
    });

    it('returns deep teal at factor 0.5', () => {
      expect(interpolateAuroraColor(0.5)).toEqual({ r: 0, g: 92, b: 138 });
    });

    it('returns vibrant cyan at factor 1', () => {
      expect(interpolateAuroraColor(1)).toEqual({ r: 0, g: 242, b: 254 });
    });

    it('clamps factors below 0 and above 1', () => {
      expect(interpolateAuroraColor(-0.5)).toEqual({ r: 9, g: 30, b: 58 });
      expect(interpolateAuroraColor(1.5)).toEqual({ r: 0, g: 242, b: 254 });
    });
  });

  describe('formatRgba', () => {
    it('formats RGBColor object into valid CSS rgba string', () => {
      const color = { r: 0, g: 242, b: 254 };
      expect(formatRgba(color, 0.8)).toBe('rgba(0, 242, 254, 0.8)');
    });

    it('clamps alpha between 0 and 1', () => {
      const color = { r: 0, g: 0, b: 0 };
      expect(formatRgba(color, -1)).toBe('rgba(0, 0, 0, 0)');
      expect(formatRgba(color, 2)).toBe('rgba(0, 0, 0, 1)');
    });
  });

  describe('calculateDisplacedPoint', () => {
    it('returns original coordinates if distance >= radius or distance === 0', () => {
      expect(calculateDisplacedPoint(10, 20, 10, 20, 100, 50)).toEqual({ x: 10, y: 20 });
      expect(calculateDisplacedPoint(200, 200, 10, 10, 100, 50)).toEqual({ x: 200, y: 200 });
    });

    it('displaces points outward based on strength and cubic falloff', () => {
      // Point at (150, 100), Pointer at (100, 100). dx = 50, dy = 0, distance = 50, radius = 100.
      // attenuation = 0.25, displacement = 0.25 * 40 = 10.
      // Direction nx = 1, ny = 0. New x = 150 + 10 = 160.
      const result = calculateDisplacedPoint(150, 100, 100, 100, 100, 40);
      expect(result.x).toBeCloseTo(160, 5);
      expect(result.y).toBeCloseTo(100, 5);
    });
  });
});
