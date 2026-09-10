import { describe, expect, it } from 'vitest';
import { calculateAuroraWave, calculateRefractionForce, smoothstep } from './aurora-math';

describe('aurora-math', () => {
  describe('smoothstep', () => {
    it('returns 0 when x is less than or equal to min', () => {
      expect(smoothstep(0, 100, -10)).toBe(0);
      expect(smoothstep(0, 100, 0)).toBe(0);
    });

    it('returns 1 when x is greater than or equal to max', () => {
      expect(smoothstep(0, 100, 100)).toBe(1);
      expect(smoothstep(0, 100, 150)).toBe(1);
    });

    it('returns 0.5 at the midpoint', () => {
      expect(smoothstep(0, 100, 50)).toBe(0.5);
    });
  });

  describe('calculateAuroraWave', () => {
    it('returns a deterministic finite number for given parameters', () => {
      const val = calculateAuroraWave(100, 500, 20, 0.005);
      expect(Number.isFinite(val)).toBe(true);
    });

    it('scales output according to amplitude', () => {
      const smallAmp = calculateAuroraWave(10, 10, 10, 0.01);
      const largeAmp = calculateAuroraWave(10, 10, 100, 0.01);
      expect(Math.abs(largeAmp)).toBeGreaterThan(Math.abs(smallAmp));
    });
  });

  describe('calculateRefractionForce', () => {
    it('returns 1 when point is exactly at cursor center', () => {
      expect(calculateRefractionForce(100, 100, 100, 100, 150)).toBe(1);
    });

    it('returns 0 when point is outside radius', () => {
      expect(calculateRefractionForce(300, 300, 100, 100, 150)).toBe(0);
    });

    it('returns a value between 0 and 1 when within radius', () => {
      const force = calculateRefractionForce(150, 100, 100, 100, 150);
      expect(force).toBeGreaterThan(0);
      expect(force).toBeLessThan(1);
    });
  });
});
