import { describe, expect, it } from 'vitest';
import {
  calculatePointerInfluence,
  calculateWaveY,
  getSpatialStep,
  refractColor,
  rgbaString,
} from './aurora-math';

describe('aurora-math utilities', () => {
  describe('calculateWaveY', () => {
    it('returns deterministic numeric offsets', () => {
      const y1 = calculateWaveY(100, 0, 0.01, 50, 0);
      const y2 = calculateWaveY(100, 0, 0.01, 50, 0);
      expect(y1).toBe(y2);
      expect(typeof y1).toBe('number');
      expect(Number.isNaN(y1)).toBe(false);
    });

    it('scales offset with amplitude', () => {
      const offset1 = calculateWaveY(50, 1.0, 0.02, 20);
      const offset2 = calculateWaveY(50, 1.0, 0.02, 40);
      expect(offset2).toBeCloseTo(offset1 * 2, 5);
    });
  });

  describe('refractColor', () => {
    it('interpolates to Marine Blue at t = 0', () => {
      const color = refractColor(0, 0.8);
      expect(color).toEqual({ r: 10, g: 37, b: 64, a: 0.8 });
    });

    it('interpolates to Cyan at t = 1', () => {
      const color = refractColor(1, 0.9);
      expect(color).toEqual({ r: 0, g: 242, b: 254, a: 0.9 });
    });

    it('clamps t value between 0 and 1', () => {
      const under = refractColor(-0.5);
      const over = refractColor(1.5);
      expect(under).toEqual(refractColor(0));
      expect(over).toEqual(refractColor(1));
    });

    it('clamps alpha between 0 and 1', () => {
      const lowAlpha = refractColor(0.5, -0.2);
      const highAlpha = refractColor(0.5, 1.5);
      expect(lowAlpha.a).toBe(0);
      expect(highAlpha.a).toBe(1);
    });
  });

  describe('rgbaString', () => {
    it('formats RGBAColor to standard CSS rgba syntax', () => {
      const color = { r: 10, g: 200, b: 250, a: 0.75 };
      expect(rgbaString(color)).toBe('rgba(10, 200, 250, 0.75)');
    });
  });

  describe('getSpatialStep', () => {
    it('returns minimum spatial step of 4 for small viewports', () => {
      expect(getSpatialStep(320)).toBe(4);
      expect(getSpatialStep(480)).toBe(4);
    });

    it('scales spatial step interval for wide viewports to preserve performance', () => {
      expect(getSpatialStep(1200)).toBe(10);
      expect(getSpatialStep(1920)).toBe(16);
    });

    it('handles non-positive viewport widths safely', () => {
      expect(getSpatialStep(0)).toBe(4);
      expect(getSpatialStep(-100)).toBe(4);
    });
  });

  describe('calculatePointerInfluence', () => {
    it('returns 0 when point is outside radius', () => {
      const factor = calculatePointerInfluence(0, 0, 200, 200, 100);
      expect(factor).toBe(0);
    });

    it('returns 1 when point coincides with pointer', () => {
      const factor = calculatePointerInfluence(100, 100, 100, 100, 50);
      expect(factor).toBe(1);
    });

    it('returns quadratic falloff value within radius', () => {
      // Distance is 30, radius is 60 -> linear 0.5 -> quadratic 0.25
      const factor = calculatePointerInfluence(0, 0, 30, 0, 60);
      expect(factor).toBeCloseTo(0.25, 5);
    });

    it('handles zero or negative radius safely', () => {
      expect(calculatePointerInfluence(10, 10, 10, 10, 0)).toBe(0);
      expect(calculatePointerInfluence(10, 10, 10, 10, -50)).toBe(0);
    });
  });
});
