import { describe, expect, it } from 'vitest';
import {
  calculateRefractionAngle,
  getAuroraWaveY,
  getCappedDpr,
  updateParticlePosition,
} from './auroraMath';

describe('auroraMath utilities', () => {
  describe('getCappedDpr', () => {
    it('defaults to 1 for undefined, null, or invalid input', () => {
      expect(getCappedDpr()).toBe(1);
      expect(getCappedDpr(0)).toBe(1);
      expect(getCappedDpr(-1)).toBe(1);
      expect(getCappedDpr(NaN)).toBe(1);
    });

    it('returns dpr directly if between 0 and 2', () => {
      expect(getCappedDpr(1)).toBe(1);
      expect(getCappedDpr(1.5)).toBe(1.5);
      expect(getCappedDpr(2)).toBe(2);
    });

    it('caps dpr at 2 for retina / high-DPI displays', () => {
      expect(getCappedDpr(3)).toBe(2);
      expect(getCappedDpr(4)).toBe(2);
    });
  });

  describe('getAuroraWaveY', () => {
    it('calculates deterministic wave Y offset within expected multi-octave amplitude bounds', () => {
      const baseHeight = 200;
      const amplitude = 50;
      const y = getAuroraWaveY(100, 1.5, baseHeight, amplitude, 0.01);

      // Max amplitude upper bound is base + amp * (1 + 0.4 + 0.25) = 200 + 50 * 1.65 = 282.5
      // Lower bound is 200 - 82.5 = 117.5
      expect(y).toBeGreaterThanOrEqual(117.5);
      expect(y).toBeLessThanOrEqual(282.5);
    });
  });

  describe('updateParticlePosition', () => {
    it('applies velocity damping when pointer is null', () => {
      const updated = updateParticlePosition(10, 10, 2, 4, null, null, 0.9, 0.05);
      expect(updated.vx).toBeCloseTo(1.8);
      expect(updated.vy).toBeCloseTo(3.6);
      expect(updated.x).toBeCloseTo(11.8);
      expect(updated.y).toBeCloseTo(13.6);
    });

    it('attracts particle towards pointer when within interaction radius', () => {
      const updated = updateParticlePosition(100, 100, 0, 0, 150, 100, 0.95, 0.1);
      // Distance is 50px (within 200px radius). Attraction should accelerate particle in +x direction.
      expect(updated.vx).toBeGreaterThan(0);
      expect(updated.x).toBeGreaterThan(100);
    });

    it('does not attract particle when pointer is outside max interaction radius', () => {
      const updated = updateParticlePosition(0, 0, 1, 1, 500, 500, 0.95, 0.1);
      expect(updated.vx).toBeCloseTo(0.95);
      expect(updated.vy).toBeCloseTo(0.95);
    });
  });

  describe('calculateRefractionAngle', () => {
    it('calculates standard refraction angle via Snell law', () => {
      const angle = calculateRefractionAngle(Math.PI / 6, 0.8);
      expect(typeof angle).toBe('number');
      expect(isNaN(angle)).toBe(false);
    });

    it('handles total internal reflection safely without returning NaN', () => {
      const incidentAngle = Math.PI / 3;
      const angle = calculateRefractionAngle(incidentAngle, 2.5);
      expect(angle).toBe(-incidentAngle);
    });
  });
});
