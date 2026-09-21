import { describe, expect, it } from 'vitest';
import {
  calculateAuroraColor,
  computeAuroraWave,
  cubicSmoothstep,
  scaleParticleRadius,
} from './aurora-math';

describe('aurora-math utilities', () => {
  describe('cubicSmoothstep', () => {
    it('returns 1 when distance is 0 or negative', () => {
      expect(cubicSmoothstep(0, 100)).toBe(1);
      expect(cubicSmoothstep(-10, 100)).toBe(1);
    });

    it('returns 0 when distance is equal to or greater than radius', () => {
      expect(cubicSmoothstep(100, 100)).toBe(0);
      expect(cubicSmoothstep(150, 100)).toBe(0);
    });

    it('returns 0 when radius is 0 or negative', () => {
      expect(cubicSmoothstep(50, 0)).toBe(0);
      expect(cubicSmoothstep(50, -10)).toBe(0);
    });

    it('calculates smooth quadratic falloff at midpoint', () => {
      // At dist=50, radius=100 -> norm = (1 - 0.5) = 0.5 -> 0.5^2 = 0.25
      expect(cubicSmoothstep(50, 100)).toBeCloseTo(0.25, 4);
    });
  });

  describe('computeAuroraWave', () => {
    it('returns deterministic numeric output for given parameters', () => {
      const val1 = computeAuroraWave(10, 20, 1000);
      const val2 = computeAuroraWave(10, 20, 1000);
      expect(val1).toBe(val2);
      expect(typeof val1).toBe('number');
      expect(Number.isNaN(val1)).toBe(false);
    });

    it('scales displacement linearly with amplitude', () => {
      const valDefault = computeAuroraWave(50, 50, 500, 0.01, 10);
      const valDouble = computeAuroraWave(50, 50, 500, 0.01, 20);
      expect(valDouble).toBeCloseTo(valDefault * 2, 4);
    });
  });

  describe('scaleParticleRadius', () => {
    it('scales down for mobile viewports (< 480px)', () => {
      expect(scaleParticleRadius(10, 360)).toBe(6); // 60%
    });

    it('scales down for tablet viewports (< 768px)', () => {
      expect(scaleParticleRadius(10, 600)).toBe(8); // 80%
    });

    it('retains base radius for desktop viewports (>= 768px)', () => {
      expect(scaleParticleRadius(10, 1024)).toBe(10);
    });

    it('enforces a minimum radius of 1', () => {
      expect(scaleParticleRadius(1, 320)).toBe(1);
    });
  });

  describe('calculateAuroraColor', () => {
    it('formats a valid hsla color string for minimum elevation (-1)', () => {
      const color = calculateAuroraColor(-1, 0.8);
      expect(color).toContain('hsla(210, 67%, 16%, 0.80)');
    });

    it('formats a valid hsla color string for maximum elevation (+1)', () => {
      const color = calculateAuroraColor(1, 1.0);
      expect(color).toContain('hsla(183, 100%, 50%, 1.00)');
    });

    it('clamps elevation parameters outside [-1, 1]', () => {
      const colorLow = calculateAuroraColor(-5, 0.5);
      const colorMin = calculateAuroraColor(-1, 0.5);
      expect(colorLow).toBe(colorMin);

      const colorHigh = calculateAuroraColor(5, 0.5);
      const colorMax = calculateAuroraColor(1, 0.5);
      expect(colorHigh).toBe(colorMax);
    });
  });
});
