/**
 * Aurora Math & Physics Utilities for Interactive Canvases
 * Pure TypeScript functions with zero external dependencies.
 */

/**
 * Caps the device pixel ratio (DPR) to prevent excessive GPU memory consumption
 * and performance degradation on high-DPI displays (e.g., Retina displays).
 *
 * @param dpr - Raw window devicePixelRatio.
 * @param maxDpr - Maximum allowed DPR (default: 2).
 * @returns Clamped DPR value.
 */
export function clampDpr(dpr: number, maxDpr = 2): number {
  if (isNaN(dpr) || dpr <= 0) return 1;
  return Math.min(dpr, maxDpr);
}

/**
 * Calculates a trigonometric harmonic sine wave offset for fluid fluid motion.
 *
 * @param x - Horizontal spatial coordinate.
 * @param time - Current time in seconds or ticks.
 * @param frequency - Spatial wave frequency.
 * @param amplitude - Wave height/amplitude in pixels.
 * @param phase - Phase shift offset (default: 0).
 * @returns Vertical displacement amount.
 */
export function harmonicWave(
  x: number,
  time: number,
  frequency: number,
  amplitude: number,
  phase = 0
): number {
  return (
    Math.sin(x * frequency + time + phase) * amplitude +
    Math.sin(x * frequency * 0.5 - time * 0.7) * (amplitude * 0.35)
  );
}

/**
 * Calculates interactive light refraction offset relative to cursor/touch input coordinates.
 * Employs smooth Gaussian-like radial attenuation to displace points outward from the pointer.
 *
 * @param px - Point X coordinate.
 * @param py - Point Y coordinate.
 * @param cx - Pointer center X coordinate.
 * @param cy - Pointer center Y coordinate.
 * @param radius - Maximum interaction radius in pixels (default: 150).
 * @param strength - Maximum displacement strength in pixels (default: 30).
 * @returns Radial refraction offset object `{ dx, dy }`.
 */
export function calculateRefractionOffset(
  px: number,
  py: number,
  cx: number,
  cy: number,
  radius = 150,
  strength = 30
): { dx: number; dy: number } {
  const diffX = px - cx;
  const diffY = py - cy;
  const distSq = diffX * diffX + diffY * diffY;
  const radiusSq = radius * radius;

  if (distSq >= radiusSq || distSq === 0) {
    return { dx: 0, dy: 0 };
  }

  const dist = Math.sqrt(distSq);
  // Smooth cosine-based falloff from center (1.0 at center, 0.0 at radius edge)
  const factor = (1 + Math.cos((dist / radius) * Math.PI)) * 0.5 * strength;
  const normalX = diffX / dist;
  const normalY = diffY / dist;

  return {
    dx: normalX * factor,
    dy: normalY * factor,
  };
}
