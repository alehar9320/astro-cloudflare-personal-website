import { describe, expect, it } from 'vitest';
import {
  calculateAuroraWaveHeight,
  calculateRefractionOffset,
  getAdaptiveCanvasQuality,
  interpolateAuroraColor,
} from '../aurora-math';

describe('aurora-math utilities', () => {
  describe('calculateAuroraWaveHeight', () => {
    it('returns consistent wave heights for identical inputs', () => {
      const params = { frequency: 0.01, amplitude: 50, speed: 0.05, phase: 0 };
      const height1 = calculateAuroraWaveHeight(100, 10, params);
      const height2 = calculateAuroraWaveHeight(100, 10, params);
      expect(height1).toEqual(height2);
    });

    it('varies displacement based on time t', () => {
      const params = { frequency: 0.01, amplitude: 50, speed: 0.05, phase: 0 };
      const heightAtT0 = calculateAuroraWaveHeight(100, 0, params);
      const heightAtT100 = calculateAuroraWaveHeight(100, 100, params);
      expect(heightAtT0).not.toEqual(heightAtT100);
    });

    it('handles harmonic complexity configurations', () => {
      const params1 = { frequency: 0.01, amplitude: 50, speed: 0.05, phase: 0, harmonics: 1 };
      const params3 = { frequency: 0.01, amplitude: 50, speed: 0.05, phase: 0, harmonics: 3 };

      const height1 = calculateAuroraWaveHeight(100, 10, params1);
      const height3 = calculateAuroraWaveHeight(100, 10, params3);
      expect(height1).not.toEqual(height3);
    });
  });

  describe('calculateRefractionOffset', () => {
    it('returns zero refraction offset when pointer is null', () => {
      const wavePoint = { x: 100, y: 100 };
      const refraction = calculateRefractionOffset(null, wavePoint);
      expect(refraction.dx).toBe(0);
      expect(refraction.dy).toBe(0);
      expect(refraction.intensity).toBe(0);
      expect(refraction.distance).toBe(Infinity);
    });

    it('returns zero refraction offset when wave point is outside maxRadius', () => {
      const pointer = { x: 0, y: 0 };
      const wavePoint = { x: 500, y: 500 };
      const refraction = calculateRefractionOffset(pointer, wavePoint, 200, 30);
      expect(refraction.dx).toBe(0);
      expect(refraction.dy).toBe(0);
      expect(refraction.intensity).toBe(0);
    });

    it('calculates refraction vector pointing away from pointer when within radius', () => {
      const pointer = { x: 100, y: 100 };
      const wavePoint = { x: 120, y: 100 }; // 20 units right of pointer
      const refraction = calculateRefractionOffset(pointer, wavePoint, 200, 30);

      expect(refraction.dx).toBeGreaterThan(0);
      expect(refraction.dy).toBeCloseTo(0, 5);
      expect(refraction.intensity).toBeGreaterThan(0);
      expect(refraction.distance).toBe(20);
    });
  });

  describe('interpolateAuroraColor', () => {
    it('returns valid rgba string with marine blue at factor 0.0', () => {
      const color = interpolateAuroraColor(0.0, 0.8);
      expect(color).toMatch(/^rgba\(10,\s*32,\s*64,\s*0\.80?\)$/);
    });

    it('returns cyan rgba string at mid factor 0.5', () => {
      const color = interpolateAuroraColor(0.5, 0.5);
      expect(color).toMatch(/^rgba\(0,\s*180,\s*200,\s*0\.50?\)$/);
    });

    it('returns emerald teal rgba string at upper factor 1.0', () => {
      const color = interpolateAuroraColor(1.0, 0.9);
      expect(color).toMatch(/^rgba\(40,\s*230,\s*180,\s*0\.90?\)$/);
    });

    it('clamps factors below 0 and above 1 safely', () => {
      const colorMin = interpolateAuroraColor(-0.5, 1);
      const colorMax = interpolateAuroraColor(1.5, 1);
      expect(colorMin).toEqual(interpolateAuroraColor(0, 1));
      expect(colorMax).toEqual(interpolateAuroraColor(1, 1));
    });
  });

  describe('getAdaptiveCanvasQuality', () => {
    it('configures desktop high-performance settings for wide viewport at 60fps', () => {
      const config = getAdaptiveCanvasQuality(1280, 60, 2);
      expect(config.pixelRatio).toBe(2);
      expect(config.layerCount).toBe(4);
      expect(config.stepSize).toBe(4);
    });

    it('scales down layer count and pixel ratio for mobile viewports', () => {
      const config = getAdaptiveCanvasQuality(375, 60, 3);
      expect(config.pixelRatio).toBe(1.25);
      expect(config.layerCount).toBe(2);
      expect(config.stepSize).toBe(8);
    });

    it('scales down quality for low FPS environments', () => {
      const config = getAdaptiveCanvasQuality(1024, 25, 2);
      expect(config.pixelRatio).toBe(1.0);
      expect(config.layerCount).toBe(2);
      expect(config.stepSize).toBe(10);
    });
  });
});
