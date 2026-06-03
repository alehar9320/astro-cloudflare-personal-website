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
      vi.fn((cb) => {
        if (typeof cb === 'function') {
          // Immediately call the loop callback to test its internal logic
          // but wrap it to avoid infinite recursion in tests
          return 123;
        }
        return 123;
      })
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  it('should initialize correctly', () => {
    new AuroraEffect({
      canvas: mockCanvas,
      colors: ['#00d2ff', '#0066cc'],
    });

    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d', { alpha: true });
    expect(mockCanvas.width).toBe(800);
    expect(mockCanvas.height).toBe(600);
  });

  it('should throw if context is missing', () => {
    vi.mocked(mockCanvas.getContext).mockReturnValue(null);
    expect(() => {
      new AuroraEffect({
        canvas: mockCanvas,
        colors: ['#00d2ff', '#0066cc'],
      });
    }).toThrow('Could not get canvas context');
  });

  it('should start and stop the animation loop', () => {
    const effect = new AuroraEffect({
      canvas: mockCanvas,
      colors: ['#00d2ff', '#0066cc'],
    });

    effect.start();
    expect(window.requestAnimationFrame).toHaveBeenCalled();

    // Test guard: start again should return early
    effect.start();
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);

    effect.stop();
    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(123);

    // Test guard: stop when already stopped
    effect.stop();
    expect(window.cancelAnimationFrame).toHaveBeenCalledTimes(1);
  });

  it('should update and draw when running', () => {
    const effect = new AuroraEffect({
      canvas: mockCanvas,
      colors: ['#00d2ff', '#0066cc'],
    });

    // @ts-expect-error - testing private methods
    effect.update();
    // @ts-expect-error - testing private methods
    effect.draw();

    expect(mockContext.clearRect).toHaveBeenCalled();
    expect(mockContext.stroke).toHaveBeenCalled();
  });

  it('should respect pause state in the loop', () => {
    const effect = new AuroraEffect({
      canvas: mockCanvas,
      colors: ['#00d2ff', '#0066cc'],
    });

    effect.setPaused(true);

    // We need to manually execute the loop to test the branch
    let loopFn: Function | undefined;
    vi.mocked(window.requestAnimationFrame).mockImplementation((cb) => {
      loopFn = cb;
      return 123;
    });

    effect.start();
    expect(loopFn).toBeDefined();

    // Mock update and draw to see if they are called
    // @ts-expect-error - testing private methods
    const updateSpy = vi.spyOn(effect, 'update');
    // @ts-expect-error - testing private methods
    const drawSpy = vi.spyOn(effect, 'draw');

    if (loopFn) loopFn();

    expect(updateSpy).not.toHaveBeenCalled();
    expect(drawSpy).not.toHaveBeenCalled();

    effect.setPaused(false);
    if (loopFn) loopFn();

    expect(updateSpy).toHaveBeenCalled();
    expect(drawSpy).toHaveBeenCalled();
  });

  it('should handle resize', () => {
    const effect = new AuroraEffect({
      canvas: mockCanvas,
      colors: ['#00d2ff', '#0066cc'],
    });

    // @ts-expect-error - mocking parentElement
    mockCanvas.parentElement.clientWidth = 1024;
    effect.resize();
    expect(mockCanvas.width).toBe(1024);
  });

  it('should not draw AuroraWave if points are insufficient', () => {
    const effect = new AuroraEffect({
      canvas: mockCanvas,
      colors: ['#00d2ff', '#0066cc'],
    });

    // @ts-expect-error - accessing private waves
    const wave = effect.waves[0];
    // @ts-expect-error - clearing points
    wave.points = [];

    // @ts-expect-error - calling private draw
    effect.draw();
    expect(mockContext.beginPath).not.toHaveBeenCalled();
  });
});
