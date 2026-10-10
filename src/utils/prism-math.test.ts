import { describe, expect, it } from 'vitest';
import {
  calculateRefractionWave,
  clampVectorDistance,
  interpolateNorthernLightsColor,
} from './prism-math';

describe('prism-math utilities', () => {
  describe('calculateRefractionWave', () => {
    it('returns normalized values between -1 and 1 without pointer interaction', () => {
      const value = calculateRefractionWave(100, 100, 1.5, null);
      expect(value).toBeGreaterThanOrEqual(-1);
      expect(value).toBeLessThanOrEqual(1);
    });

    it('calculates refraction wave with pointer interaction within radius', () => {
      const valueNoPointer = calculateRefractionWave(100, 100, 1.0, null);
      const valueWithPointer = calculateRefractionWave(100, 100, 1.0, { x: 105, y: 105 });
      expect(valueWithPointer).toBeGreaterThanOrEqual(-1);
      expect(valueWithPointer).toBeLessThanOrEqual(1);
      expect(valueWithPointer).not.toBe(valueNoPointer);
    });

    it('ignores pointer interaction outside max radius', () => {
      const valueNoPointer = calculateRefractionWave(0, 0, 1.0, null);
      const valueFarPointer = calculateRefractionWave(0, 0, 1.0, { x: 1000, y: 1000 });
      expect(valueFarPointer).toBeCloseTo(valueNoPointer, 5);
    });
  });

  describe('clampVectorDistance', () => {
    it('calculates vector offsets and distance correctly', () => {
      const p1 = { x: 0, y: 0 };
      const p2 = { x: 30, y: 40 };
      const result = clampVectorDistance(p1, p2, 100);

      expect(result.dx).toBe(30);
      expect(result.dy).toBe(40);
      expect(result.distance).toBe(50);
      expect(result.clampedDistance).toBe(50);
    });

    it('clamps distance if it exceeds max radius', () => {
      const p1 = { x: 0, y: 0 };
      const p2 = { x: 30, y: 40 };
      const result = clampVectorDistance(p1, p2, 25);

      expect(result.distance).toBe(50);
      expect(result.clampedDistance).toBe(25);
    });
  });

  describe('interpolateNorthernLightsColor', () => {
    it('returns deep marine blue for t = 0', () => {
      const color = interpolateNorthernLightsColor(0);
      expect(color).toEqual({ r: 0, g: 43, b: 73 });
    });

    it('returns cyan glow for t = 0.5', () => {
      const color = interpolateNorthernLightsColor(0.5);
      expect(color).toEqual({ r: 0, g: 210, b: 255 });
    });

    it('returns aurora green for t = 1.0', () => {
      const color = interpolateNorthernLightsColor(1.0);
      expect(color).toEqual({ r: 0, g: 255, b: 179 });
    });

    it('clamps t values out of range', () => {
      const minColor = interpolateNorthernLightsColor(-0.5);
      const maxColor = interpolateNorthernLightsColor(1.5);

      expect(minColor).toEqual({ r: 0, g: 43, b: 73 });
      expect(maxColor).toEqual({ r: 0, g: 255, b: 179 });
    });
  });
});
