import { describe, expect, it } from 'vitest';
import {
  capDevicePixelRatio,
  interpolateColor,
  calculateAuroraWaveElevation,
  updateSpringState,
  formatRgba,
  NORTHERN_LIGHTS_PALETTE,
} from './aurora-math';

describe('aurora-math utilities', () => {
  describe('capDevicePixelRatio', () => {
    it('caps high DPR values to maxDpr (default 2)', () => {
      expect(capDevicePixelRatio(3)).toBe(2);
      expect(capDevicePixelRatio(4, 2)).toBe(2);
    });

    it('returns original DPR if less than maxDpr', () => {
      expect(capDevicePixelRatio(1)).toBe(1);
      expect(capDevicePixelRatio(1.5)).toBe(1.5);
    });

    it('handles invalid or non-positive DPR values gracefully', () => {
      expect(capDevicePixelRatio(0)).toBe(1);
      expect(capDevicePixelRatio(-2)).toBe(1);
      expect(capDevicePixelRatio(NaN)).toBe(1);
    });
  });

  describe('interpolateColor', () => {
    it('returns start color when t = 0', () => {
      const result = interpolateColor(
        NORTHERN_LIGHTS_PALETTE.marine,
        NORTHERN_LIGHTS_PALETTE.cyan,
        0
      );
      expect(result).toEqual(NORTHERN_LIGHTS_PALETTE.marine);
    });

    it('returns end color when t = 1', () => {
      const result = interpolateColor(
        NORTHERN_LIGHTS_PALETTE.marine,
        NORTHERN_LIGHTS_PALETTE.cyan,
        1
      );
      expect(result).toEqual(NORTHERN_LIGHTS_PALETTE.cyan);
    });

    it('blends values accurately at t = 0.5', () => {
      const c1 = { r: 0, g: 100, b: 200 };
      const c2 = { r: 100, g: 200, b: 0 };
      const result = interpolateColor(c1, c2, 0.5);
      expect(result).toEqual({ r: 50, g: 150, b: 100 });
    });

    it('clamps t factors outside [0, 1]', () => {
      const c1 = { r: 10, g: 20, b: 30 };
      const c2 = { r: 100, g: 100, b: 100 };
      expect(interpolateColor(c1, c2, -0.5)).toEqual(c1);
      expect(interpolateColor(c1, c2, 1.5)).toEqual(c2);
    });
  });

  describe('calculateAuroraWaveElevation', () => {
    it('returns 0 when wavelength is 0 or negative', () => {
      expect(calculateAuroraWaveElevation(10, 0, 0, 50)).toBe(0);
      expect(calculateAuroraWaveElevation(10, 0, -100, 50)).toBe(0);
    });

    it('computes deterministic wave elevations', () => {
      const elevation1 = calculateAuroraWaveElevation(100, 0, 400, 30, 0.5, 0);
      const elevation2 = calculateAuroraWaveElevation(100, 0, 400, 30, 0.5, 0);
      expect(elevation1).toBe(elevation2);
      expect(typeof elevation1).toBe('number');
    });

    it('changes elevation over time', () => {
      const e0 = calculateAuroraWaveElevation(50, 0, 300, 20);
      const e1 = calculateAuroraWaveElevation(50, 1, 300, 20);
      expect(e0).not.toBe(e1);
    });
  });

  describe('updateSpringState', () => {
    it('accelerates position toward target position', () => {
      const initial = { position: 0, velocity: 0 };
      const updated = updateSpringState(initial, 100, 0.1, 0.8);
      expect(updated.velocity).toBeGreaterThan(0);
      expect(updated.position).toBeGreaterThan(0);
    });

    it('eventually settles near target position', () => {
      let state = { position: 0, velocity: 0 };
      for (let i = 0; i < 100; i++) {
        state = updateSpringState(state, 50, 0.1, 0.8);
      }
      expect(Math.abs(state.position - 50)).toBeLessThan(0.1);
    });
  });

  describe('formatRgba', () => {
    it('formats RGB object to CSS rgba string', () => {
      expect(formatRgba({ r: 10, g: 25, b: 47 }, 0.8)).toBe('rgba(10, 25, 47, 0.8)');
    });

    it('clamps alpha between 0 and 1', () => {
      expect(formatRgba({ r: 255, g: 255, b: 255 }, -0.5)).toBe('rgba(255, 255, 255, 0)');
      expect(formatRgba({ r: 255, g: 255, b: 255 }, 2)).toBe('rgba(255, 255, 255, 1)');
    });
  });
});
