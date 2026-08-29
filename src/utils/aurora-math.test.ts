import { describe, expect, it } from 'vitest';
import {
  calculateMagnetosphereDisplacement,
  calculateWaveSuperposition,
  formatRGBAColor,
  interpolateAuroraColor,
  type WaveLayer,
} from './aurora-math';

describe('aurora-math utility', () => {
  describe('calculateWaveSuperposition', () => {
    it('returns 0 for empty wave layers', () => {
      expect(calculateWaveSuperposition(10, 5, [])).toBe(0);
    });

    it('calculates superposition correctly for single layer at time = 0', () => {
      const layer: WaveLayer = { amplitude: 10, frequency: 0.1, speed: 0.05, phase: 0 };
      expect(calculateWaveSuperposition(0, 0, [layer])).toBe(0);
    });

    it('sums multiple layers accurately', () => {
      const layers: WaveLayer[] = [
        { amplitude: 10, frequency: 0.01, speed: 0.02, phase: 0 },
        { amplitude: 5, frequency: 0.02, speed: 0.01, phase: Math.PI / 2 },
      ];
      const val = calculateWaveSuperposition(0, 0, layers);
      // Math.sin(0) = 0, Math.sin(Math.PI/2) = 1 -> 0 + 5*1 = 5
      expect(val).toBeCloseTo(5);
    });
  });

  describe('calculateMagnetosphereDisplacement', () => {
    it('returns 0 displacement if point is outside magnetosphere radius', () => {
      const res = calculateMagnetosphereDisplacement(100, 100, 0, 0, 50);
      expect(res).toEqual({ dx: 0, dy: 0 });
    });

    it('returns 0 displacement if point is at cursor position (dist = 0)', () => {
      const res = calculateMagnetosphereDisplacement(50, 50, 50, 50, 100);
      expect(res).toEqual({ dx: 0, dy: 0 });
    });

    it('returns non-zero displacement within magnetosphere radius', () => {
      const res = calculateMagnetosphereDisplacement(60, 50, 50, 50, 100);
      expect(res.dx).toBeGreaterThan(0);
      expect(res.dy).toBe(0);
    });
  });

  describe('interpolateAuroraColor', () => {
    it('clamps factor below 0 to Marine Blue color', () => {
      const color = interpolateAuroraColor(-0.5);
      expect(color).toEqual({ r: 15, g: 23, b: 42, a: 0.8 });
    });

    it('clamps factor above 1 to Aurora Violet color', () => {
      const color = interpolateAuroraColor(1.5);
      expect(color).toEqual({ r: 129, g: 140, b: 248, a: 0.85 });
    });

    it('interpolates mid points smoothly', () => {
      const mid = interpolateAuroraColor(0.2);
      expect(mid.r).toBeGreaterThan(6);
      expect(mid.g).toBeGreaterThan(23);
      expect(mid.b).toBeGreaterThan(42);
    });
  });

  describe('formatRGBAColor', () => {
    it('formats RGBAColor object into css string', () => {
      const str = formatRGBAColor({ r: 10, g: 200, b: 150, a: 0.75 });
      expect(str).toBe('rgba(10, 200, 150, 0.75)');
    });
  });
});
