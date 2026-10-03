import { describe, expect, it } from 'vitest';
import {
  calculateAdaptiveStep,
  calculatePointerRefraction,
  calculateWaveY,
  getAuroraColors,
} from './auroraWaveMath';

describe('auroraWaveMath', () => {
  describe('calculateWaveY', () => {
    it('returns deterministic wave values for fixed inputs', () => {
      const wave = { amplitude: 50, frequency: 0.01, phase: 0, speed: 0.02 };
      const y1 = calculateWaveY(100, 10, wave);
      const y2 = calculateWaveY(100, 10, wave);
      expect(y1).toBe(y2);
      expect(typeof y1).toBe('number');
    });

    it('scales output according to amplitude', () => {
      const wave1 = { amplitude: 10, frequency: 0.01, phase: 0, speed: 0.02 };
      const wave2 = { amplitude: 20, frequency: 0.01, phase: 0, speed: 0.02 };
      const y1 = calculateWaveY(50, 5, wave1);
      const y2 = calculateWaveY(50, 5, wave2);
      expect(y2).toBeCloseTo(y1 * 2);
    });
  });

  describe('calculatePointerRefraction', () => {
    it('returns zero displacement when point is outside radius', () => {
      const result = calculatePointerRefraction(200, 200, 0, 0, 100);
      expect(result).toEqual({ dx: 0, dy: 0, factor: 0 });
    });

    it('returns zero displacement for zero or negative radius', () => {
      const result = calculatePointerRefraction(10, 10, 10, 10, 0);
      expect(result).toEqual({ dx: 0, dy: 0, factor: 0 });
    });

    it('calculates cubic smoothstep falloff when point is within radius', () => {
      const radius = 100;
      const pointerX = 100;
      const pointerY = 100;
      const px = 130;
      const py = 100;

      const result = calculatePointerRefraction(px, py, pointerX, pointerY, radius);

      expect(result.factor).toBeGreaterThan(0);
      expect(result.factor).toBeLessThanOrEqual(1);
      expect(result.dx).toBeGreaterThan(0);
      expect(result.dy).toBe(0);

      // Verify cubic smoothstep formula factor: (1 - 30/100)^2 = 0.7^2 = 0.49
      expect(result.factor).toBeCloseTo(0.49, 2);
    });
  });

  describe('calculateAdaptiveStep', () => {
    it('returns minimum step size of 4 for small viewports', () => {
      expect(calculateAdaptiveStep(320)).toBe(4);
      expect(calculateAdaptiveStep(0)).toBe(4);
      expect(calculateAdaptiveStep(-100)).toBe(4);
    });

    it('scales step size dynamically for large viewports', () => {
      expect(calculateAdaptiveStep(1440)).toBe(12);
      expect(calculateAdaptiveStep(2560)).toBe(21);
    });
  });

  describe('getAuroraColors', () => {
    it('returns dark theme color palette by default', () => {
      const colors = getAuroraColors(true);
      expect(colors.cyan).toContain('0, 242, 254');
      expect(colors.emerald).toContain('0, 245, 212');
    });

    it('returns light theme color palette when dark theme is false', () => {
      const colors = getAuroraColors(false);
      expect(colors.cyan).toContain('0, 180, 216');
      expect(colors.marine).toContain('224, 251, 252');
    });
  });
});
