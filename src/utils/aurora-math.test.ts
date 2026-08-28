import { describe, expect, it } from 'vitest';
import { applyMagnetosphereDisplacement, calculateWaveY, clamp } from './aurora-math';

describe('aurora-math utility', () => {
  it('clamps values within min and max boundaries', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('calculates multi-harmonic sine wave Y coordinates', () => {
    const config = { amplitude: 20, frequency: 0.01, speed: 0.05, harmonic: 2 };
    const baseY = 100;

    const y0 = calculateWaveY(0, 0, baseY, config);
    expect(y0).toBeCloseTo(100, 2);

    const y1 = calculateWaveY(50, 10, baseY, config);
    expect(typeof y1).toBe('number');
    expect(Number.isNaN(y1)).toBe(false);
  });

  it('applies magnetosphere displacement when within radius', () => {
    const point = { x: 100, y: 100 };
    const pointer = { x: 120, y: 100 };
    const radius = 100;
    const maxDisplacement = 20;

    const displaced = applyMagnetosphereDisplacement(point, pointer, radius, maxDisplacement);

    expect(displaced.x).toBeLessThan(point.x);
    expect(displaced.y).toBeCloseTo(point.y, 2);
  });

  it('returns original point when outside magnetosphere radius', () => {
    const point = { x: 100, y: 100 };
    const pointer = { x: 500, y: 500 };

    const displaced = applyMagnetosphereDisplacement(point, pointer, 100, 20);

    expect(displaced.x).toBe(100);
    expect(displaced.y).toBe(100);
  });
});
