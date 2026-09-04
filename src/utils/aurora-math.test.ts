import { describe, expect, it } from 'vitest';
import {
  AURORA_PALETTES,
  calculateHarmonicWave,
  calculatePointerRefraction,
  interpolateAuroraColor,
  pseudoNoise2D,
} from './aurora-math';

describe('aurora-math utilities', () => {
  describe('calculateHarmonicWave', () => {
    it('computes wave values based on amplitude, frequency, and time', () => {
      const val1 = calculateHarmonicWave(0, 0, 10, 0.05);
      const val2 = calculateHarmonicWave(10, 0, 10, 0.05);
      expect(typeof val1).toBe('number');
      expect(typeof val2).toBe('number');
      expect(val1).not.toBe(val2);
    });

    it('returns zero wave when amplitude is zero', () => {
      const val = calculateHarmonicWave(100, 5, 0, 0.1);
      expect(val).toBe(0);
    });
  });

  describe('calculatePointerRefraction', () => {
    it('returns zero refraction when position is outside maxRadius', () => {
      const res = calculatePointerRefraction(0, 0, 200, 200, 50);
      expect(res).toEqual({ dx: 0, dy: 0, intensity: 0 });
    });

    it('returns zero refraction when maxRadius is zero or negative', () => {
      expect(calculatePointerRefraction(10, 10, 10, 10, 0)).toEqual({ dx: 0, dy: 0, intensity: 0 });
      expect(calculatePointerRefraction(10, 10, 10, 10, -5)).toEqual({
        dx: 0,
        dy: 0,
        intensity: 0,
      });
    });

    it('returns zero refraction when position perfectly overlaps pointer', () => {
      const res = calculatePointerRefraction(50, 50, 50, 50, 100);
      expect(res).toEqual({ dx: 0, dy: 0, intensity: 0 });
    });

    it('calculates direction displacement and intensity when within radius', () => {
      const res = calculatePointerRefraction(100, 100, 80, 100, 50);
      expect(res.intensity).toBeGreaterThan(0);
      expect(res.intensity).toBeLessThanOrEqual(1);
      expect(res.dx).toBeGreaterThan(0);
      expect(res.dy).toBe(0);
    });
  });

  describe('pseudoNoise2D', () => {
    it('returns deterministic noise values between -1 and 1', () => {
      const n1 = pseudoNoise2D(12.34, 56.78);
      const n2 = pseudoNoise2D(12.34, 56.78);
      expect(n1).toBe(n2);
      expect(n1).toBeGreaterThanOrEqual(-1);
      expect(n1).toBeLessThanOrEqual(1);
    });

    it('handles negative coordinates gracefully', () => {
      const n = pseudoNoise2D(-5.2, -10.8);
      expect(typeof n).toBe('number');
      expect(n).toBeGreaterThanOrEqual(-1);
      expect(n).toBeLessThanOrEqual(1);
    });
  });

  describe('interpolateAuroraColor', () => {
    it('returns starting palette color when t = 0', () => {
      const start = interpolateAuroraColor(0, 'marine');
      const marineStart = AURORA_PALETTES.marine[0];
      expect(start).toContain(`rgba(${marineStart.r}, ${marineStart.g}, ${marineStart.b}`);
    });

    it('returns ending palette color when t = 1', () => {
      const end = interpolateAuroraColor(1, 'emerald');
      const emeraldEnd = AURORA_PALETTES.emerald[AURORA_PALETTES.emerald.length - 1];
      expect(end).toContain(`rgba(${emeraldEnd.r}, ${emeraldEnd.g}, ${emeraldEnd.b}`);
    });

    it('clamps t out of bounds (below 0 or above 1)', () => {
      const low = interpolateAuroraColor(-0.5, 'arctic');
      const high = interpolateAuroraColor(1.5, 'arctic');
      expect(low).toBe(interpolateAuroraColor(0, 'arctic'));
      expect(high).toBe(interpolateAuroraColor(1, 'arctic'));
    });

    it('applies alphaMultiplier correctly', () => {
      const fullAlpha = interpolateAuroraColor(0, 'marine', 1);
      const halfAlpha = interpolateAuroraColor(0, 'marine', 0.5);
      expect(fullAlpha).not.toBe(halfAlpha);
      expect(halfAlpha).toContain('0.40'); // 0.8 * 0.5
    });

    it('falls back to marine palette if an unknown key is provided', () => {
      // @ts-expect-error testing invalid runtime key fallback
      const color = interpolateAuroraColor(0.5, 'non-existent');
      expect(color).toContain('rgba(');
    });
  });
});
