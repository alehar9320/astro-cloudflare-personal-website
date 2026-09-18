import { describe, expect, it } from 'vitest';
import {
  calculateDPR,
  clamp,
  computePointerRefraction,
  computeSineWave,
  lerpColor,
} from './aurora-waves';

describe('aurora-waves math utilities', () => {
  describe('calculateDPR', () => {
    it('caps DPR at 2 for high DPI screens', () => {
      expect(calculateDPR(3)).toBe(2);
      expect(calculateDPR(2.5)).toBe(2);
      expect(calculateDPR(2)).toBe(2);
    });

    it('returns exact DPR when <= 2', () => {
      expect(calculateDPR(1)).toBe(1);
      expect(calculateDPR(1.5)).toBe(1.5);
    });

    it('handles invalid or non-positive DPR values gracefully', () => {
      expect(calculateDPR(0)).toBe(1);
      expect(calculateDPR(-1)).toBe(1);
      expect(calculateDPR(NaN)).toBe(1);
    });
  });

  describe('clamp', () => {
    it('clamps values within bounds', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('throws error if min > max', () => {
      expect(() => clamp(5, 10, 0)).toThrow('min cannot be greater than max');
    });
  });

  describe('computeSineWave', () => {
    it('calculates expected sine wave height', () => {
      const height = computeSineWave(0, 0, 20, 0.01, 1, 0);
      expect(height).toBe(0);

      const heightPeak = computeSineWave(Math.PI / (2 * 0.01), 0, 20, 0.01, 0, 0);
      expect(heightPeak).toBeCloseTo(20, 4);
    });
  });

  describe('computePointerRefraction', () => {
    it('returns zero vector when pointer is out of radius', () => {
      const vector = computePointerRefraction(0, 0, 200, 200, 100, 30);
      expect(vector).toEqual({ dx: 0, dy: 0 });
    });

    it('returns zero vector when distance is zero', () => {
      const vector = computePointerRefraction(100, 100, 100, 100, 150, 25);
      expect(vector).toEqual({ dx: 0, dy: 0 });
    });

    it('returns zero vector if radius is non-positive', () => {
      const vector = computePointerRefraction(10, 10, 12, 12, 0, 25);
      expect(vector).toEqual({ dx: 0, dy: 0 });
    });

    it('calculates refraction displacement vector within radius with falloff', () => {
      const vector = computePointerRefraction(50, 0, 0, 0, 100, 20);
      expect(vector.dx).toBeGreaterThan(0);
      expect(vector.dy).toBe(0);
      expect(vector.dx).toBeLessThan(20);
    });
  });

  describe('lerpColor', () => {
    const navy = { r: 10, g: 25, b: 47 };
    const cyan = { r: 0, g: 242, b: 254 };

    it('returns colorA at t=0', () => {
      expect(lerpColor(navy, cyan, 0)).toEqual(navy);
    });

    it('returns colorB at t=1', () => {
      expect(lerpColor(navy, cyan, 1)).toEqual(cyan);
    });

    it('interpolates midpoint at t=0.5', () => {
      expect(lerpColor(navy, cyan, 0.5)).toEqual({
        r: 5,
        g: 134,
        b: 151,
      });
    });

    it('clamps factor t to [0, 1]', () => {
      expect(lerpColor(navy, cyan, -1)).toEqual(navy);
      expect(lerpColor(navy, cyan, 2)).toEqual(cyan);
    });
  });
});
