/**
 * Aurora Math Utilities for Canvas Wave Synthesis & Light Refraction Field
 */

/**
 * Calculates a multi-harmonic trigonometric wave offset for fluid aurora ribbons.
 *
 * @param x - Horizontal coordinate across canvas
 * @param time - Elapsed animation time in seconds
 * @param frequency - Spatial wave frequency multiplier
 * @param amplitude - Wave vertical displacement amplitude
 * @param phase - Phase shift angle in radians
 */
export function calculateWaveHeight(
  x: number,
  time: number,
  frequency: number,
  amplitude: number,
  phase = 0
): number {
  const primaryWave = Math.sin(x * frequency + time + phase);
  const secondaryHarmonic = Math.cos(x * frequency * 1.5 - time * 0.8 + phase * 0.5) * 0.35;
  return (primaryWave + secondaryHarmonic) * amplitude;
}

/**
 * Calculates cubic smoothstep attenuation (1 - distance / radius)^2 for pointer-driven light refraction.
 *
 * @param distance - Euclidean distance from pointer to control point
 * @param radius - Influence radius of the light refraction field
 */
export function cubicSmoothstepFalloff(distance: number, radius: number): number {
  if (radius <= 0 || distance >= radius) return 0;
  if (distance <= 0) return 1;
  const normalized = 1 - distance / radius;
  return normalized * normalized;
}

export interface RefractionDisplacement {
  dx: number;
  dy: number;
  intensity: number;
}

/**
 * Calculates pointer-driven optical displacement vectors and refraction intensity.
 *
 * @param px - Pointer horizontal coordinate
 * @param py - Pointer vertical coordinate
 * @param x - Canvas control point horizontal coordinate
 * @param y - Canvas control point vertical coordinate
 * @param radius - Refraction field interaction radius
 */
export function calculatePointerDisplacement(
  px: number,
  py: number,
  x: number,
  y: number,
  radius: number
): RefractionDisplacement {
  const deltaX = x - px;
  const deltaY = y - py;
  const distanceSq = deltaX * deltaX + deltaY * deltaY;

  if (distanceSq >= radius * radius || radius <= 0) {
    return { dx: 0, dy: 0, intensity: 0 };
  }

  const distance = Math.sqrt(distanceSq);
  const intensity = cubicSmoothstepFalloff(distance, radius);

  // Avoid division by zero when pointer is exactly on control point
  const dirX = distance > 0 ? deltaX / distance : 0;
  const dirY = distance > 0 ? deltaY / distance : 0;

  return {
    dx: dirX * intensity * 24,
    dy: dirY * intensity * 24,
    intensity,
  };
}

/**
 * Determines rendering quality scale factor (0.5 for mobile/low-power, 1.0 for desktop).
 *
 * @param clientWidth - Container viewport width in pixels
 * @param devicePixelRatio - Window device pixel ratio
 */
export function getMobileQualityScale(clientWidth: number, devicePixelRatio = 1): number {
  if (clientWidth < 640 || devicePixelRatio > 2.5) {
    return 0.5;
  }
  return 1.0;
}
