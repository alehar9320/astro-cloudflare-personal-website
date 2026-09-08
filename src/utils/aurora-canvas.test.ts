import { describe, expect, it } from 'vitest';
import {
  calculateParticleRefraction,
  calculateWaveOffset,
  clamp,
  interpolateColor,
} from './aurora-canvas';

describe('calculateWaveOffset', () => {
  it('computes deterministic wave offset values', () => {
    const offset = calculateWaveOffset(100, 0, 20, 0.01, 0);
    expect(typeof offset).toBe('number');
    expect(Number.isNaN(offset)).toBe(false);
  });

  it('scales displacement directly with amplitude', () => {
    const offset1 = calculateWaveOffset(50, 1, 10, 0.02, 0);
    const offset2 = calculateWaveOffset(50, 1, 20, 0.02, 0);
    expect(offset2).toBeCloseTo(offset1 * 2, 5);
  });
});

describe('clamp', () => {
  it('clamps values below minimum boundary to min', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('clamps values above maximum boundary to max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('returns unchanged values within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });
});

describe('interpolateColor', () => {
  const marineBlue: [number, number, number] = [10, 25, 47];
  const cyan: [number, number, number] = [64, 224, 208];

  it('returns starting color at factor 0', () => {
    expect(interpolateColor(marineBlue, cyan, 0)).toBe('rgba(10, 25, 47, 1.00)');
  });

  it('returns ending color at factor 1', () => {
    expect(interpolateColor(marineBlue, cyan, 1)).toBe('rgba(64, 224, 208, 1.00)');
  });

  it('interpolates midpoint color correctly', () => {
    expect(interpolateColor(marineBlue, cyan, 0.5)).toBe('rgba(37, 125, 128, 1.00)');
  });

  it('respects custom opacity values', () => {
    expect(interpolateColor(marineBlue, cyan, 0.5, 0.75)).toBe('rgba(37, 125, 128, 0.75)');
  });

  it('clamps factor and alpha out-of-bounds gracefully', () => {
    expect(interpolateColor(marineBlue, cyan, -1, -0.5)).toBe('rgba(10, 25, 47, 0.00)');
    expect(interpolateColor(marineBlue, cyan, 2, 1.5)).toBe('rgba(64, 224, 208, 1.00)');
  });
});

describe('calculateParticleRefraction', () => {
  it('returns zero displacement when particle is beyond interaction radius', () => {
    const refraction = calculateParticleRefraction(100, 100, 300, 300, 50);
    expect(refraction).toEqual({ dx: 0, dy: 0, intensity: 0 });
  });

  it('returns displacement and positive intensity when within radius', () => {
    const refraction = calculateParticleRefraction(100, 100, 110, 100, 50);
    expect(refraction.dx).toBeLessThan(0); // Pushed away from focal point (110, 100)
    expect(refraction.dy).toBeCloseTo(0, 5);
    expect(refraction.intensity).toBeGreaterThan(0);
    expect(refraction.intensity).toBeLessThanOrEqual(1);
  });

  it('handles edge case when maxRadius is zero or negative', () => {
    expect(calculateParticleRefraction(100, 100, 105, 105, 0)).toEqual({
      dx: 0,
      dy: 0,
      intensity: 0,
    });
  });

  it('handles coincident particle and cursor positions without NaN', () => {
    const refraction = calculateParticleRefraction(100, 100, 100, 100, 50);
    expect(refraction).toEqual({ dx: 0, dy: 0, intensity: 0 });
  });
});
