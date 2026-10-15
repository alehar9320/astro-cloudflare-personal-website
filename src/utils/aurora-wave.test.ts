import { describe, expect, it } from 'vitest';
import {
  calculateAuroraColor,
  calculateAuroraWave,
  calculatePointerRefraction,
  getAuroraCanvasDimensions,
} from './aurora-wave';

describe('aurora-wave utility', () => {
  describe('calculateAuroraWave', () => {
    it('calculates deterministic wave displacement based on x and time', () => {
      const val1 = calculateAuroraWave(100, 1.5);
      const val2 = calculateAuroraWave(100, 1.5);
      expect(val1).toBe(val2);
      expect(typeof val1).toBe('number');
      expect(Number.isNaN(val1)).toBe(false);
    });

    it('produces different displacement over time', () => {
      const valT1 = calculateAuroraWave(100, 0);
      const valT2 = calculateAuroraWave(100, 5);
      expect(valT1).not.toBe(valT2);
    });

    it('respects custom wave configuration array', () => {
      const customConfig = [{ frequency: 0.1, amplitude: 10, phase: 0, speed: 1 }];
      const displacement = calculateAuroraWave(0, 0, customConfig);
      // sin(0) * 10 = 0
      expect(displacement).toBe(0);
    });
  });

  describe('calculateAuroraColor', () => {
    it('returns valid hsla string for low wave ratio (0)', () => {
      const color = calculateAuroraColor(0, 0.8);
      expect(color).toBe('hsla(215, 65%, 15%, 0.80)');
    });

    it('returns cyan hsla string for high wave crest ratio (1)', () => {
      const color = calculateAuroraColor(1, 1);
      expect(color).toBe('hsla(185, 100%, 55%, 1.00)');
    });

    it('clamps out-of-bound ratio and opacity values gracefully', () => {
      const clampedLow = calculateAuroraColor(-0.5, -0.2);
      expect(clampedLow).toBe('hsla(215, 65%, 15%, 0.00)');

      const clampedHigh = calculateAuroraColor(1.8, 1.5);
      expect(clampedHigh).toBe('hsla(185, 100%, 55%, 1.00)');
    });
  });

  describe('getAuroraCanvasDimensions', () => {
    it('scales dimensions by DPR on desktop', () => {
      const dims = getAuroraCanvasDimensions(800, 600, 2, false);
      expect(dims.width).toBe(1600);
      expect(dims.height).toBe(1200);
      expect(dims.dpr).toBe(2);
    });

    it('caps DPR at 1 on mobile viewports for performance', () => {
      const dims = getAuroraCanvasDimensions(800, 600, 3, true);
      expect(dims.width).toBe(800);
      expect(dims.height).toBe(600);
      expect(dims.dpr).toBe(1);
    });

    it('handles minimum dimension boundaries gracefully', () => {
      const dims = getAuroraCanvasDimensions(0, -10, 1, false);
      expect(dims.width).toBe(1);
      expect(dims.height).toBe(1);
    });
  });

  describe('calculatePointerRefraction', () => {
    it('returns maximum intensity at exact pointer coordinate', () => {
      const offset = calculatePointerRefraction(100, 100, 100, 25);
      expect(offset).toBeCloseTo(25, 2);
    });

    it('returns 0 beyond interaction radius', () => {
      const offset = calculatePointerRefraction(300, 100, 100, 25);
      expect(offset).toBe(0);
    });

    it('smoothly decays between 0 and radius', () => {
      const midOffset = calculatePointerRefraction(150, 100, 100, 25);
      expect(midOffset).toBeGreaterThan(0);
      expect(midOffset).toBeLessThan(25);
    });
  });
});
