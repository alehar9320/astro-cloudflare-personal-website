/**
 * Pure TypeScript math and color utilities for Northern Lights canvas visualizers.
 */

export interface WaveParams {
  amplitude: number;
  frequency: number;
  phase: number;
  speed: number;
}

export interface RGBAColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Calculates compound wave Y offset using harmonic sine/cosine equations.
 */
export function calculateWaveY(x: number, time: number, params: WaveParams): number {
  const primary = Math.sin(x * params.frequency + time * params.speed + params.phase);
  const secondary = Math.cos(x * params.frequency * 1.5 - time * params.speed * 0.8) * 0.35;
  return (primary + secondary) * params.amplitude;
}

/**
 * Calculates cubic smoothstep falloff for pointer refraction/displacement.
 * Attenuation follows (1 - d/r)^2 for smooth optical light refraction.
 */
export function smoothstepFalloff(distance: number, maxRadius: number): number {
  if (maxRadius <= 0) return 0;
  const clampedRatio = Math.max(0, Math.min(1, distance / maxRadius));
  const linear = 1 - clampedRatio;
  return linear * linear * (3 - 2 * linear);
}

/**
 * Northern Lights color palette definitions:
 * Deep marine: rgba(2, 11, 24, 0.8)
 * Deep Emerald: rgba(16, 185, 129, 0.6)
 * Cyan Glow: rgba(0, 242, 254, 0.7)
 * Royal Indigo: rgba(30, 27, 75, 0.5)
 */
const AURORA_PALETTE: RGBAColor[] = [
  { r: 2, g: 11, b: 24, a: 0.8 },
  { r: 16, g: 185, b: 129, a: 0.6 },
  { r: 0, g: 242, b: 254, a: 0.7 },
  { r: 30, g: 27, b: 75, a: 0.5 },
];

/**
 * Smoothly interpolates an RGBA color along the Northern Lights palette based on t in [0, 1].
 */
export function interpolateAuroraColor(t: number): RGBAColor {
  const clampedT = Math.max(0, Math.min(1, t));
  const maxIndex = AURORA_PALETTE.length - 1;
  const scaled = clampedT * maxIndex;
  const index = Math.floor(scaled);
  const nextIndex = Math.min(maxIndex, index + 1);
  const factor = scaled - index;

  const c1 = AURORA_PALETTE[index];
  const c2 = AURORA_PALETTE[nextIndex];

  return {
    r: Math.round(c1.r + (c2.r - c1.r) * factor),
    g: Math.round(c1.g + (c2.g - c1.g) * factor),
    b: Math.round(c1.b + (c2.b - c1.b) * factor),
    a: Number((c1.a + (c2.a - c1.a) * factor).toFixed(2)),
  };
}

/**
 * Returns canvas wave point density scaled for mobile viewport performance optimization.
 */
export function getScaledPoints(canvasWidth: number, isMobile: boolean): number {
  if (isMobile || canvasWidth < 768) {
    return Math.max(16, Math.floor(canvasWidth / 25));
  }
  return Math.max(32, Math.floor(canvasWidth / 12));
}
