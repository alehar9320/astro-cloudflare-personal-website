/**
 * Utility functions for Northern Lights interactive canvas refractions and dynamic step sampling.
 */

/**
 * Calculates dynamic spatial step sampling interval based on viewport width
 * to maintain high FPS and prevent garbage collection thrashing across mobile & desktop.
 */
export function calculateSpatialStep(viewportWidth: number): number {
  if (viewportWidth <= 0) return 4;
  return Math.max(4, Math.floor(viewportWidth / 120));
}

/**
 * Calculates cubic smoothstep attenuation factor (0.0 to 1.0) based on distance and interaction radius.
 * Formula: (1 - distance / radius)^2
 */
export function cubicSmoothstepFalloff(distance: number, radius: number): number {
  if (radius <= 0) return 0;
  if (distance >= radius) return 0;
  if (distance <= 0) return 1;
  const factor = 1 - distance / radius;
  return factor * factor;
}

/**
 * Calculates smooth sine wave displacement given x, time, frequency, and amplitude.
 */
export function calculateWaveHeight(
  x: number,
  time: number,
  frequency: number,
  amplitude: number
): number {
  return Math.sin(x * frequency + time) * amplitude;
}

/**
 * Calculates refraction vector displacement for a wave vertex relative to pointer position.
 */
export function calculateRefractionDisplacement(
  px: number,
  py: number,
  cx: number,
  cy: number,
  radius: number,
  maxOffset: number = 24
): { dx: number; dy: number } {
  const dist = Math.hypot(px - cx, py - cy);
  if (dist >= radius || dist <= 0) {
    return { dx: 0, dy: 0 };
  }
  const falloff = cubicSmoothstepFalloff(dist, radius);
  const angle = Math.atan2(py - cy, px - cx);
  return {
    dx: Math.cos(angle) * falloff * maxOffset,
    dy: Math.sin(angle) * falloff * maxOffset,
  };
}
