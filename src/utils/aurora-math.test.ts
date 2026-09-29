import { describe, expect, it } from 'vitest';
import { calculateWaveY, cubicSmoothstep, type PointerState, type WaveConfig } from './aurora-math';

describe('aurora-math', () => {
  describe('cubicSmoothstep', () => {
    it('returns 1 when distance is 0 or negative', () => {
      expect(cubicSmoothstep(0, 100)).toBe(1);
      expect(cubicSmoothstep(-10, 100)).toBe(1);
    });

    it('returns 0 when distance is greater than or equal to radius', () => {
      expect(cubicSmoothstep(100, 100)).toBe(0);
      expect(cubicSmoothstep(150, 100)).toBe(0);
    });

    it('returns 0 if radius is 0 or negative', () => {
      expect(cubicSmoothstep(10, 0)).toBe(0);
      expect(cubicSmoothstep(10, -50)).toBe(0);
    });

    it('computes smooth quadratic attenuation at midpoint', () => {
      // At dist=50, radius=100 -> norm = 0.5 -> 0.5^2 = 0.25
      expect(cubicSmoothstep(50, 100)).toBeCloseTo(0.25, 4);
    });
  });

  describe('calculateWaveY', () => {
    const config: WaveConfig = {
      baseY: 200,
      amplitude: 20,
      frequency: 0.01,
      speed: 0.001,
      phase: 0,
    };

    const inactivePointer: PointerState = { x: 0, y: 0, active: false };

    it('calculates sinusoidal wave position when pointer is inactive', () => {
      const y = calculateWaveY(0, 0, config, inactivePointer);
      // Math.sin(0) = 0 -> y = 200
      expect(y).toBe(200);
    });

    it('applies pointer displacement when pointer is active and within radius', () => {
      const activePointer: PointerState = { x: 100, y: 300, active: true };
      const yWithPointer = calculateWaveY(100, 0, config, activePointer, 180);
      const yWithoutPointer = calculateWaveY(100, 0, config, inactivePointer, 180);

      // Pointer dy = 300 - 200 = 100. At dist=0, cubicSmoothstep = 1. displacement = 100 * 1 * 0.25 = 25.
      expect(yWithPointer - yWithoutPointer).toBeCloseTo(25, 4);
    });

    it('ignores pointer displacement when pointer is outside radius', () => {
      const activePointer: PointerState = { x: 500, y: 300, active: true };
      const yWithPointer = calculateWaveY(100, 0, config, activePointer, 180);
      const yWithoutPointer = calculateWaveY(100, 0, config, inactivePointer, 180);

      expect(yWithPointer).toBe(yWithoutPointer);
    });
  });
});
