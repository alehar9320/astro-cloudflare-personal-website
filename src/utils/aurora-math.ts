/**
 * Aurora Math & Physics Utilities for Pure HTML5 Canvas Rendering
 * Implements capped DPR, superposed wave harmonics, and RGB color interpolation.
 */

/**
 * Caps the device pixel ratio at 2.0 to avoid GPU memory overhead on high-DPI displays.
 * @param dpr - Raw window.devicePixelRatio
 * @returns Clamped DPR between 1.0 and 2.0
 */
export function clampDpr(dpr: number): number {
  if (!dpr || isNaN(dpr) || dpr <= 0) return 1;
  return Math.min(dpr, 2);
}

/**
 * Calculates wave height superposition using multiple sine harmonics.
 * @param x - Horizontal position coordinate
 * @param y - Vertical position coordinate
 * @param time - Animation timestamp in seconds
 * @param frequency - Wave spatial frequency
 * @param amplitude - Wave height scaling factor
 * @returns Combined wave elevation delta
 */
export function calculateWaveHeight(
  x: number,
  y: number,
  time: number,
  frequency: number,
  amplitude: number
): number {
  const h1 = Math.sin(x * frequency + time) * 0.5;
  const h2 = Math.sin(y * frequency * 0.8 + time * 1.3) * 0.3;
  const h3 = Math.sin((x + y) * frequency * 0.5 + time * 0.7) * 0.2;
  return (h1 + h2 + h3) * amplitude;
}

/**
 * Linearly interpolates between two RGB color tuples.
 * @param colorA - Starting [R, G, B] tuple
 * @param colorB - Ending [R, G, B] tuple
 * @param factor - Interpolation progress from 0.0 to 1.0
 * @returns Interpolated [R, G, B] tuple
 */
export function interpolateRgb(
  colorA: [number, number, number],
  colorB: [number, number, number],
  factor: number
): [number, number, number] {
  const t = Math.max(0, Math.min(1, factor));
  const r = Math.round(colorA[0] + (colorB[0] - colorA[0]) * t);
  const g = Math.round(colorA[1] + (colorB[1] - colorA[1]) * t);
  const b = Math.round(colorA[2] + (colorB[2] - colorA[2]) * t);
  return [r, g, b];
}

/**
 * Formats an RGB tuple and alpha value into a CSS rgba string.
 * @param rgb - [R, G, B] color tuple
 * @param alpha - Opacity from 0.0 to 1.0
 * @returns Valid CSS rgba string
 */
export function formatRgba(rgb: [number, number, number], alpha: number): string {
  const clampedAlpha = Math.max(0, Math.min(1, alpha));
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${clampedAlpha.toFixed(3)})`;
}
