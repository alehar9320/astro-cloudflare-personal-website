/**
 * Optimized mathematical utilities for creative coding and generative art.
 * Part of the Prism interactive suite.
 */

/**
 * Generates a smooth, multi-layered sine wave value.
 * Useful for simulating organic movement like aurora curtains or water ripples.
 *
 * @param x - The input coordinate (e.g., time or position)
 * @param layers - Number of sine wave layers to stack
 * @param persistence - How much each successive layer contributes to the total
 * @returns A value typically between -1 and 1
 */
export function layeredSine(x: number, layers: number = 4, persistence: number = 0.5): number {
  let total = 0;
  let frequency = 1;
  let amplitude = 1;
  let maxValue = 0;

  for (let i = 0; i < layers; i++) {
    total += Math.sin(x * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }

  return total / maxValue;
}

/**
 * Maps a value from one range to another.
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Linear interpolation between two values.
 */
export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}
