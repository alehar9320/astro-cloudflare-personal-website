/**
 * Pure TypeScript math and physics utilities for Northern Lights (Aurora) animations.
 * Provides harmonic wave superposition, smooth interpolations, and vector math.
 */

export interface Vector2D {
  x: number;
  y: number;
}

/**
 * Linearly interpolates between two numbers.
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * Math.max(0, Math.min(1, t));
}

/**
 * Calculates a multi-frequency harmonic wave displacement.
 * Combines fundamental wave with secondary harmonic frequencies for fluid motion.
 *
 * @param x Position coordinate
 * @param time Elapsed animation time in seconds
 * @param baseFrequency Base frequency factor
 * @param baseAmplitude Amplitude of the main wave
 */
export function calculateHarmonicWave(
  x: number,
  time: number,
  baseFrequency = 0.005,
  baseAmplitude = 30
): number {
  const primary = Math.sin(x * baseFrequency + time * 0.8) * baseAmplitude;
  const secondary = Math.sin(x * (baseFrequency * 2.3) - time * 1.2) * (baseAmplitude * 0.4);
  const tertiary = Math.cos(x * (baseFrequency * 0.7) + time * 0.4) * (baseAmplitude * 0.25);

  return primary + secondary + tertiary;
}

/**
 * Clamps device pixel ratio to avoid excessive memory and GPU overhead on High-DPI screens.
 */
export function clampDevicePixelRatio(dpr: number, maxDpr = 2): number {
  return Math.min(Math.max(1, dpr), maxDpr);
}
