import { describe, expect, it } from 'vitest';
import { calculateWaveY } from '../utils/aurora-math';

describe('aurora-math utility', () => {
  it('calculates deterministic wave Y coordinates based on sine formula', () => {
    const x = 100;
    const time = 0;
    const amplitude = 50;
    const frequency = 0.01;
    const speed = 0.02;
    const phase = 0;
    const baseLine = 200;

    const expected = Math.sin(100 * 0.01) * 50 + 200;
    const actual = calculateWaveY(x, time, amplitude, frequency, speed, phase, baseLine);

    expect(actual).toBeCloseTo(expected, 5);
  });

  it('oscillates around baseline with varying time', () => {
    const baseLine = 300;
    const amplitude = 40;

    const y1 = calculateWaveY(0, 0, amplitude, 0.01, 0.02, 0, baseLine);
    const y2 = calculateWaveY(0, 50, amplitude, 0.01, 0.02, 0, baseLine);

    expect(y1).toBe(baseLine); // sin(0) = 0
    expect(y2).not.toBe(baseLine);
    expect(Math.abs(y2 - baseLine)).toBeLessThanOrEqual(amplitude);
  });
});
