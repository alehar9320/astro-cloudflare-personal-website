import { describe, expect, it } from 'vitest';
import { calculateWaveY, getAuroraColorStops, lerp } from '../aurora-math';

describe('aurora-math', () => {
  describe('lerp', () => {
    it('interpolates correctly at midpoint', () => {
      expect(lerp(0, 100, 0.5)).toBe(50);
    });

    it('clamps interpolation factor between 0 and 1', () => {
      expect(lerp(0, 100, -0.5)).toBe(0);
      expect(lerp(0, 100, 1.5)).toBe(100);
    });
  });

  describe('calculateWaveY', () => {
    const params = {
      amplitude: 20,
      frequency: 0.01,
      phase: 0,
      speed: 1,
    };

    it('returns baseline when amplitude is zero', () => {
      const zeroParams = { ...params, amplitude: 0 };
      expect(calculateWaveY(50, 100, 0, zeroParams)).toBe(100);
    });

    it('calculates deterministic wave height based on time', () => {
      const y1 = calculateWaveY(100, 200, 0, params);
      const y2 = calculateWaveY(100, 200, 1, params);
      expect(y1).not.toBe(y2);
    });

    it('applies pointer refraction displacement within radius', () => {
      const yBase = calculateWaveY(100, 200, 0, params);
      const yRefracted = calculateWaveY(100, 200, 0, params, 100, 200, 150);
      expect(yRefracted).not.toBe(yBase);
    });

    it('ignores pointer when pointer is outside radius', () => {
      const yBase = calculateWaveY(100, 200, 0, params);
      const yFarPointer = calculateWaveY(100, 200, 0, params, 1000, 2000, 50);
      expect(yFarPointer).toBe(yBase);
    });
  });

  describe('getAuroraColorStops', () => {
    it('returns color stops array for each layer', () => {
      const layer0 = getAuroraColorStops(0);
      expect(layer0).toHaveLength(3);
      expect(layer0[0].color).toContain('rgba');
    });

    it('cycles palettes deterministically for layer indices', () => {
      const layer0 = getAuroraColorStops(0);
      const layer3 = getAuroraColorStops(3);
      expect(layer0).toEqual(layer3);
    });
  });
});
