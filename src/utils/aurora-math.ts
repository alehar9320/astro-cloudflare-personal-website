/**
 * Pure TypeScript math and color utilities for Northern Lights canvas wave animations.
 * Written for Prism 👩‍🚀 creative experiments.
 */

export interface WaveSpec {
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
}

/**
 * Calculates wave height superposition at position x and time t.
 */
export function calculateWaveHeight(x: number, time: number, waves: WaveSpec[]): number {
  let height = 0;
  for (let i = 0; i < waves.length; i++) {
    const w = waves[i];
    height += Math.sin(x * w.frequency + time * w.speed + w.phase) * w.amplitude;
  }
  return height;
}

/**
 * Clamps a number between a minimum and maximum boundary.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linearly interpolates between two RGB colors.
 */
export function interpolateRgb(
  colorA: [number, number, number],
  colorB: [number, number, number],
  factor: number
): [number, number, number] {
  const t = clamp(factor, 0, 1);
  return [
    Math.round(colorA[0] + (colorB[0] - colorA[0]) * t),
    Math.round(colorA[1] + (colorB[1] - colorA[1]) * t),
    Math.round(colorA[2] + (colorB[2] - colorA[2]) * t),
  ];
}

/**
 * Returns formatted RGBA string for Northern Lights aesthetic palette.
 */
export function formatRgba(color: [number, number, number], alpha: number): string {
  const a = clamp(alpha, 0, 1);
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${a.toFixed(2)})`;
}

/**
 * Default Northern Lights color stops: Marine Blue, Cyan, Emerald Tint.
 */
export const AURORA_COLORS: {
  marineBlue: [number, number, number];
  cyan: [number, number, number];
  emerald: [number, number, number];
} = {
  marineBlue: [10, 40, 80],
  cyan: [0, 210, 225],
  emerald: [20, 230, 160],
};
