/**
 * Mathematical utilities for the Northern Lights interactive canvas rendering engine.
 * Pure TypeScript functions with zero runtime allocation overhead per frame.
 */

export interface Point2D {
  x: number;
  y: number;
}

/**
 * Calculates a multi-harmonic sine wave elevation for fluid aurora curtain curves.
 *
 * @param x - Normalized x-coordinate along the canvas width (0 to 1).
 * @param time - Animation time parameter in seconds.
 * @param frequency - Primary wave spatial frequency.
 * @param amplitude - Primary wave vertical height displacement.
 * @param phase - Phase shift angle.
 * @returns Displaced y elevation value.
 */
export function calculateAuroraWave(
  x: number,
  time: number,
  frequency = 2,
  amplitude = 30,
  phase = 0
): number {
  const primaryWave = Math.sin(x * Math.PI * frequency + time + phase) * amplitude;
  const harmonicWave =
    Math.cos(x * Math.PI * frequency * 1.5 - time * 0.8 + phase * 0.5) * (amplitude * 0.35);
  const microRipple = Math.sin(x * Math.PI * frequency * 3.2 + time * 1.4) * (amplitude * 0.12);
  return primaryWave + harmonicWave + microRipple;
}

/**
 * Computes light refraction displacement near a pointer position using cubic smoothstep falloff.
 *
 * @param px - Point x position.
 * @param py - Point y position.
 * @param pointerX - Active pointer x coordinate.
 * @param pointerY - Active pointer y coordinate.
 * @param radius - Maximum refraction influence radius.
 * @param strength - Maximum displacement magnitude in pixels.
 * @returns Refracted Point2D coordinates.
 */
export function refractPoint(
  px: number,
  py: number,
  pointerX: number,
  pointerY: number,
  radius = 150,
  strength = 40
): Point2D {
  const dx = px - pointerX;
  const dy = py - pointerY;
  const distSq = dx * dx + dy * dy;
  const radiusSq = radius * radius;

  if (distSq >= radiusSq || distSq === 0) {
    return { x: px, y: py };
  }

  const dist = Math.sqrt(distSq);
  // Quadratic falloff attenuation: (1 - d/r)^2
  const normDist = dist / radius;
  const invNorm = 1 - normDist;
  const falloff = invNorm * invNorm;

  const pushFactor = (falloff * strength) / dist;
  return {
    x: px + dx * pushFactor,
    y: py + dy * pushFactor,
  };
}

/**
 * Determines the optimal wave point density based on viewport dimensions and touch hardware.
 *
 * @param viewportWidth - Window innerWidth.
 * @param isTouch - Boolean indicating touch or low-power device.
 * @returns Recommended number of horizontal wave sampling points.
 */
export function getOptimalParticleCount(viewportWidth: number, isTouch = false): number {
  if (viewportWidth < 600 || isTouch) {
    return 36;
  }
  if (viewportWidth < 1024) {
    return 64;
  }
  return 100;
}

/**
 * Caps Device Pixel Ratio at 2 to prevent excessive GPU allocation on high-DPI retina displays.
 *
 * @param rawDpr - window.devicePixelRatio or undefined.
 * @returns Capped DPR value between 1 and 2.
 */
export function getEffectiveDpr(rawDpr?: number): number {
  if (!rawDpr || Number.isNaN(rawDpr) || rawDpr <= 0) {
    return 1;
  }
  return Math.min(rawDpr, 2);
}
