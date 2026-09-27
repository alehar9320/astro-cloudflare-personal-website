import { describe, expect, it } from 'vitest';
import {
  calculateAuroraWave,
  calculatePointerDisplacement,
  cubicSmoothstep,
  getCanvasViewportScale,
} from './aurora-math';

describe('aurora-math utilities', () => {
  describe('calculateAuroraWave', () => {
    it('returns deterministic elevation values for given coordinates', () => {
      const val1 = calculateAuroraWave(100, 500);
      const val2 = calculateAuroraWave(100, 500);
      expect(val1).toBe(val2);
    });

    it('stays within reasonable harmonic bounds for standard amplitude', () => {
      const amplitude = 20;
      for (let x = 0; x < 1000; x += 100) {
        const val = calculateAuroraWave(x, 1000, 0.005, 0.001, amplitude);
        // Sum of harmonic coefficients is 1 + 0.4 + 0.25 = 1.65 * amplitude = 33
        expect(Math.abs(val)).toBeLessThanOrEqual(amplitude * 1.65 + 0.001);
      }
    });
  });

  describe('cubicSmoothstep', () => {
    it('returns 1 when distance is 0', () => {
      expect(cubicSmoothstep(0, 100)).toBe(1);
    });

    it('returns 0 when distance equals or exceeds radius', () => {
      expect(cubicSmoothstep(100, 100)).toBe(0);
      expect(cubicSmoothstep(150, 100)).toBe(0);
    });

    it('returns cubic smoothstep attenuation at radius / 2', () => {
      // At d = 50, r = 100: (1 - 0.5)^2 = 0.25
      expect(cubicSmoothstep(50, 100)).toBeCloseTo(0.25);
    });

    it('handles edge case when radius <= 0', () => {
      expect(cubicSmoothstep(10, 0)).toBe(0);
      expect(cubicSmoothstep(10, -50)).toBe(0);
    });
  });

  describe('calculatePointerDisplacement', () => {
    it('returns zero displacement if pointer is outside radius', () => {
      const result = calculatePointerDisplacement(0, 0, 200, 200, 100);
      expect(result).toEqual({ dx: 0, dy: 0, intensity: 0 });
    });

    it('calculates direction and intensity for node inside radius', () => {
      // Node at (100, 0), Pointer at (0, 0), Radius 200
      // distance = 100. cubicSmoothstep(100, 200) = (1 - 0.5)^2 = 0.25
      // intensity = 0.25, pushDistance = 0.25 * 28 = 7
      // angle = atan2(0, 100) = 0
      const result = calculatePointerDisplacement(100, 0, 0, 0, 200);
      expect(result.intensity).toBeCloseTo(0.25);
      expect(result.dx).toBeCloseTo(7);
      expect(result.dy).toBeCloseTo(0);
    });
  });

  describe('getCanvasViewportScale', () => {
    it('clamps devicePixelRatio to maximum 2.0', () => {
      const { dpr } = getCanvasViewportScale(1024, 3.5);
      expect(dpr).toBe(2);
    });

    it('defaults dpr to 1 if invalid or 0', () => {
      const { dpr } = getCanvasViewportScale(1024, 0);
      expect(dpr).toBe(1);
    });

    it('applies smaller scale factor on narrow mobile viewports', () => {
      expect(getCanvasViewportScale(360, 2).scale).toBe(0.55);
      expect(getCanvasViewportScale(600, 2).scale).toBe(0.75);
      expect(getCanvasViewportScale(1024, 2).scale).toBe(1.0);
    });
  });
});
