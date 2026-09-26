/**
 * Math utilities for pure TypeScript HTML5 Canvas Aurora Wave rendering.
 * Pure functions without external dependencies or allocation overhead.
 */

/**
 * Calculates multi-harmonic sine wave height at position x and time t.
 */
export function calculateAuroraWaveHeight(
  x: number,
  time: number,
  frequency: number,
  amplitude: number,
  phase: number = 0
): number {
  const primaryHarmonic = Math.sin(x * frequency + time + phase);
  const secondaryHarmonic = 0.5 * Math.sin(x * frequency * 2.1 - time * 0.8 + phase * 1.5);
  return amplitude * (primaryHarmonic + secondaryHarmonic);
}

/**
 * Cubic smoothstep attenuation for pointer interaction and spatial falloff.
 * Formula: (1 - distance / radius)^2
 */
export function cubicSmoothstepFalloff(distance: number, radius: number): number {
  if (radius <= 0 || distance >= radius) return 0;
  if (distance <= 0) return 1;
  const ratio = 1 - distance / radius;
  return ratio * ratio;
}

export interface RGBAColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Interpolates color along Northern Lights spectrum (Marine Blue -> Cyan -> Aurora Emerald).
 * Factor t is clamped to [0, 1].
 */
export function interpolateAuroraColor(t: number, alpha: number = 1): RGBAColor {
  const clampedT = Math.max(0, Math.min(1, t));

  // Color stop 0: Deep Marine Blue rgb(2, 132, 199)
  // Color stop 0.5: Cyan rgb(6, 182, 212)
  // Color stop 1: Emerald Green rgb(16, 185, 129)

  let r: number, g: number, b: number;

  if (clampedT < 0.5) {
    const localT = clampedT * 2;
    r = Math.round(2 + (6 - 2) * localT);
    g = Math.round(132 + (182 - 132) * localT);
    b = Math.round(199 + (212 - 199) * localT);
  } else {
    const localT = (clampedT - 0.5) * 2;
    r = Math.round(6 + (16 - 6) * localT);
    g = Math.round(182 + (185 - 182) * localT);
    b = Math.round(212 + (129 - 212) * localT);
  }

  return { r, g, b, a: Math.max(0, Math.min(1, alpha)) };
}
