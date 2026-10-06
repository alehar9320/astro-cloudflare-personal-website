import { describe, expect, it } from 'vitest';
import {
  calculateRefractionOffset,
  calculateWaveY,
  getSpatialStep,
  type WaveParams,
} from './aurora-math';

describe('aurora-math utilities', () => {
  describe('calculateWaveY', () => {
    const defaultParams: WaveParams = {
      frequency: 0.01,
      amplitude: 50,
      speed: 1,
      phaseShift: 0,
      verticalOffset: 100,
    };

    it('calculates baseline vertical offset when sine evaluates to 0', () => {
      // Math.sin(0) === 0 -> 100 + 0 * 50 = 100
      const y = calculateWaveY(0, 0, defaultParams);
      expect(y).toBeCloseTo(100);
    });

    it('accounts for amplitude and sine phase shifts', () => {
      // x * freq + time * speed + phaseShift = Math.PI / 2 -> Math.sin = 1
      const params: WaveParams = {
        ...defaultParams,
        phaseShift: Math.PI / 2,
      };
      const y = calculateWaveY(0, 0, params);
      expect(y).toBeCloseTo(150);
    });

    it('progresses deterministically with time parameter', () => {
      const y0 = calculateWaveY(10, 0, defaultParams);
      const y1 = calculateWaveY(10, 1, defaultParams);
      expect(y0).not.toBe(y1);
    });
  });

  describe('getSpatialStep', () => {
    it('returns minimum step size of 4 for non-positive or small viewports', () => {
      expect(getSpatialStep(0)).toBe(4);
      expect(getSpatialStep(-100)).toBe(4);
      expect(getSpatialStep(320)).toBe(4);
      expect(getSpatialStep(400)).toBe(4);
    });

    it('scales spatial step interval dynamically for larger desktop viewports', () => {
      expect(getSpatialStep(1200)).toBe(10);
      expect(getSpatialStep(1920)).toBe(16);
      expect(getSpatialStep(2560)).toBe(21);
    });
  });

  describe('calculateRefractionOffset', () => {
    it('returns zero offset when mouse is null', () => {
      expect(calculateRefractionOffset(null, null, 100, 100)).toEqual({ dx: 0, dy: 0 });
      expect(calculateRefractionOffset(50, null, 100, 100)).toEqual({ dx: 0, dy: 0 });
      expect(calculateRefractionOffset(null, 50, 100, 100)).toEqual({ dx: 0, dy: 0 });
    });

    it('returns zero offset when distance exceeds maxRadius', () => {
      const offset = calculateRefractionOffset(0, 0, 300, 300, 150);
      expect(offset).toEqual({ dx: 0, dy: 0 });
    });

    it('returns zero offset when mouse coincides exactly with wave vertex', () => {
      const offset = calculateRefractionOffset(100, 100, 100, 100, 150);
      expect(offset).toEqual({ dx: 0, dy: 0 });
    });

    it('calculates positive repulsion offset when mouse is within maxRadius', () => {
      // Wave at (100, 100), mouse at (100, 50) -> deltaY = 50, distance = 50
      const offset = calculateRefractionOffset(100, 50, 100, 100, 150, 30);
      expect(offset.dx).toBeCloseTo(0);
      // factor = (1 - 50/150) * 30 = (2/3) * 30 = 20
      expect(offset.dy).toBeCloseTo(20);
    });
  });
});
