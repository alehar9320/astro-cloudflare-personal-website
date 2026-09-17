import { describe, expect, it } from 'vitest';
import {
  calculateWaveY,
  getCappedDpr,
  getDefaultAuroraWaveConfigs,
  type WaveConfig,
} from './aurora-waves';

describe('aurora-waves utility', () => {
  it('getCappedDpr caps devicePixelRatio at 2 and ensures minimum of 1', () => {
    expect(getCappedDpr(1)).toBe(1);
    expect(getCappedDpr(1.5)).toBe(1.5);
    expect(getCappedDpr(3)).toBe(2);
    expect(getCappedDpr(0)).toBe(1);
  });

  it('getDefaultAuroraWaveConfigs returns expected wave configurations', () => {
    const configs = getDefaultAuroraWaveConfigs();
    expect(configs).toHaveLength(3);
    expect(configs[0]).toHaveProperty('amplitude');
    expect(configs[0]).toHaveProperty('color');
  });

  it('calculateWaveY computes deterministic sine wave positions without mouse interaction', () => {
    const config: WaveConfig = {
      amplitude: 20,
      frequency: 0.01,
      speed: 1,
      color: '#ffffff',
      lineWidth: 2,
    };
    const baseY = 100;
    const inactiveMouse = { x: 0, y: 0, active: false };

    const y1 = calculateWaveY(10, 0, config, baseY, inactiveMouse);
    const y2 = calculateWaveY(10, 1, config, baseY, inactiveMouse);

    expect(typeof y1).toBe('number');
    expect(typeof y2).toBe('number');
    expect(y1).not.toBe(y2);
  });

  it('calculateWaveY applies mouse distortion when mouse is active and within radius', () => {
    const config: WaveConfig = {
      amplitude: 20,
      frequency: 0.01,
      speed: 1,
      color: '#ffffff',
      lineWidth: 2,
    };
    const baseY = 100;

    const yInactive = calculateWaveY(100, 0, config, baseY, { x: 100, y: 150, active: false });
    const yActive = calculateWaveY(100, 0, config, baseY, { x: 100, y: 150, active: true });

    expect(yActive).not.toBe(yInactive);
  });
});
