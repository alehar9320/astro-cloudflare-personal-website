/**
 * Aurora Math & Wave Utilities for Prism Canvas Animations
 * Pure TypeScript functions with zero external dependencies.
 */

/**
 * Smoothstep interpolation function.
 * Clamps x between min and max and returns a smooth Hermite interpolation between 0 and 1.
 */
export function smoothstep(min: number, max: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - min) / (max - min)));
  return t * t * (3 - 2 * t);
}

/**
 * Superposition of multiple sine waves to generate organic fluid motion.
 * Returns an offset height for a given horizontal coordinate x and time t.
 */
export function calculateAuroraWave(
  x: number,
  t: number,
  amplitude: number = 20,
  frequency: number = 0.005
): number {
  const wave1 = Math.sin(x * frequency + t * 0.002) * amplitude;
  const wave2 = Math.sin(x * frequency * 1.5 - t * 0.0015) * (amplitude * 0.5);
  const wave3 = Math.cos(x * frequency * 0.7 + t * 0.0025) * (amplitude * 0.25);
  return wave1 + wave2 + wave3;
}

/**
 * Calculates a light refraction displacement factor based on distance from a cursor point.
 * Returns a value between 0 (far away) and 1 (at cursor center).
 */
export function calculateRefractionForce(
  x: number,
  y: number,
  cursorX: number,
  cursorY: number,
  radius: number = 150
): number {
  const dx = x - cursorX;
  const dy = y - cursorY;
  const distSq = dx * dx + dy * dy;
  const radiusSq = radius * radius;

  if (distSq >= radiusSq) return 0;
  const dist = Math.sqrt(distSq);
  return smoothstep(radius, 0, dist);
}
