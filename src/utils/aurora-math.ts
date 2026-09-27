/**
 * Aurora Math Utilities for Canvas Light Refraction Animations
 * Pure TypeScript functions for multi-harmonic wave calculations, cubic smoothstep falloff,
 * vector displacements, and viewport scaling.
 */

/**
 * Calculates wave elevation using multi-harmonic sine functions for fluid motion.
 */
export function calculateAuroraWave(
  x: number,
  time: number,
  frequency = 0.005,
  speed = 0.001,
  amplitude = 20
): number {
  const primaryWave = Math.sin(x * frequency + time * speed) * amplitude;
  const secondaryWave = Math.sin(x * (frequency * 2.3) - time * (speed * 1.5)) * (amplitude * 0.4);
  const tertiaryWave = Math.cos(x * (frequency * 0.7) + time * (speed * 0.8)) * (amplitude * 0.25);
  return primaryWave + secondaryWave + tertiaryWave;
}

/**
 * Calculates cubic smoothstep falloff: (1 - clamp(distance / radius, 0, 1))^2
 * Used for fluid optical light refraction without external physics engines or GC overhead.
 */
export function cubicSmoothstep(distance: number, radius: number): number {
  if (radius <= 0) return 0;
  const normalizedDistance = Math.min(Math.max(distance / radius, 0), 1);
  const factor = 1 - normalizedDistance;
  return factor * factor;
}

/**
 * Calculates vector displacement for wave nodes relative to pointer position.
 */
export function calculatePointerDisplacement(
  nodeX: number,
  nodeY: number,
  pointerX: number,
  pointerY: number,
  radius: number
): { dx: number; dy: number; intensity: number } {
  const deltaX = nodeX - pointerX;
  const deltaY = nodeY - pointerY;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance >= radius || distance === 0) {
    return { dx: 0, dy: 0, intensity: 0 };
  }

  const intensity = cubicSmoothstep(distance, radius);
  const angle = Math.atan2(deltaY, deltaX);
  const pushDistance = intensity * 28;

  return {
    dx: Math.cos(angle) * pushDistance,
    dy: Math.sin(angle) * pushDistance,
    intensity,
  };
}

/**
 * Computes viewport scale factor and DPR (clamped to 2.0 max for high 60fps performance).
 */
export function getCanvasViewportScale(
  width: number,
  devicePixelRatio: number
): { scale: number; dpr: number } {
  const dpr = Math.min(Math.max(devicePixelRatio || 1, 1), 2);
  let scale = 1.0;

  if (width < 480) {
    scale = 0.55;
  } else if (width < 768) {
    scale = 0.75;
  }

  return { scale, dpr };
}
