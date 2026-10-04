/**
 * Aurora Canvas Math & Physics Utilities
 * Pure TypeScript functions for sine wave generation and vector pointer refraction.
 */

/**
 * Calculates Y position along a sine wave.
 */
export function calculateWaveY(
  x: number,
  time: number,
  frequency: number,
  amplitude: number,
  phase: number,
  baseHeight: number
): number {
  return baseHeight + Math.sin(x * frequency + time + phase) * amplitude;
}

/**
 * Calculates attraction/refraction vector offset for a particle relative to pointer position.
 */
export function calculateParticleAttraction(
  px: number,
  py: number,
  mx: number,
  my: number,
  maxRadius: number
): { dx: number; dy: number } {
  if (maxRadius <= 0) return { dx: 0, dy: 0 };

  const deltaX = mx - px;
  const deltaY = my - py;
  const distSq = deltaX * deltaX + deltaY * deltaY;
  const maxRadiusSq = maxRadius * maxRadius;

  if (distSq >= maxRadiusSq || distSq === 0) {
    return { dx: 0, dy: 0 };
  }

  const dist = Math.sqrt(distSq);
  const factor = (1 - dist / maxRadius) * 12;

  return {
    dx: (deltaX / dist) * factor,
    dy: (deltaY / dist) * factor,
  };
}

/**
 * Calculates spatial step sampling interval based on viewport width.
 * Follows technical standard: Math.max(4, Math.floor(w / 120)).
 */
export function calculateStepInterval(width: number): number {
  if (width <= 0) return 4;
  return Math.max(4, Math.floor(width / 120));
}
