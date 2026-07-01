import { describe, it, expect, vi } from 'vitest';
import { createAuroraWaves, calculateWaveY, drawAuroraWave } from '../utils/aurora-math';

describe('Aurora Math Utilities', () => {
  describe('createAuroraWaves', () => {
    it('should return an array of 3 waves', () => {
      const waves = createAuroraWaves(1000, 500);
      expect(waves).toHaveLength(3);
    });

    it('should set wave properties based on width and height', () => {
      const width = 1000;
      const height = 500;
      const waves = createAuroraWaves(width, height);

      expect(waves[0].y).toBe(height * 0.3);
      expect(waves[0].length).toBe(width * 0.8);
      expect(waves[1].y).toBe(height * 0.4);
      expect(waves[2].y).toBe(height * 0.35);
    });
  });

  describe('calculateWaveY', () => {
    const mockWave = {
      y: 100,
      length: 500,
      amplitude: 50,
      frequency: 0.1,
      phase: 0,
      color: 'blue',
      speed: 0.1,
      opacity: 0.5,
    };

    it('should calculate Y position correctly using sine waves', () => {
      const x = 10;
      const time = 0;
      // Y = wave.y + sin(x * freq + phase + time * speed) * amp + sin(x * freq * 0.5 + time * speed * 0.3) * (amp * 0.5)
      // Y = 100 + sin(10 * 0.1 + 0 + 0) * 50 + sin(10 * 0.05 + 0) * 25
      // Y = 100 + sin(1) * 50 + sin(0.5) * 25
      const expectedY = 100 + Math.sin(1) * 50 + Math.sin(0.5) * 25;

      expect(calculateWaveY(x, mockWave, time)).toBeCloseTo(expectedY);
    });

    it('should vary with time', () => {
      const x = 0;
      const y1 = calculateWaveY(x, mockWave, 0);
      const y2 = calculateWaveY(x, mockWave, 100);
      expect(y1).not.toBe(y2);
    });
  });

  describe('drawAuroraWave', () => {
    it('should call canvas context methods for drawing', () => {
      const ctx = {
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        fill: vi.fn(),
        createLinearGradient: vi.fn().mockReturnValue({
          addColorStop: vi.fn(),
        }),
        fillStyle: '',
        globalAlpha: 1.0,
      } as unknown as CanvasRenderingContext2D;

      const mockWave = {
        y: 100,
        length: 500,
        amplitude: 50,
        frequency: 0.1,
        phase: 0,
        color: 'blue',
        speed: 0.1,
        opacity: 0.5,
      };

      drawAuroraWave(ctx, mockWave, 500, 300, 100);

      expect(ctx.beginPath).toHaveBeenCalled();
      expect(ctx.moveTo).toHaveBeenCalled();
      expect(ctx.lineTo).toHaveBeenCalled();
      expect(ctx.createLinearGradient).toHaveBeenCalled();
      expect(ctx.fill).toHaveBeenCalled();
    });
  });
});
