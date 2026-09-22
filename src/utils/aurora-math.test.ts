import { describe, expect, it } from 'vitest';
import {
  calculateAuroraColor,
  calculateAuroraWaveHeight,
  calculateParticleStep,
  calculateRefractedPoint,
  cubicSmoothstepFalloff,
  getMobileScaleFactor,
} from './aurora-math';

describe('aurora-math utilities', () => {
  describe('cubicSmoothstepFalloff', () => {
    it('returns 0 when distance is greater than or equal to radius', () => {
      expect(cubicSmoothstepFalloff(100, 100)).toBe(0);
      expect(cubicSmoothstepFalloff(150, 100)).toBe(0);
    });

    it('returns 0 when radius is zero or negative', () => {
      expect(cubicSmoothstepFalloff(10, 0)).toBe(0);
      expect(cubicSmoothstepFalloff(10, -5)).toBe(0);
    });

    it('returns 1 when distance is zero or negative', () => {
      expect(cubicSmoothstepFalloff(0, 100)).toBe(1);
      expect(cubicSmoothstepFalloff(-10, 100)).toBe(1);
    });

    it('computes smoothstep falloff correctly for intermediate distances', () => {
      // distance = 50, radius = 100 => t = 0.5 => t*t*(3-2*t) = 0.25 * 2 = 0.5
      expect(cubicSmoothstepFalloff(50, 100)).toBeCloseTo(0.5);
    });
  });

  describe('calculateAuroraWaveHeight', () => {
    it('returns 0 for non-positive wavelengths', () => {
      expect(calculateAuroraWaveHeight(10, 0, 0, 40)).toBe(0);
      expect(calculateAuroraWaveHeight(10, 0, -100, 40)).toBe(0);
    });

    it('calculates wave height deterministically for given parameters', () => {
      const h1 = calculateAuroraWaveHeight(0, 0, 150, 40);
      const h2 = calculateAuroraWaveHeight(0, Math.PI, 150, 40);
      expect(typeof h1).toBe('number');
      expect(typeof h2).toBe('number');
      expect(h1).not.toBe(h2);
    });

    it('scales height linearly with amplitude', () => {
      const hBase = calculateAuroraWaveHeight(50, 1.2, 100, 1);
      const hScaled = calculateAuroraWaveHeight(50, 1.2, 100, 10);
      expect(hScaled).toBeCloseTo(hBase * 10);
    });
  });

  describe('calculateRefractedPoint', () => {
    it('returns original point if distance to pointer equals or exceeds radius', () => {
      const point = { x: 100, y: 100 };
      const refracted = calculateRefractedPoint(point.x, point.y, 300, 300, 100, 30);
      expect(refracted).toEqual(point);
    });

    it('returns original point if distance is zero', () => {
      const point = { x: 100, y: 100 };
      const refracted = calculateRefractedPoint(point.x, point.y, 100, 100, 120, 30);
      expect(refracted).toEqual(point);
    });

    it('displaces point away from pointer when within radius', () => {
      // Point at (110, 100), pointer at (100, 100) => dx = 10, dy = 0, distance = 10
      const refracted = calculateRefractedPoint(110, 100, 100, 100, 100, 20);
      expect(refracted.x).toBeGreaterThan(110);
      expect(refracted.y).toBe(100);
    });
  });

  describe('calculateAuroraColor', () => {
    it('formats rgba string with correct alpha', () => {
      const color = calculateAuroraColor(0, 0.75);
      expect(color).toContain('rgba(');
      expect(color).toContain('0.75)');
    });

    it('clamps alpha values to [0, 1]', () => {
      const colorMin = calculateAuroraColor(0, -0.5);
      const colorMax = calculateAuroraColor(0, 1.5);
      expect(colorMin).toContain(', 0)');
      expect(colorMax).toContain(', 1)');
    });

    it('maps negative values towards marine blue and positive towards emerald green', () => {
      const colorBlue = calculateAuroraColor(-1, 1);
      const colorGreen = calculateAuroraColor(1, 1);
      expect(colorBlue).toBe('rgba(15, 43, 72, 1)');
      expect(colorGreen).toBe('rgba(16, 185, 129, 1)');
    });
  });

  describe('getMobileScaleFactor', () => {
    it('returns 1.0 for viewports >= breakpoint', () => {
      expect(getMobileScaleFactor(1024, 768)).toBe(1.0);
      expect(getMobileScaleFactor(768, 768)).toBe(1.0);
    });

    it('returns scaled factor for mobile viewports with minimum floor', () => {
      expect(getMobileScaleFactor(384, 768)).toBe(0.5);
      expect(getMobileScaleFactor(100, 768)).toBe(0.4);
    });

    it('returns 0.5 for invalid or non-positive viewports', () => {
      expect(getMobileScaleFactor(0)).toBe(0.5);
      expect(getMobileScaleFactor(-100)).toBe(0.5);
    });
  });

  describe('calculateParticleStep', () => {
    it('returns appropriate step sizes for different screen widths', () => {
      expect(calculateParticleStep(320)).toBe(8);
      expect(calculateParticleStep(600)).toBe(6);
      expect(calculateParticleStep(1200)).toBe(4);
    });
  });
});
