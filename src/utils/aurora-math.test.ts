import { describe, expect, it } from 'vitest';
import {
  calculateWaveHeight,
  calculateRefractionVector,
  colorToRgbaString,
  interpolateAuroraColor,
  type WaveLayer,
} from './aurora-math';

describe('aurora-math', () => {
  describe('calculateWaveHeight', () => {
    it('returns 0 when no layers are provided', () => {
      expect(calculateWaveHeight(10, 1, [])).toBe(0);
    });

    it('calculates exact sine height for a single wave layer', () => {
      const layer: WaveLayer = { amplitude: 10, frequency: 1, speed: 0, phase: 0 };
      expect(calculateWaveHeight(Math.PI / 2, 0, [layer])).toBeCloseTo(10, 5);
    });

    it('superimposes multiple wave layers', () => {
      const layers: WaveLayer[] = [
        { amplitude: 10, frequency: 1, speed: 0, phase: 0 },
        { amplitude: 5, frequency: 2, speed: 0, phase: 0 },
      ];
      // sin(pi/2) * 10 + sin(pi) * 5 = 10 + 0 = 10
      expect(calculateWaveHeight(Math.PI / 2, 0, layers)).toBeCloseTo(10, 5);
    });
  });

  describe('calculateRefractionVector', () => {
    it('returns zero displacement if point is outside maxRadius', () => {
      const result = calculateRefractionVector(100, 100, 0, 0, 50);
      expect(result).toEqual({ dx: 0, dy: 0, intensity: 0 });
    });

    it('returns zero displacement if maxRadius is zero or negative', () => {
      expect(calculateRefractionVector(10, 10, 0, 0, 0)).toEqual({ dx: 0, dy: 0, intensity: 0 });
      expect(calculateRefractionVector(10, 10, 0, 0, -10)).toEqual({ dx: 0, dy: 0, intensity: 0 });
    });

    it('calculates smooth displacement vectors inside radius', () => {
      const result = calculateRefractionVector(10, 0, 0, 0, 20);
      expect(result.intensity).toBeCloseTo(0.25, 2);
      expect(result.dx).toBeGreaterThan(0);
      expect(result.dy).toBe(0);
    });
  });

  describe('interpolateAuroraColor', () => {
    it('returns start color for t <= 0', () => {
      const color = interpolateAuroraColor(-0.5);
      expect(color).toEqual({ r: 0, g: 21, b: 41, a: 0.85 });
    });

    it('returns end color for t >= 1', () => {
      const color = interpolateAuroraColor(1.5);
      expect(color).toEqual({ r: 107, g: 33, b: 168, a: 0.5 });
    });

    it('smoothly interpolates intermediate positions', () => {
      const color = interpolateAuroraColor(0.35);
      expect(color).toEqual({ r: 0, g: 229, b: 255, a: 0.75 });
    });
  });

  describe('colorToRgbaString', () => {
    it('formats ColorRGBA as CSS rgba string', () => {
      const str = colorToRgbaString({ r: 0, g: 229, b: 255, a: 0.75 });
      expect(str).toBe('rgba(0, 229, 255, 0.75)');
    });
  });
});
