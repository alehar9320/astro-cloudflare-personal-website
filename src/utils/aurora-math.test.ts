import { describe, expect, it } from 'vitest';
import { calculateHarmonicWave, calculateVectorAttraction, clampDpr } from './aurora-math';

describe('aurora-math utilities', () => {
  describe('clampDpr', () => {
    it('clamps DPR values to maximum of 2', () => {
      expect(clampDpr(3)).toBe(2);
      expect(clampDpr(2.5)).toBe(2);
      expect(clampDpr(2)).toBe(2);
    });

    it('clamps DPR values to minimum of 1', () => {
      expect(clampDpr(0.5)).toBe(1);
      expect(clampDpr(0)).toBe(1);
      expect(clampDpr(-1)).toBe(1);
    });

    it('handles NaN gracefully by returning 1', () => {
      expect(clampDpr(NaN)).toBe(1);
    });

    it('preserves standard DPR within range 1 to 2', () => {
      expect(clampDpr(1.5)).toBe(1.5);
      expect(clampDpr(1)).toBe(1);
    });
  });

  describe('calculateHarmonicWave', () => {
    it('calculates deterministic compound wave displacement', () => {
      const waveVal = calculateHarmonicWave(10, 0, 0.05, 20, 1);
      expect(typeof waveVal).toBe('number');
      expect(Number.isNaN(waveVal)).toBe(false);
    });

    it('changes value smoothly over time', () => {
      const val0 = calculateHarmonicWave(10, 0, 0.05, 20, 1);
      const val1 = calculateHarmonicWave(10, 0.1, 0.05, 20, 1);
      expect(val0).not.toBe(val1);
    });

    it('returns 0 displacement when amplitude is zero', () => {
      const waveVal = calculateHarmonicWave(50, 10, 0.05, 0, 1);
      expect(waveVal).toBe(0);
    });
  });

  describe('calculateVectorAttraction', () => {
    it('moves towards target position when far', () => {
      const current = { x: 0, y: 0 };
      const target = { x: 100, y: 0 };
      const nextPos = calculateVectorAttraction(current, target, 0.1, 5);

      expect(nextPos.x).toBe(5);
      expect(nextPos.y).toBe(0);
    });

    it('snaps to target if distance is negligible', () => {
      const current = { x: 10, y: 10 };
      const target = { x: 10.0001, y: 10 };
      const nextPos = calculateVectorAttraction(current, target, 0.1, 5);

      expect(nextPos.x).toBe(10.0001);
      expect(nextPos.y).toBe(10);
    });

    it('respects maxSpeed cap', () => {
      const current = { x: 0, y: 0 };
      const target = { x: 1000, y: 0 };
      const maxSpeed = 10;
      const nextPos = calculateVectorAttraction(current, target, 0.5, maxSpeed);

      expect(nextPos.x).toBe(10);
      expect(nextPos.y).toBe(0);
    });
  });
});
