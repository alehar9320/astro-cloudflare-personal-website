/**
 * Mathematical utilities for high-performance canvas aurora wave rendering and
 * optical light refraction displacement.
 */

export interface WaveHarmonic {
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
}

export interface Vector2D {
  dx: number;
  dy: number;
}

export type RgbColor = [number, number, number];

/**
 * Calculates cubic smoothstep attenuation value for displacement calculations.
 * Returns 0 if distance exceeds radius or if radius <= 0.
 */
export function cubicSmoothstep(distance: number, radius: number): number {
  if (radius <= 0 || distance >= radius) return 0;
  if (distance <= 0) return 1;
  const t = 1 - distance / radius;
  return t * t * (3 - 2 * t);
}

/**
 * Computes multi-harmonic sine wave height (Y offset) for a given X coordinate and timestamp.
 */
export function calculateRibbonY(
  x: number,
  width: number,
  time: number,
  harmonics: WaveHarmonic[]
): number {
  if (width <= 0 || harmonics.length === 0) return 0;
  const normalizedX = x / width;
  let totalY = 0;

  for (let i = 0; i < harmonics.length; i++) {
    const h = harmonics[i];
    const angle = normalizedX * Math.PI * 2 * h.frequency + time * h.speed + h.phase;
    totalY += Math.sin(angle) * h.amplitude;
  }

  return totalY;
}

/**
 * Computes vector displacement driven by pointer distance and smoothstep falloff.
 */
export function pointerDisplacement(
  x: number,
  y: number,
  px: number,
  py: number,
  radius: number,
  strength: number
): Vector2D {
  const dx = x - px;
  const dy = y - py;
  const dist = Math.hypot(dx, dy);

  const factor = cubicSmoothstep(dist, radius);
  if (factor === 0 || dist === 0) {
    return { dx: 0, dy: 0 };
  }

  const normalizedDx = dx / dist;
  const normalizedDy = dy / dist;
  const displacement = factor * strength;

  return {
    dx: normalizedDx * displacement,
    dy: normalizedDy * displacement,
  };
}

/**
 * Interpolates smoothly between two RGB tuple colors and returns an 'rgb(r, g, b)' string.
 */
export function interpolateColor(colorA: RgbColor, colorB: RgbColor, factor: number): string {
  const clampedFactor = Math.max(0, Math.min(1, factor));
  const r = Math.round(colorA[0] + (colorB[0] - colorA[0]) * clampedFactor);
  const g = Math.round(colorA[1] + (colorB[1] - colorA[1]) * clampedFactor);
  const b = Math.round(colorA[2] + (colorB[2] - colorA[2]) * clampedFactor);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Returns rendering scale factors and harmonic density based on viewport width for mobile scaling.
 */
export function getMobileScale(windowWidth: number): { scale: number; harmonicCount: number } {
  if (windowWidth <= 0) return { scale: 1, harmonicCount: 3 };
  if (windowWidth < 480) {
    return { scale: 0.5, harmonicCount: 2 };
  }
  if (windowWidth < 768) {
    return { scale: 0.75, harmonicCount: 2 };
  }
  return { scale: 1, harmonicCount: 3 };
}
