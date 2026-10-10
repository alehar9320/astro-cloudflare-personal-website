/**
 * Prism Math Utilities for Northern Lights Canvas Refraction
 * Pure TypeScript mathematical and physical calculations for light refraction,
 * vector displacement, and color gradients.
 */

export interface Vector2D {
  x: number;
  y: number;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Calculates a multi-harmonic wave refraction value for light dynamics.
 * Range returned is normalized approximately between -1.0 and 1.0.
 */
export function calculateRefractionWave(
  x: number,
  y: number,
  time: number,
  pointer?: Vector2D | null
): number {
  const wave1 = Math.sin(x * 0.015 + time * 1.2) * Math.cos(y * 0.012 - time * 0.8);
  const wave2 = Math.sin((x + y) * 0.008 + time * 0.6) * 0.5;
  const baseWave = wave1 + wave2;

  if (!pointer) {
    return Math.max(-1, Math.min(1, baseWave));
  }

  const dx = x - pointer.x;
  const dy = y - pointer.y;
  const distSq = dx * dx + dy * dy;
  const maxRadiusSq = 250 * 250; // 250px interaction radius

  if (distSq < maxRadiusSq) {
    const factor = 1 - Math.sqrt(distSq) / 250;
    const distortion = Math.sin(Math.sqrt(distSq) * 0.05 - time * 2) * factor * 0.8;
    return Math.max(-1, Math.min(1, baseWave + distortion));
  }

  return Math.max(-1, Math.min(1, baseWave));
}

/**
 * Calculates 2D vector distance between two points, clamping the max distance.
 */
export function clampVectorDistance(
  p1: Vector2D,
  p2: Vector2D,
  maxRadius: number
): { dx: number; dy: number; distance: number; clampedDistance: number } {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const distance = Math.hypot(dx, dy);
  const clampedDistance = Math.min(distance, maxRadius);

  return { dx, dy, distance, clampedDistance };
}

/**
 * Interpolates smoothly between Northern Lights theme colors:
 * - t = 0.0: Deep Marine Blue (#002b49)
 * - t = 0.5: Cyan Glow (#00d2ff)
 * - t = 1.0: Vibrant Aurora Green (#00ffb3)
 */
export function interpolateNorthernLightsColor(tNormalized: number): RGBColor {
  // Clamp t to [0, 1]
  const t = Math.max(0, Math.min(1, tNormalized));

  if (t <= 0.5) {
    const factor = t / 0.5; // [0, 1]
    return {
      r: Math.round(0 + (0 - 0) * factor),
      g: Math.round(43 + (210 - 43) * factor),
      b: Math.round(73 + (255 - 73) * factor),
    };
  } else {
    const factor = (t - 0.5) / 0.5; // [0, 1]
    return {
      r: Math.round(0 + (0 - 0) * factor),
      g: Math.round(210 + (255 - 210) * factor),
      b: Math.round(255 + (179 - 255) * factor),
    };
  }
}
