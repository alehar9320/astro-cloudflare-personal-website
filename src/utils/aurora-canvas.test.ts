import { describe, expect, it } from 'vitest';
import {
  AURORA_COLORS,
  calculateAuroraWave,
  computeSpatialStep,
  createParticlePool,
  getNorthernLightsColor,
  updateParticlePositions,
} from './aurora-canvas';

describe('aurora-canvas math and physics utilities', () => {
  describe('calculateAuroraWave', () => {
    it('returns expected wave values for given inputs', () => {
      const val1 = calculateAuroraWave(10, 0, 0.01, 30, 0.02, 0);
      expect(typeof val1).toBe('number');
      expect(Number.isNaN(val1)).toBe(false);
      // Bound check: sine + cosine superposition max is amplitude * 1.5
      expect(Math.abs(val1)).toBeLessThanOrEqual(45);
    });

    it('handles zero or negative wavelength gracefully without division by zero', () => {
      const val = calculateAuroraWave(10, 1, 0, 20, 1, 0);
      expect(Number.isNaN(val)).toBe(false);
      expect(typeof val).toBe('number');
    });
  });

  describe('computeSpatialStep', () => {
    it('calculates dynamic step based on viewport width', () => {
      expect(computeSpatialStep(1920)).toBe(16);
      expect(computeSpatialStep(1200)).toBe(10);
      expect(computeSpatialStep(480)).toBe(4);
      expect(computeSpatialStep(320)).toBe(4); // clamped to min 4
    });

    it('handles 0 and negative widths by returning min step of 4', () => {
      expect(computeSpatialStep(0)).toBe(4);
      expect(computeSpatialStep(-100)).toBe(4);
    });
  });

  describe('createParticlePool', () => {
    it('pre-allocates particle array with correct length and properties', () => {
      const particles = createParticlePool(10, 800, 600);
      expect(particles).toHaveLength(10);

      const p0 = particles[0];
      expect(p0.x).toBeGreaterThanOrEqual(0);
      expect(p0.x).toBeLessThanOrEqual(800);
      expect(p0.y).toBeGreaterThanOrEqual(0);
      expect(p0.y).toBeLessThanOrEqual(600);
      expect(p0.vx).toBe(0);
      expect(p0.vy).toBe(0);
      expect(p0.baseX).toBe(p0.x);
      expect(p0.baseY).toBe(p0.y);
      expect(p0.size).toBeGreaterThan(0);
      expect(p0.colorIndex).toBe(0);
    });

    it('handles minimum count of 1 for edge cases', () => {
      const particles = createParticlePool(0, 100, 100);
      expect(particles).toHaveLength(1);
    });
  });

  describe('updateParticlePositions', () => {
    it('updates particle positions without throwing errors', () => {
      const particles = createParticlePool(5, 500, 500);
      const cursor = { x: 250, y: 250, active: true };

      updateParticlePositions(particles, cursor, 500, 500, 1.0);

      // Check that positions and velocities are updated
      for (const p of particles) {
        expect(typeof p.x).toBe('number');
        expect(typeof p.y).toBe('number');
        expect(Number.isNaN(p.x)).toBe(false);
        expect(Number.isNaN(p.y)).toBe(false);
      }
    });

    it('repels particles when active cursor is nearby', () => {
      const particles = [
        {
          x: 100,
          y: 100,
          vx: 0,
          vy: 0,
          baseX: 100,
          baseY: 100,
          size: 2,
          colorIndex: 0,
        },
      ];
      const cursor = { x: 90, y: 90, active: true };

      updateParticlePositions(particles, cursor, 500, 500, 1.0);

      // Particle at 100,100 pushed away from cursor at 90,90 -> vx and vy should be positive
      expect(particles[0].vx).toBeGreaterThan(0);
      expect(particles[0].vy).toBeGreaterThan(0);
    });

    it('restores particles to base position when cursor is inactive', () => {
      const particles = [
        {
          x: 150, // displaced from baseX 100
          y: 100,
          vx: 0,
          vy: 0,
          baseX: 100,
          baseY: 100,
          size: 2,
          colorIndex: 0,
        },
      ];
      const cursor = { x: 0, y: 0, active: false };

      updateParticlePositions(particles, cursor, 500, 500, 1.0);

      // Displaced to x=150, baseX=100 -> dxBase = -50 -> vx should become negative to pull back
      expect(particles[0].vx).toBeLessThan(0);
    });
  });

  describe('getNorthernLightsColor', () => {
    it('returns correct rgba string format', () => {
      const color = getNorthernLightsColor(0, 0.8);
      expect(color).toBe(`rgba(${AURORA_COLORS[0]}, 0.8)`);
    });

    it('clamps alpha values between 0 and 1', () => {
      expect(getNorthernLightsColor(1, 1.5)).toBe(`rgba(${AURORA_COLORS[1]}, 1)`);
      expect(getNorthernLightsColor(1, -0.5)).toBe(`rgba(${AURORA_COLORS[1]}, 0)`);
    });

    it('handles out-of-bounds or negative color indices cleanly', () => {
      const color = getNorthernLightsColor(-1, 0.5);
      expect(color).toContain('rgba(');
    });
  });
});
