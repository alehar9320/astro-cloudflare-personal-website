import { describe, it, expect } from 'vitest';
import { clamp, cubicSmoothstep, calculateAuroraWave, getPerformanceConfig } from './aurora-math';

describe('aurora-math utilities', () => {
  describe('clamp', () => {
    it('clamps values below minimum', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('clamps values above maximum', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('returns original value when within bounds', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });
  });

  describe('cubicSmoothstep', () => {
    it('returns 0 if radius is non-positive', () => {
      expect(cubicSmoothstep(5, 0)).toBe(0);
      expect(cubicSmoothstep(5, -10)).toBe(0);
    });

    it('returns 1 at distance 0 or less', () => {
      expect(cubicSmoothstep(0, 100)).toBe(1);
      expect(cubicSmoothstep(-10, 100)).toBe(1);
    });

    it('returns 0 at distance equal to or greater than radius', () => {
      expect(cubicSmoothstep(100, 100)).toBe(0);
      expect(cubicSmoothstep(150, 100)).toBe(0);
    });

    it('calculates smooth cubic interpolation at midpoint', () => {
      // At distance = 50, radius = 100 -> t = 0.5
      // 0.5 * 0.5 * (3 - 2 * 0.5) = 0.25 * 2 = 0.5
      expect(cubicSmoothstep(50, 100)).toBeCloseTo(0.5, 4);
    });
  });

  describe('calculateAuroraWave', () => {
    it('computes deterministic wave offset for given parameters', () => {
      const wave1 = calculateAuroraWave(100, 1.0, 0.01, 20, 0.5);
      const wave2 = calculateAuroraWave(100, 1.0, 0.01, 20, 0.5);
      expect(wave1).toBe(wave2);
      expect(typeof wave1).toBe('number');
      expect(Number.isNaN(wave1)).toBe(false);
    });

    it('varies with time', () => {
      const waveT0 = calculateAuroraWave(100, 0, 0.01, 20, 0.5);
      const waveT1 = calculateAuroraWave(100, 2.0, 0.01, 20, 0.5);
      expect(waveT0).not.toBe(waveT1);
    });
  });

  describe('getPerformanceConfig', () => {
    it('returns desktop high-performance configuration', () => {
      const config = getPerformanceConfig(false, false);
      expect(config.waveCount).toBe(5);
      expect(config.sampleStep).toBe(3);
      expect(config.particleCount).toBe(60);
      expect(config.fpsCap).toBe(60);
    });

    it('returns mobile-optimized configuration', () => {
      const config = getPerformanceConfig(true, false);
      expect(config.waveCount).toBe(3);
      expect(config.sampleStep).toBe(5);
      expect(config.particleCount).toBe(30);
    });

    it('returns low-power minimal configuration when low power mode is active', () => {
      const config = getPerformanceConfig(false, true);
      expect(config.waveCount).toBe(2);
      expect(config.sampleStep).toBe(8);
      expect(config.particleCount).toBe(15);
      expect(config.fpsCap).toBe(30);
    });
  });
});
