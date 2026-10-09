/**
 * Pure TypeScript math utilities for Northern Lights Aurora canvas rendering.
 * Uses dynamic spatial step sampling to ensure 60fps frame rates and zero GC thrashing.
 */

export interface WaveConfig {
  frequency: number;
  amplitude: number;
  speed: number;
  baseHeightRatio: number;
  color: string;
}

export const DEFAULT_AURORA_WAVES: WaveConfig[] = [
  {
    frequency: 0.006,
    amplitude: 45,
    speed: 0.0015,
    baseHeightRatio: 0.45,
    color: 'rgba(0, 220, 255, 0.25)', // Cyan glow
  },
  {
    frequency: 0.004,
    amplitude: 60,
    speed: 0.001,
    baseHeightRatio: 0.55,
    color: 'rgba(0, 140, 240, 0.2)', // Marine blue
  },
  {
    frequency: 0.008,
    amplitude: 35,
    speed: 0.002,
    baseHeightRatio: 0.35,
    color: 'rgba(50, 255, 200, 0.18)', // Emerald cyan accent
  },
];

/**
 * Calculates dynamic spatial step interval based on canvas width.
 * Prevents per-pixel evaluation for 60fps performance across desktop and mobile.
 */
export function calculateSpatialStep(width: number): number {
  if (width <= 0) return 4;
  return Math.max(4, Math.floor(width / 120));
}

/**
 * Calculates y-coordinate for a specific x point using sine wave superposition and optional cursor interaction.
 */
export function calculateWavePoint(
  x: number,
  time: number,
  config: WaveConfig,
  height: number,
  cursorX?: number,
  cursorY?: number
): number {
  const baseY = height * config.baseHeightRatio;
  const phase = time * config.speed;

  // Primary wave + secondary harmonic
  let y =
    baseY +
    Math.sin(x * config.frequency + phase) * config.amplitude +
    Math.sin(x * config.frequency * 1.5 + phase * 0.8) * (config.amplitude * 0.35);

  // Optional cursor proximity perturbation
  if (cursorX !== undefined && cursorY !== undefined) {
    const dx = x - cursorX;
    const distanceSq = dx * dx;
    const influenceRadiusSq = 180 * 180;

    if (distanceSq < influenceRadiusSq) {
      const factor = 1 - Math.sqrt(distanceSq) / 180;
      const pull = (cursorY - baseY) * 0.15;
      y += pull * factor;
    }
  }

  return y;
}

/**
 * Generates array of (x, y) coordinates for rendering a wave across canvas width.
 */
export function generateWavePathPoints(
  width: number,
  height: number,
  time: number,
  config: WaveConfig,
  cursor?: { x: number; y: number }
): Array<{ x: number; y: number }> {
  const step = calculateSpatialStep(width);
  const points: Array<{ x: number; y: number }> = [];

  for (let x = 0; x <= width + step; x += step) {
    const actualX = Math.min(x, width);
    const y = calculateWavePoint(actualX, time, config, height, cursor?.x, cursor?.y);
    points.push({ x: actualX, y });
  }

  return points;
}
