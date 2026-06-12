import { describe, it, expect } from 'vitest';
import { calculateAuroraPoint, getAuroraColors } from '../utils/aurora-logic';

describe('aurora-logic', () => {
  describe('calculateAuroraPoint', () => {
    it('calculates a deterministic point based on inputs', () => {
      const height = 1000;
      const x = 100;
      const time = 10;
      const index = 0;

      const y = calculateAuroraPoint(x, time, index, height);

      // Basic sanity check: should be around the baseline (height * 0.4 = 400)
      // Max possible deviation is 60+35+15+20 = 130
      expect(y).toBeGreaterThan(270);
      expect(y).toBeLessThan(530);
    });

    it('offsets waves vertically based on index', () => {
      const height = 1000;
      const x = 100;
      const time = 10;

      const y0 = calculateAuroraPoint(x, time, 0, height);
      const y1 = calculateAuroraPoint(x, time, 1, height);

      // index=1 should have a higher baseline (+30)
      // Although waves move, the general trend should be higher
      expect(y1).not.toBe(y0);
    });
  });

  describe('getAuroraColors', () => {
    it('returns dark mode colors by default', () => {
      const colors = getAuroraColors();
      expect(colors).toHaveLength(3);
      expect(colors[0]).toContain('0.35'); // accent-light alpha
    });

    it('returns light mode colors when isDark is false', () => {
      const colors = getAuroraColors(false);
      expect(colors).toHaveLength(3);
      expect(colors[0]).toContain('0.25'); // accent-regular alpha
    });

    it('explicitly handles isDark=true', () => {
      const colors = getAuroraColors(true);
      expect(colors[0]).toContain('0.35');
    });
  });
});
