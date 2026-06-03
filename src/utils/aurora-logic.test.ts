import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuroraEffect } from './aurora-logic';

describe('AuroraEffect', () => {
  let mockCanvas: HTMLCanvasElement;
  let mockContext: CanvasRenderingContext2D;

  beforeEach(() => {
    mockContext = {
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
      stroke: vi.fn(),
      shadowBlur: 0,
      shadowColor: '',
      strokeStyle: '',
      lineWidth: 0,
      lineCap: '',
      lineJoin: '',
      globalAlpha: 1,
      globalCompositeOperation: '',
    } as unknown as CanvasRenderingContext2D;

    mockCanvas = {
      getContext: vi.fn(() => mockContext),
      parentElement: {
        clientWidth: 800,
        clientHeight: 600,
      },
      width: 0,
      height: 0,
    } as unknown as HTMLCanvasElement;

    // Mock requestAnimationFrame and cancelAnimationFrame on window
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn(() => 123)
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  it('should initialize correctly', () => {
    const effect = new AuroraEffect({
      canvas: mockCanvas,
      colors: ['#00d2ff', '#0066cc'],
    });

    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d', { alpha: true });
    expect(mockCanvas.width).toBe(800);
    expect(mockCanvas.height).toBe(600);
  });

  it('should start and stop the animation loop', () => {
    const effect = new AuroraEffect({
      canvas: mockCanvas,
      colors: ['#00d2ff', '#0066cc'],
    });

    effect.start();
    expect(window.requestAnimationFrame).toHaveBeenCalled();

    effect.stop();
    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(123);
  });

  it('should update and draw when running', () => {
    const effect = new AuroraEffect({
      canvas: mockCanvas,
      colors: ['#00d2ff', '#0066cc'],
    });

    (effect as any).update();
    (effect as any).draw();

    expect(mockContext.clearRect).toHaveBeenCalled();
    expect(mockContext.stroke).toHaveBeenCalled();
  });

  it('should respect pause state', () => {
    const effect = new AuroraEffect({
      canvas: mockCanvas,
      colors: ['#00d2ff', '#0066cc'],
    });

    effect.setPaused(true);
    (effect as any).update = vi.fn();
    (effect as any).draw = vi.fn();

    (effect as any).start();
  });

  it('should handle resize', () => {
    const effect = new AuroraEffect({
      canvas: mockCanvas,
      colors: ['#00d2ff', '#0066cc'],
    });

    (mockCanvas.parentElement as any).clientWidth = 1024;
    effect.resize();
    expect(mockCanvas.width).toBe(1024);
  });
});
