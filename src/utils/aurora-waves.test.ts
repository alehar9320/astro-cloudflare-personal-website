import { describe, expect, it } from 'vitest';
import {
  calculateWaveComponent,
  calculateAuroraWavePoint,
  getSpatialStep,
  getAuroraColor,
} from './aurora-waves';

describe('aurora-waves math utility', () => {
  describe('calculateWaveComponent', () => {
    it('returns 0 if wavelength is <= 0', () => {
      expect(
        calculateWaveComponent(100, 1, { wavelength: 0, amplitude: 20, speed: 1, offset: 0 })
      ).toBe(0);
      expect(
        calculateWaveComponent(100, 1, { wavelength: -10, amplitude: 20, speed: 1, offset: 0 })
      ).toBe(0);
    });

    it('calculates sine displacement correctly', () => {
      const result = calculateWaveComponent(0, 0, {
        wavelength: 100,
        amplitude: 50,
        speed: 1,
        offset: 0,
      });
      expect(result).toBeCloseTo(0);

      const halfPiOffset = calculateWaveComponent(0, 0, {
        wavelength: 100,
        amplitude: 50,
        speed: 1,
        offset: Math.PI / 2,
      });
      expect(halfPiOffset).toBeCloseTo(50);
    });
  });

  describe('calculateAuroraWavePoint', () => {
    it('superimposes multiple wave components onto baseY', () => {
      const waves = [
        { wavelength: 100, amplitude: 10, speed: 1, offset: 0 },
        { wavelength: 200, amplitude: 20, speed: 0.5, offset: 0 },
      ];
      const pointAtZero = calculateAuroraWavePoint(0, 0, 100, waves);
      expect(pointAtZero).toBeCloseTo(100);
    });
  });

  describe('getSpatialStep', () => {
    it('returns 4 for non-positive widths', () => {
      expect(getSpatialStep(0)).toBe(4);
      expect(getSpatialStep(-500)).toBe(4);
    });

    it('scales spatial step interval based on viewport width', () => {
      expect(getSpatialStep(320)).toBe(4);
      expect(getSpatialStep(1200)).toBe(10);
      expect(getSpatialStep(1920)).toBe(16);
    });
  });

  describe('getAuroraColor', () => {
    it('returns valid rgba strings and clamps out-of-bound inputs', () => {
      const darkColor = getAuroraColor(0, 0.5);
      expect(darkColor).toBe('rgba(15, 23, 42, 0.5)');

      const midColor = getAuroraColor(0.5, 1);
      expect(midColor).toBe('rgba(6, 182, 212, 1)');

      const brightColor = getAuroraColor(1, 0.8);
      expect(brightColor).toBe('rgba(16, 185, 129, 0.8)');

      const clampedLow = getAuroraColor(-0.5, -0.2);
      expect(clampedLow).toBe('rgba(15, 23, 42, 0)');

      const clampedHigh = getAuroraColor(1.5, 1.5);
      expect(clampedHigh).toBe('rgba(16, 185, 129, 1)');
    });
  });
});
