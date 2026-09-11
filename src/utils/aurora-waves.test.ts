import { describe, expect, it } from 'vitest';
import {
  calculateAuroraWaveHeight,
  calculateRefractionVector,
  getAuroraPalette,
  type WaveConfig,
} from './aurora-waves';

describe('aurora-waves utility', () => {
  describe('calculateAuroraWaveHeight', () => {
    it('returns consistent wave displacement for given parameters', () => {
      const config: WaveConfig = {
        frequency: 0.01,
        amplitude: 30,
        phase: 0,
        speed: 0.02,
      };
      const height1 = calculateAuroraWaveHeight(100, 10, config);
      const height2 = calculateAuroraWaveHeight(100, 10, config);
      expect(height1).toBe(height2);
      expect(typeof height1).toBe('number');
      expect(Number.isNaN(height1)).toBe(false);
    });

    it('changes height when time advances', () => {
      const config: WaveConfig = {
        frequency: 0.02,
        amplitude: 40,
        phase: 1,
        speed: 0.05,
      };
      const h0 = calculateAuroraWaveHeight(50, 0, config);
      const h1 = calculateAuroraWaveHeight(50, 10, config);
      expect(h0).not.toBe(h1);
    });
  });

  describe('calculateRefractionVector', () => {
    it('returns zero displacement when pointer is out of radius', () => {
      const result = calculateRefractionVector(0, 0, 200, 200, 100);
      expect(result.dx).toBe(0);
      expect(result.dy).toBe(0);
      expect(result.intensity).toBe(0);
    });

    it('returns zero displacement for negative or zero maxRadius', () => {
      const result = calculateRefractionVector(50, 50, 50, 50, 0);
      expect(result).toEqual({ dx: 0, dy: 0, intensity: 0 });
    });

    it('calculates smooth displacement within interaction radius', () => {
      const result = calculateRefractionVector(100, 100, 90, 100, 50);
      expect(result.intensity).toBeGreaterThan(0);
      expect(result.intensity).toBeLessThanOrEqual(1);
      expect(result.dx).toBeGreaterThan(0);
    });

    it('handles exact overlapping point coordinates safely without NaN', () => {
      const result = calculateRefractionVector(100, 100, 100, 100, 50);
      expect(result.dx).toBe(0);
      expect(result.dy).toBe(0);
      expect(result.intensity).toBe(0);
      expect(Number.isNaN(result.dx)).toBe(false);
    });
  });

  describe('getAuroraPalette', () => {
    it('returns 4 HSLA color strings', () => {
      const palette = getAuroraPalette(0.8);
      expect(palette).toHaveLength(4);
      expect(palette[0]).toContain('hsla');
      expect(palette[0]).toContain('0.8');
    });

    it('clamps negative or >1 alpha values safely', () => {
      const paletteMin = getAuroraPalette(-0.5);
      expect(paletteMin[0]).toContain('0)');

      const paletteMax = getAuroraPalette(1.5);
      expect(paletteMax[0]).toContain('1)');
    });
  });
});
