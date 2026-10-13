import { describe, expect, it } from 'vitest';
import {
  AURORA_COLOR_PALETTE,
  calculateRefractionOffset,
  computeWaveY,
  interpolateAuroraColor,
  type WaveParameters,
} from './aurora-wave';

describe('aurora-wave math utilities', () => {
  describe('computeWaveY', () => {
    it('returns baseY when harmonics array is empty', () => {
      const params: WaveParameters = { baseY: 150, harmonics: [] };
      expect(computeWaveY(100, 0, params)).toBe(150);
      expect(computeWaveY(200, 10, params)).toBe(150);
    });

    it('computes wave elevation accurately with a single harmonic', () => {
      const params: WaveParameters = {
        baseY: 100,
        harmonics: [{ frequency: 0.01, amplitude: 20, speed: 1, phaseOffset: 0 }],
      };
      // At x=0, time=0: sin(0) = 0 => elevation = 100
      expect(computeWaveY(0, 0, params)).toBe(100);

      // At x=Math.PI / (2 * 0.01), time=0: sin(PI/2) = 1 => elevation = 120
      const xPeak = Math.PI / 0.02;
      expect(computeWaveY(xPeak, 0, params)).toBeCloseTo(120, 5);
    });

    it('superimposes multiple harmonics correctly', () => {
      const params: WaveParameters = {
        baseY: 200,
        harmonics: [
          { frequency: 0.01, amplitude: 10, speed: 0, phaseOffset: 0 },
          { frequency: 0.02, amplitude: 5, speed: 0, phaseOffset: 0 },
        ],
      };
      // At x=0, time=0: sin(0) + sin(0) = 0 => 200
      expect(computeWaveY(0, 0, params)).toBe(200);
    });
  });

  describe('calculateRefractionOffset', () => {
    it('returns zero displacement when pointer is null', () => {
      expect(calculateRefractionOffset(50, 50, null)).toEqual({ dx: 0, dy: 0 });
    });

    it('returns zero displacement when pointer is outside influence radius', () => {
      const offset = calculateRefractionOffset(0, 0, { x: 200, y: 200 }, 100);
      expect(offset).toEqual({ dx: 0, dy: 0 });
    });

    it('returns zero displacement when pointer is at the exact point location', () => {
      const offset = calculateRefractionOffset(100, 100, { x: 100, y: 100 });
      expect(offset).toEqual({ dx: 0, dy: 0 });
    });

    it('computes smooth displacement push-away vector when pointer is inside influence radius', () => {
      // Point at (100, 100), Pointer at (80, 100) -> distance = 20, maxRadius = 100
      const offset = calculateRefractionOffset(100, 100, { x: 80, y: 100 }, 100, 50);
      // diffX = 20, diffY = 0 -> dx should be positive (repelling away from pointer)
      expect(offset.dx).toBeGreaterThan(0);
      expect(offset.dy).toBe(0);

      // Factor = (1 - 20/100)^2 = 0.8^2 = 0.64
      // Force = 0.64 * 50 = 32
      expect(offset.dx).toBeCloseTo(32, 2);
    });
  });

  describe('interpolateAuroraColor', () => {
    it('handles empty or single-element palette gracefully', () => {
      expect(interpolateAuroraColor(0.5, [])).toBe('rgba(0, 242, 254, 1)');
      expect(interpolateAuroraColor(0.5, ['#00f2fe'])).toBe('#00f2fe');
    });

    it('clamps t values between 0 and 1', () => {
      expect(interpolateAuroraColor(-0.5, AURORA_COLOR_PALETTE)).toBe(AURORA_COLOR_PALETTE[0]);
      expect(interpolateAuroraColor(1.5, AURORA_COLOR_PALETTE)).toBe(
        AURORA_COLOR_PALETTE[AURORA_COLOR_PALETTE.length - 1]
      );
    });

    it('selects appropriate palette stop along gradient spectrum', () => {
      expect(interpolateAuroraColor(0, AURORA_COLOR_PALETTE)).toBe(AURORA_COLOR_PALETTE[0]);
      expect(interpolateAuroraColor(1, AURORA_COLOR_PALETTE)).toBe(
        AURORA_COLOR_PALETTE[AURORA_COLOR_PALETTE.length - 1]
      );
    });
  });
});
