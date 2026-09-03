import { describe, expect, it } from 'vitest';
import {
  calculateAuroraWave,
  createAuroraParticles,
  getAuroraColor,
  updateParticle,
  type Particle,
} from './aurora-math';

describe('aurora-math utility', () => {
  describe('calculateAuroraWave', () => {
    it('returns a numeric wave offset for given coordinates', () => {
      const wave = calculateAuroraWave(100, 800, 1.5, 0);
      expect(typeof wave).toBe('number');
      expect(Number.isNaN(wave)).toBe(false);
    });

    it('handles width 0 gracefully without division by zero errors', () => {
      const wave = calculateAuroraWave(50, 0, 1.0);
      expect(typeof wave).toBe('number');
      expect(Number.isFinite(wave)).toBe(true);
    });

    it('produces deterministic output for fixed parameters', () => {
      const wave1 = calculateAuroraWave(200, 1000, 2.5, 0.5);
      const wave2 = calculateAuroraWave(200, 1000, 2.5, 0.5);
      expect(wave1).toBe(wave2);
    });
  });

  describe('updateParticle', () => {
    it('updates particle position based on velocity', () => {
      const particle: Particle = {
        x: 100,
        y: 100,
        vx: 2,
        vy: -1,
        radius: 2,
        alpha: 0.8,
        hue: 180,
        baseAlpha: 0.8,
      };

      updateParticle(particle, 800, 600, null);

      expect(particle.x).toBeCloseTo(102);
      expect(particle.y).toBeCloseTo(99);
      // Damping velocity applied
      expect(particle.vx).toBeCloseTo(1.96);
      expect(particle.vy).toBeCloseTo(-0.98);
    });

    it('repels particle when mouse is nearby and active', () => {
      const particle: Particle = {
        x: 100,
        y: 100,
        vx: 0,
        vy: 0,
        radius: 2,
        alpha: 0.8,
        hue: 180,
        baseAlpha: 0.8,
      };

      // Mouse close to particle (at 110, 100)
      updateParticle(particle, 800, 600, { x: 110, y: 100, active: true });

      // Should push particle away (vx should become negative)
      expect(particle.vx).toBeLessThan(0);
    });

    it('wraps particles across boundary limits', () => {
      const particle: Particle = {
        x: -15,
        y: 615,
        vx: -1,
        vy: 1,
        radius: 2,
        alpha: 0.5,
        hue: 180,
        baseAlpha: 0.5,
      };

      updateParticle(particle, 800, 600, null);

      expect(particle.x).toBe(810);
      expect(particle.y).toBe(-10);
    });
  });

  describe('createAuroraParticles', () => {
    it('generates the specified count of particles with valid properties', () => {
      const particles = createAuroraParticles(25, 800, 600);
      expect(particles).toHaveLength(25);

      particles.forEach((p) => {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x).toBeLessThanOrEqual(800);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeLessThanOrEqual(600);
        expect(p.radius).toBeGreaterThan(0);
        expect(p.hue).toBeGreaterThanOrEqual(140);
        expect(p.hue).toBeLessThanOrEqual(270);
      });
    });
  });

  describe('getAuroraColor', () => {
    it('returns formatted HSLA color string for ratio', () => {
      const color = getAuroraColor(0.5, 0.8);
      expect(color).toMatch(/^hsla\(\d+,\s*85%,\s*60%,\s*0\.80\)$/);
    });

    it('clamps ratio below 0 and above 1', () => {
      const colorMin = getAuroraColor(-0.5, 1);
      const colorZero = getAuroraColor(0, 1);
      expect(colorMin).toBe(colorZero);

      const colorMax = getAuroraColor(1.5, 1);
      const colorOne = getAuroraColor(1, 1);
      expect(colorMax).toBe(colorOne);
    });
  });
});
