import { describe, expect, it } from 'vitest';
import {
  calculateAuroraWave,
  calculateMagnetosphereDisplacement,
  getAdaptiveScale,
} from './aurora-math';

describe('aurora-math utilities', () => {
  describe('calculateAuroraWave', () => {
    it('returns 0 at time 0, x 0, phase 0', () => {
      const wave = calculateAuroraWave(0, 0, 0.01, 50, 0);
      expect(wave).toBeCloseTo(0, 5);
    });

    it('produces non-zero amplitude within expected superposition bounds', () => {
      const amplitude = 50;
      const wave = calculateAuroraWave(100, 1.5, 0.005, amplitude, 0.5);
      // Peak possible bound is amplitude * 1.35
      expect(Math.abs(wave)).toBeLessThanOrEqual(amplitude * 1.35 + 0.01);
    });

    it('varies smoothly over time', () => {
      const t0 = calculateAuroraWave(10, 0.0, 0.01, 30, 0);
      const t1 = calculateAuroraWave(10, 0.1, 0.01, 30, 0);
      expect(t0).not.toEqual(t1);
      expect(Math.abs(t1 - t0)).toBeLessThan(10);
    });
  });

  describe('calculateMagnetosphereDisplacement', () => {
    it('returns zero displacement when cursor is outside radius', () => {
      const displacement = calculateMagnetosphereDisplacement(0, 0, 200, 200, 100, 30);
      expect(displacement).toEqual({ dx: 0, dy: 0 });
    });

    it('returns zero displacement when radius is non-positive or strength is zero', () => {
      expect(calculateMagnetosphereDisplacement(10, 10, 12, 12, 0, 30)).toEqual({ dx: 0, dy: 0 });
      expect(calculateMagnetosphereDisplacement(10, 10, 12, 12, 50, 0)).toEqual({ dx: 0, dy: 0 });
    });

    it('calculates repulsive radial displacement when point is within radius', () => {
      // Point at (110, 100), Cursor at (100, 100). Delta is (10, 0), distance 10. Radius 100, Strength 40.
      const displacement = calculateMagnetosphereDisplacement(110, 100, 100, 100, 100, 40);
      expect(displacement.dx).toBeGreaterThan(0);
      expect(displacement.dy).toBeCloseTo(0, 5);
      // attenuation = (1 - 10/100)^2 = 0.81. Magnitude = 0.81 * 40 = 32.4
      expect(displacement.dx).toBeCloseTo(32.4, 1);
    });
  });

  describe('getAdaptiveScale', () => {
    it('returns 0.4 for narrow mobile viewports (< 480px)', () => {
      expect(getAdaptiveScale(360)).toBe(0.4);
    });

    it('returns 0.65 for tablet viewports (< 768px)', () => {
      expect(getAdaptiveScale(600)).toBe(0.65);
    });

    it('returns 1.0 for desktop viewports (>= 768px)', () => {
      expect(getAdaptiveScale(1024)).toBe(1.0);
    });
  });
});
