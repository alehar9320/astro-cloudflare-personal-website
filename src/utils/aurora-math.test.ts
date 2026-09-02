import { describe, expect, it } from 'vitest';
import {
  calculateAuroraWave,
  interpolateColor,
  superimposeWaves,
  updateParticle,
  type WaveConfig,
} from './aurora-math';

describe('aurora-math utilities', () => {
  it('calculates single sine wave height offset correctly', () => {
    const valAtZero = calculateAuroraWave(0, 0, 100, 50, 1, 0);
    expect(valAtZero).toBeCloseTo(0);

    const valAtQuarter = calculateAuroraWave(25, 0, 100, 50, 1, 0);
    expect(valAtQuarter).toBeCloseTo(50);
  });

  it('returns 0 if wavelength is zero or negative', () => {
    expect(calculateAuroraWave(10, 10, 0, 50, 1)).toBe(0);
    expect(calculateAuroraWave(10, 10, -5, 50, 1)).toBe(0);
  });

  it('superimposes multiple waves', () => {
    const waves: WaveConfig[] = [
      { wavelength: 100, amplitude: 20, speed: 1, phase: 0 },
      { wavelength: 50, amplitude: 10, speed: 1, phase: 0 },
    ];
    // At x=25, wave1=20*sin(pi/2)=20, wave2=10*sin(pi)=0 -> total 20
    const val = superimposeWaves(25, 0, waves);
    expect(val).toBeCloseTo(20);
  });

  it('interpolates RGB colors cleanly within bounds', () => {
    const cyan: [number, number, number] = [0, 255, 255];
    const marine: [number, number, number] = [10, 30, 60];

    expect(interpolateColor(cyan, marine, 0)).toEqual(cyan);
    expect(interpolateColor(cyan, marine, 1)).toEqual(marine);
    expect(interpolateColor(cyan, marine, 0.5)).toEqual([5, 143, 158]);
    expect(interpolateColor(cyan, marine, -1)).toEqual(cyan);
    expect(interpolateColor(cyan, marine, 2)).toEqual(marine);
  });

  it('updates particles and wraps bounds accurately', () => {
    const initial = { x: 99, y: 10, vx: 5, vy: -2, alpha: 0.8 };
    const bounds = { width: 100, height: 100 };

    const updated = updateParticle(initial, bounds);
    expect(updated.x).toBe(4); // 99+5 = 104 -> wrapped to 4
    expect(updated.y).toBe(8); // 10-2 = 8
  });

  it('handles negative movement and zero bounds fallback gracefully', () => {
    const initial = { x: 2, y: 1, vx: -5, vy: -3, alpha: 0.5 };
    const bounds = { width: 100, height: 100 };

    const updated = updateParticle(initial, bounds);
    expect(updated.x).toBe(97); // 2-5+100 = 97
    expect(updated.y).toBe(98); // 1-3+100 = 98

    const noBounds = updateParticle({ x: 10, y: 20, vx: 2, vy: 3, alpha: 1 }, { width: 0, height: 0 });
    expect(noBounds.x).toBe(12);
    expect(noBounds.y).toBe(23);
  });
});
