import { describe, expect, it } from 'vitest';
import {
  calculateAuroraWave,
  getEffectiveDpr,
  getOptimalParticleCount,
  refractPoint,
} from './aurora-math';

describe('aurora-math utilities', () => {
  describe('calculateAuroraWave', () => {
    it('returns deterministic elevation values for given inputs', () => {
      const elev1 = calculateAuroraWave(0.5, 1.0, 2, 30, 0);
      const elev2 = calculateAuroraWave(0.5, 1.0, 2, 30, 0);
      expect(elev1).toBe(elev2);
      expect(typeof elev1).toBe('number');
    });

    it('scales height displacement proportionally with amplitude', () => {
      const elevSmall = calculateAuroraWave(0.25, 0, 2, 10, 0);
      const elevLarge = calculateAuroraWave(0.25, 0, 2, 100, 0);
      expect(Math.abs(elevLarge)).toBeGreaterThan(Math.abs(elevSmall));
    });

    it('shifts wave phase correctly', () => {
      const elev1 = calculateAuroraWave(0.5, 0, 2, 30, 0);
      const elevPhase = calculateAuroraWave(0.5, 0, 2, 30, Math.PI / 2);
      expect(elev1).not.toBe(elevPhase);
    });
  });

  describe('refractPoint', () => {
    it('leaves points outside influence radius unchanged', () => {
      const pt = refractPoint(500, 500, 0, 0, 150, 40);
      expect(pt).toEqual({ x: 500, y: 500 });
    });

    it('leaves point exactly at pointer unchanged', () => {
      const pt = refractPoint(100, 100, 100, 100, 150, 40);
      expect(pt).toEqual({ x: 100, y: 100 });
    });

    it('displaces point away from pointer when within radius', () => {
      const pt = refractPoint(110, 100, 100, 100, 150, 40);
      expect(pt.x).toBeGreaterThan(110);
      expect(pt.y).toBe(100);
    });

    it('attenuates displacement as point moves further from pointer', () => {
      const ptNear = refractPoint(110, 100, 100, 100, 150, 40);
      const ptFar = refractPoint(180, 100, 100, 100, 150, 40);
      const shiftNear = ptNear.x - 110;
      const shiftFar = ptFar.x - 180;
      expect(shiftNear).toBeGreaterThan(shiftFar);
    });
  });

  describe('getOptimalParticleCount', () => {
    it('returns low count for mobile viewports (< 600px)', () => {
      expect(getOptimalParticleCount(400, false)).toBe(36);
    });

    it('returns low count for touch devices regardless of width', () => {
      expect(getOptimalParticleCount(1200, true)).toBe(36);
    });

    it('returns medium count for tablet viewports (600px - 1023px)', () => {
      expect(getOptimalParticleCount(800, false)).toBe(64);
    });

    it('returns high count for desktop viewports (>= 1024px)', () => {
      expect(getOptimalParticleCount(1440, false)).toBe(100);
    });
  });

  describe('getEffectiveDpr', () => {
    it('caps DPR at 2 for retina displays with DPR 3+', () => {
      expect(getEffectiveDpr(3)).toBe(2);
      expect(getEffectiveDpr(2.5)).toBe(2);
    });

    it('preserves valid DPR <= 2', () => {
      expect(getEffectiveDpr(1)).toBe(1);
      expect(getEffectiveDpr(1.5)).toBe(1.5);
      expect(getEffectiveDpr(2)).toBe(2);
    });

    it('falls back to 1 for undefined, NaN, or non-positive DPR', () => {
      expect(getEffectiveDpr(undefined)).toBe(1);
      expect(getEffectiveDpr(NaN)).toBe(1);
      expect(getEffectiveDpr(0)).toBe(1);
      expect(getEffectiveDpr(-1)).toBe(1);
    });
  });
});
