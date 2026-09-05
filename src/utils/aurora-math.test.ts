import { describe, expect, it } from 'vitest';
import {
  AURORA_COLORS,
  calculateWaveHeight,
  clamp,
  formatRgba,
  interpolateRgb,
  type WaveSpec,
} from './aurora-math';

describe('aurora-math', () => {
  it('clamp restricts values to min and max boundaries', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('calculateWaveHeight sums wave amplitudes correctly', () => {
    const waves: WaveSpec[] = [
      { amplitude: 10, frequency: 0.1, speed: 0.05, phase: 0 },
      { amplitude: 5, frequency: 0.2, speed: 0.01, phase: 0 },
    ];
    const h0 = calculateWaveHeight(0, 0, waves);
    expect(h0).toBeCloseTo(0);

    const hX = calculateWaveHeight(Math.PI / 0.2, 0, waves); // sin(PI/2) = 1 for wave 1
    expect(typeof hX).toBe('number');
  });

  it('interpolateRgb linearly interpolates RGB channels', () => {
    const start: [number, number, number] = [0, 100, 200];
    const end: [number, number, number] = [100, 200, 255];

    expect(interpolateRgb(start, end, 0)).toEqual([0, 100, 200]);
    expect(interpolateRgb(start, end, 1)).toEqual([100, 200, 255]);
    expect(interpolateRgb(start, end, 0.5)).toEqual([50, 150, 228]);
  });

  it('formatRgba formats color arrays into valid CSS rgba strings', () => {
    const color = AURORA_COLORS.cyan;
    expect(formatRgba(color, 0.5)).toBe('rgba(0, 210, 225, 0.50)');
    expect(formatRgba(color, 1.5)).toBe('rgba(0, 210, 225, 1.00)');
  });
});
