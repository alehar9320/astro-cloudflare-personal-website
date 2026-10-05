/**
 * Northern Lights Light Refraction Math Utilities
 * Pure TypeScript functions for multi-harmonic wave physics, color refraction,
 * pointer distortion, and dynamic spatial step sampling.
 */

export interface RGBAColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Calculates Y offset for a multi-harmonic sine wave.
 */
export function calculateWaveY(
  x: number,
  time: number,
  frequency: number,
  amplitude: number,
  phase: number = 0
): number {
  const primary = Math.sin(x * frequency + time + phase);
  const secondary = 0.3 * Math.sin(x * frequency * 2.1 + time * 1.5 + phase * 0.5);
  return amplitude * (primary + secondary);
}

/**
 * Interpolates between Marine Blue (10, 37, 64) and Cyan (0, 242, 254) based on factor t [0, 1].
 */
export function refractColor(t: number, alpha: number = 0.8): RGBAColor {
  const clampedT = Math.max(0, Math.min(1, t));
  const r = Math.round(10 + (0 - 10) * clampedT);
  const g = Math.round(37 + (242 - 37) * clampedT);
  const b = Math.round(64 + (254 - 64) * clampedT);
  const a = Math.max(0, Math.min(1, alpha));

  return { r, g, b, a };
}

/**
 * Converts RGBAColor object to standard CSS rgba string.
 */
export function rgbaString(color: RGBAColor): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
}

/**
 * Calculates dynamic spatial step sampling based on viewport width to maintain 60fps.
 */
export function getSpatialStep(viewportWidth: number): number {
  if (viewportWidth <= 0) return 4;
  return Math.max(4, Math.floor(viewportWidth / 120));
}

/**
 * Calculates pointer influence distortion factor [0, 1] based on distance to point.
 */
export function calculatePointerInfluence(
  px: number,
  py: number,
  waveX: number,
  waveY: number,
  radius: number
): number {
  if (radius <= 0) return 0;
  const dx = px - waveX;
  const dy = py - waveY;
  const distSq = dx * dx + dy * dy;
  const radiusSq = radius * radius;

  if (distSq >= radiusSq) return 0;

  const dist = Math.sqrt(distSq);
  const factor = 1 - dist / radius;
  return factor * factor; // Smooth quadratic falloff
}
