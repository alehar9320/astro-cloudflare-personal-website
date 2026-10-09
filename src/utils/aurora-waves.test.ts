import { describe, expect, it } from 'vitest';
import {
  DEFAULT_AURORA_WAVES,
  calculateSpatialStep,
  calculateWavePoint,
  generateWavePathPoints,
} from './aurora-waves';

describe('aurora-waves utility', () => {
  it('calculates spatial step intervals dynamically based on width', () => {
    expect(calculateSpatialStep(0)).toBe(4);
    expect(calculateSpatialStep(-100)).toBe(4);
    expect(calculateSpatialStep(300)).toBe(4); // max(4, Math.floor(300/120)) = 4
    expect(calculateSpatialStep(1200)).toBe(10); // max(4, Math.floor(1200/120)) = 10
    expect(calculateSpatialStep(1920)).toBe(16);
  });

  it('provides valid default Northern Lights wave configurations', () => {
    expect(DEFAULT_AURORA_WAVES.length).toBeGreaterThanOrEqual(3);
    for (const wave of DEFAULT_AURORA_WAVES) {
      expect(wave.frequency).toBeGreaterThan(0);
      expect(wave.amplitude).toBeGreaterThan(0);
      expect(wave.speed).toBeGreaterThan(0);
      expect(wave.baseHeightRatio).toBeGreaterThan(0);
      expect(wave.baseHeightRatio).toBeLessThan(1);
      expect(wave.color).toMatch(/^rgba\(/);
    }
  });

  it('calculates deterministic wave point coordinates', () => {
    const config = DEFAULT_AURORA_WAVES[0];
    const height = 400;
    const y1 = calculateWavePoint(100, 1000, config, height);
    const y2 = calculateWavePoint(100, 1000, config, height);

    expect(y1).toBe(y2);
    expect(typeof y1).toBe('number');
    expect(Number.isNaN(y1)).toBe(false);
  });

  it('adjusts wave point coordinate when cursor is in proximity', () => {
    const config = DEFAULT_AURORA_WAVES[0];
    const height = 400;
    const x = 100;
    const time = 1000;

    const basePoint = calculateWavePoint(x, time, config, height);
    const perturbedPoint = calculateWavePoint(x, time, config, height, 100, 300);

    expect(basePoint).not.toBe(perturbedPoint);
  });

  it('generates array of wave path points across canvas width', () => {
    const config = DEFAULT_AURORA_WAVES[0];
    const width = 800;
    const height = 400;
    const points = generateWavePathPoints(width, height, 0, config);

    expect(points.length).toBeGreaterThan(0);
    expect(points[0].x).toBe(0);
    expect(points[points.length - 1].x).toBe(width);

    for (const pt of points) {
      expect(pt.x).toBeGreaterThanOrEqual(0);
      expect(pt.x).toBeLessThanOrEqual(width);
      expect(typeof pt.y).toBe('number');
      expect(Number.isNaN(pt.y)).toBe(false);
    }
  });
});
