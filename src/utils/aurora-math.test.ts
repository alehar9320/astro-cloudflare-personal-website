import { describe, expect, it } from 'vitest';
import {
  calculateAuroraWave,
  calculateMagnetosphereDisplacement,
  getAdaptiveScale,
} from './aurora-math';

describe('aurora-math', () => {
  describe('calculateAuroraWave', () => {
    it('returns a numerical wave offset for given coordinates and time', () => {
      const waveVal = calculateAuroraWave(100, 500);
      expect(typeof waveVal).toBe('number');
      expect(Number.isNaN(waveVal)).toBe(false);
    });

    it('produces repeatable deterministic outputs for identical inputs', () => {
      const val1 = calculateAuroraWave(100, 200, 0.01, 40, 0.005);
      const val2 = calculateAuroraWave(100, 200, 0.01, 40, 0.005);
      expect(val1).toBe(val2);
    });

    it('varies across x and time parameters', () => {
      const valA = calculateAuroraWave(0, 0);
      const valB = calculateAuroraWave(100, 0);
      const valC = calculateAuroraWave(0, 100);
      expect(valA).not.toBe(valB);
      expect(valA).not.toBe(valC);
    });
  });

  describe('calculateMagnetosphereDisplacement', () => {
    it('returns zero displacement when point is outside maxRadius', () => {
      const displacement = calculateMagnetosphereDisplacement(200, 200, 0, 0, 100);
      expect(displacement).toEqual({ dx: 0, dy: 0 });
    });

    it('returns zero displacement when point coincides exactly with cursor', () => {
      const displacement = calculateMagnetosphereDisplacement(100, 100, 100, 100, 150);
      expect(displacement).toEqual({ dx: 0, dy: 0 });
    });

    it('returns outward displacement vector when point is within maxRadius', () => {
      // Cursor at (100, 100), Point at (120, 100) -> vector should push right (+dx, ~0 dy)
      const displacement = calculateMagnetosphereDisplacement(120, 100, 100, 100, 150, 0.5);
      expect(displacement.dx).toBeGreaterThan(0);
      expect(Math.abs(displacement.dy)).toBeCloseTo(0);
    });
  });

  describe('getAdaptiveScale', () => {
    it('returns 0.5 for small mobile viewports (<600px)', () => {
      expect(getAdaptiveScale(375)).toBe(0.5);
      expect(getAdaptiveScale(599)).toBe(0.5);
    });

    it('returns 0.75 for tablet viewports (600px - 999px)', () => {
      expect(getAdaptiveScale(600)).toBe(0.75);
      expect(getAdaptiveScale(999)).toBe(0.75);
    });

    it('returns 1.0 for desktop viewports (>=1000px)', () => {
      expect(getAdaptiveScale(1000)).toBe(1.0);
      expect(getAdaptiveScale(1920)).toBe(1.0);
    });
  });
});
