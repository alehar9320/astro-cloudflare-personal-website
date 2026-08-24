/**
 * Pure mathematical utilities for Northern Lights Aurora canvas animation
 * and cursor magnetosphere vector displacement field calculations.
 */

/**
 * Calculates Y-axis offset for an aurora ribbon node using sine wave superposition.
 * Combines primary fundamental wave with secondary harmonic for organic fluid movement.
 */
export function calculateAuroraWave(
  x: number,
  time: number,
  frequency: number,
  amplitude: number,
  phase: number
): number {
  const primary = Math.sin(x * frequency + time + phase) * amplitude;
  const harmonic = Math.sin(x * frequency * 2.1 + time * 1.5) * (amplitude * 0.35);
  return primary + harmonic;
}

/**
 * Calculates vector displacement for a node when influenced by cursor position
 * within a defined magnetosphere force radius.
 */
export function calculateMagnetosphereDisplacement(
  x: number,
  y: number,
  cursorX: number,
  cursorY: number,
  radius: number,
  strength: number
): { dx: number; dy: number } {
  if (radius <= 0 || strength === 0) {
    return { dx: 0, dy: 0 };
  }

  const deltaX = x - cursorX;
  const deltaY = y - cursorY;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance >= radius || distance === 0) {
    return { dx: 0, dy: 0 };
  }

  // Smooth quadratic attenuation factor (1 at center, 0 at boundary)
  const attenuation = Math.pow(1 - distance / radius, 2);
  const displacementMagnitude = attenuation * strength;

  const nx = deltaX / distance;
  const ny = deltaY / distance;

  return {
    dx: nx * displacementMagnitude,
    dy: ny * displacementMagnitude,
  };
}

/**
 * Computes an adaptive scale multiplier based on viewport width to ensure
 * smooth 60fps performance on mobile and lower-power devices.
 */
export function getAdaptiveScale(viewportWidth: number): number {
  if (viewportWidth < 480) {
    return 0.4;
  }
  if (viewportWidth < 768) {
    return 0.65;
  }
  return 1.0;
}
