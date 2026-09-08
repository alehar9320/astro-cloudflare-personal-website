/**
 * Pure TypeScript math utilities for generative wave physics and light refraction.
 * Designed for 60fps HTML5 Canvas animations in the Northern Lights aesthetic.
 */

/**
 * Calculates a smooth sine-wave harmonic offset at a given position and time.
 *
 * @param x - Horizontal coordinate across the canvas
 * @param time - Elapsed animation time in seconds
 * @param amplitude - Wave peak amplitude in pixels
 * @param frequency - Wave spatial frequency multiplier
 * @param phase - Initial phase offset in radians
 * @returns Vertical displacement offset in pixels
 */
export function calculateWaveOffset(
  x: number,
  time: number,
  amplitude: number,
  frequency: number,
  phase: number
): number {
  const primaryWave = Math.sin(x * frequency + time + phase);
  const secondaryHarmonic = Math.sin(x * frequency * 2.3 + time * 1.5 + phase) * 0.35;
  return (primaryWave + secondaryHarmonic) * amplitude;
}

/**
 * Restricts a numeric value to a specified inclusive range.
 *
 * @param val - The numeric input value
 * @param min - Lower boundary limit
 * @param max - Upper boundary limit
 * @returns Clamped numeric value
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Interpolates between two RGB color tuples and returns an `rgba(...)` string.
 *
 * @param colorA - Starting RGB color array tuple [R, G, B]
 * @param colorB - Ending RGB color array tuple [R, G, B]
 * @param factor - Normalized transition factor between 0.0 and 1.0
 * @param alpha - Opacity value between 0.0 and 1.0
 * @returns Formatted CSS rgba color string
 */
export function interpolateColor(
  colorA: [number, number, number],
  colorB: [number, number, number],
  factor: number,
  alpha = 1
): string {
  const clampedFactor = clamp(factor, 0, 1);
  const clampedAlpha = clamp(alpha, 0, 1);

  const r = Math.round(colorA[0] + (colorB[0] - colorA[0]) * clampedFactor);
  const g = Math.round(colorA[1] + (colorB[1] - colorA[1]) * clampedFactor);
  const b = Math.round(colorA[2] + (colorB[2] - colorA[2]) * clampedFactor);

  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha.toFixed(2)})`;
}

/**
 * Calculates particle displacement and intensity based on proximity to an interactive focal point (e.g. cursor or touch position).
 *
 * @param px - Particle X coordinate
 * @param py - Particle Y coordinate
 * @param mx - Focal X coordinate
 * @param my - Focal Y coordinate
 * @param maxRadius - Maximum interaction radius in pixels
 * @returns Displacement offsets and normalized refraction intensity
 */
export function calculateParticleRefraction(
  px: number,
  py: number,
  mx: number,
  my: number,
  maxRadius: number
): { dx: number; dy: number; intensity: number } {
  if (maxRadius <= 0) {
    return { dx: 0, dy: 0, intensity: 0 };
  }

  const diffX = px - mx;
  const diffY = py - my;
  const distanceSq = diffX * diffX + diffY * diffY;
  const maxRadiusSq = maxRadius * maxRadius;

  if (distanceSq >= maxRadiusSq || distanceSq === 0) {
    return { dx: 0, dy: 0, intensity: 0 };
  }

  const distance = Math.sqrt(distanceSq);
  const normalizedDist = 1 - distance / maxRadius;
  const intensity = normalizedDist * normalizedDist; // Exponential ease-out

  const force = intensity * 18;
  const dx = (diffX / distance) * force;
  const dy = (diffY / distance) * force;

  return { dx, dy, intensity };
}
