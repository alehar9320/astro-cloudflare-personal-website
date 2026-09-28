import { describe, expect, it } from 'vitest';
import {
  calculateWaveY,
  getScaledPoints,
  interpolateAuroraColor,
  smoothstepFalloff,
} from './aurora-math';

describe('aurora-math', () => {
  describe('calculateWaveY', () => {
    it('calculates wave Y offset deterministically', () => {
      const params = { amplitude: 30, frequency: 0.02, phase: 0, speed: 0.05 };
      const y1 = calculateWaveY(100, 1, params);
      const y2 = calculateWaveY(100, 1, params);
      expect(y1).toBe(y2);
      expect(typeof y1).toBe('number');
      expect(Number.isFinite(y1)).toBe(true);
    });

    it('scales output proportionally with amplitude', () => {
      const params1 = { amplitude: 20, frequency: 0.01, phase: 0, speed: 0.01 };
      const params2 = { amplitude: 40, frequency: 0.01, phase: 0, speed: 0.01 };
      const y1 = calculateWaveY(50, 2, params1);
      const y2 = calculateWaveY(50, 2, params2);
      expect(y2).toBeCloseTo(y1 * 2, 5);
    });
  });

  describe('smoothstepFalloff', () => {
    it('returns 1 at distance 0', () => {
      expect(smoothstepFalloff(0, 100)).toBe(1);
    });

    it('returns 0 at or beyond maxRadius', () => {
      expect(smoothstepFalloff(100, 100)).toBe(0);
      expect(smoothstepFalloff(150, 100)).toBe(0);
    });

    it('handles zero or negative maxRadius gracefully', () => {
      expect(smoothstepFalloff(50, 0)).toBe(0);
      expect(smoothstepFalloff(50, -10)).toBe(0);
    });

    it('decreases smoothly as distance increases', () => {
      const f1 = smoothstepFalloff(25, 100);
      const f2 = smoothstepFalloff(50, 100);
      const f3 = smoothstepFalloff(75, 100);
      expect(f1).toBeGreaterThan(f2);
      expect(f2).toBeGreaterThan(f3);
    });
  });

  describe('interpolateAuroraColor', () => {
    it('returns start palette color at t = 0', () => {
      const color = interpolateAuroraColor(0);
      expect(color).toEqual({ r: 2, g: 11, b: 24, a: 0.8 });
    });

    it('returns end palette color at t = 1', () => {
      const color = interpolateAuroraColor(1);
      expect(color).toEqual({ r: 30, g: 27, b: 75, a: 0.5 });
    });

    it('clamps t values outside [0, 1]', () => {
      expect(interpolateAuroraColor(-0.5)).toEqual(interpolateAuroraColor(0));
      expect(interpolateAuroraColor(1.5)).toEqual(interpolateAuroraColor(1));
    });

    it('interpolates intermediate colors', () => {
      const color = interpolateAuroraColor(0.5);
      expect(color.r).toBeGreaterThanOrEqual(0);
      expect(color.g).toBeGreaterThanOrEqual(0);
      expect(color.b).toBeGreaterThanOrEqual(0);
      expect(color.a).toBeGreaterThan(0);
    });
  });

  describe('getScaledPoints', () => {
    it('returns reduced point density on mobile viewports', () => {
      const mobilePoints = getScaledPoints(400, true);
      const desktopPoints = getScaledPoints(1200, false);
      expect(mobilePoints).toBeLessThan(desktopPoints);
    });

    it('enforces minimum point thresholds', () => {
      expect(getScaledPoints(100, true)).toBe(16);
      expect(getScaledPoints(100, false)).toBe(16);
    });
  });
});
