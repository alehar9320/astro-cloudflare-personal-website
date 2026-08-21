/**
 * Aurora wave synthesis and magnetosphere physics utilities.
 * Pure mathematical functions for 60fps HTML5 Canvas animations.
 */

export interface Vector2D {
  dx: number;
  dy: number;
}

/**
 * Calculates multi-frequency wave height using sine wave superposition.
 */
export function calculateAuroraWave(
  x: number,
  time: number,
  frequency: number = 0.005,
  amplitude: number = 30,
  speed: number = 0.002
): number {
  const wave1 = Math.sin(x * frequency + time * speed) * amplitude;
  const wave2 = Math.sin(x * frequency * 0.5 - time * speed * 0.7) * (amplitude * 0.4);
  const wave3 = Math.cos(x * frequency * 1.5 + time * speed * 1.2) * (amplitude * 0.2);
  return wave1 + wave2 + wave3;
}

/**
 * Calculates magnetosphere displacement vector pushing canvas elements away from cursor/pointer.
 */
export function calculateMagnetosphereDisplacement(
  px: number,
  py: number,
  mx: number,
  my: number,
  maxRadius: number = 150,
  forceStrength: number = 0.35
): Vector2D {
  const diffX = px - mx;
  const diffY = py - my;
  const dist = Math.hypot(diffX, diffY);

  if (dist >= maxRadius || dist === 0) {
    return { dx: 0, dy: 0 };
  }

  const factor = Math.pow(1 - dist / maxRadius, 2) * forceStrength;
  return {
    dx: (diffX / dist) * factor * maxRadius,
    dy: (diffY / dist) * factor * maxRadius,
  };
}

/**
 * Returns adaptive render scaling factor based on viewport width for performance optimization.
 */
export function getAdaptiveScale(screenWidth: number): number {
  if (screenWidth < 600) {
    return 0.5;
  }
  if (screenWidth < 1000) {
    return 0.75;
  }
  return 1.0;
}
