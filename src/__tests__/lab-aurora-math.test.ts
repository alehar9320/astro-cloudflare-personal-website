import { describe, expect, it } from 'vitest';
import {
  calculateParticleAttraction,
  calculateStepInterval,
  calculateWaveY,
} from '../utils/aurora-math';

describe('aurora-math utilities', () => {
  describe('calculateWaveY', () => {
    it('calculates expected wave height based on sine wave formula', () => {
      const baseHeight = 100;
      const amplitude = 20;
      const resultAtZero = calculateWaveY(0, 0, 0.01, amplitude, 0, baseHeight);
      expect(resultAtZero).toBeCloseTo(100);

      const resultAtHalfPi = calculateWaveY(Math.PI / 2, 0, 1, amplitude, 0, baseHeight);
      expect(resultAtHalfPi).toBeCloseTo(120);
    });
  });

  describe('calculateParticleAttraction', () => {
    it('returns zero displacement when pointer is outside max radius', () => {
      const res = calculateParticleAttraction(0, 0, 200, 200, 100);
      expect(res).toEqual({ dx: 0, dy: 0 });
    });

    it('returns zero displacement when maxRadius is <= 0', () => {
      const res = calculateParticleAttraction(10, 10, 15, 15, 0);
      expect(res).toEqual({ dx: 0, dy: 0 });
    });

    it('returns displacement vector towards pointer when within radius', () => {
      const res = calculateParticleAttraction(0, 0, 50, 0, 100);
      expect(res.dx).toBeGreaterThan(0);
      expect(res.dy).toBeCloseTo(0);
    });

    it('handles identical particle and pointer position without NaN', () => {
      const res = calculateParticleAttraction(50, 50, 50, 50, 100);
      expect(res).toEqual({ dx: 0, dy: 0 });
    });
  });

  describe('calculateStepInterval', () => {
    it('returns default minimum step interval of 4 for small viewports', () => {
      expect(calculateStepInterval(320)).toBe(4);
      expect(calculateStepInterval(0)).toBe(4);
      expect(calculateStepInterval(-100)).toBe(4);
    });

    it('scales step interval dynamically for larger viewports', () => {
      expect(calculateStepInterval(1200)).toBe(10);
      expect(calculateStepInterval(1920)).toBe(16);
    });
  });
});
