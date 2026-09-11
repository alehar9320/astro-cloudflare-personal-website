/**
 * Math and physics utilities for Northern Lights (Aurora) wave synthesis and light refraction.
 */

export interface WaveConfig {
  frequency: number;
  amplitude: number;
  phase: number;
  speed: number;
}

export interface RefractionVector {
  dx: number;
  dy: number;
  intensity: number;
}

/**
 * Calculates wave height at position x and time t using composite trigonometric waves.
 *
 * @param x - Horizontal coordinate across the canvas
 * @param time - Animation timestamp or frame time unit
 * @param config - Wave frequency, amplitude, phase, and speed configuration
 * @returns Vertical offset displacement in pixels
 */
export function calculateAuroraWaveHeight(x: number, time: number, config: WaveConfig): number {
  const { frequency, amplitude, phase, speed } = config;
  const t = time * speed;
  const primaryWave = Math.sin(x * frequency + t + phase) * amplitude;
  const secondaryWave = Math.cos(x * frequency * 0.5 - t * 0.7 + phase) * (amplitude * 0.35);
  const tertiaryHarmonic = Math.sin(x * frequency * 1.8 + t * 1.3) * (amplitude * 0.15);
  return primaryWave + secondaryWave + tertiaryHarmonic;
}

/**
 * Calculates interactive light refraction displacement and intensity from a pointer coordinate.
 *
 * @param px - Point X coordinate
 * @param py - Point Y coordinate
 * @param pointerX - Active pointer X coordinate
 * @param pointerY - Active pointer Y coordinate
 * @param maxRadius - Interaction effect radius in pixels
 * @returns Refraction displacement vector and normalized intensity [0, 1]
 */
export function calculateRefractionVector(
  px: number,
  py: number,
  pointerX: number,
  pointerY: number,
  maxRadius: number
): RefractionVector {
  if (maxRadius <= 0) {
    return { dx: 0, dy: 0, intensity: 0 };
  }

  const deltaX = px - pointerX;
  const deltaY = py - pointerY;
  const distSq = deltaX * deltaX + deltaY * deltaY;
  const radiusSq = maxRadius * maxRadius;

  if (distSq >= radiusSq || distSq === 0) {
    return { dx: 0, dy: 0, intensity: 0 };
  }

  const dist = Math.sqrt(distSq);
  const normalizedDist = 1 - dist / maxRadius;
  // Smoothstep ease-out profile for ripple falloff
  const intensity = normalizedDist * normalizedDist * (3 - 2 * normalizedDist);

  const factor = (intensity * 25) / dist;
  return {
    dx: deltaX * factor,
    dy: deltaY * factor,
    intensity,
  };
}

/**
 * Generates color stop parameters for Northern Lights gradient rendering.
 *
 * @param alpha - Opacity multiplier [0, 1]
 * @returns Array of hex/hsla color strings matching Northern Lights aesthetic
 */
export function getAuroraPalette(alpha: number = 1): string[] {
  const safeAlpha = Math.max(0, Math.min(1, alpha));
  return [
    `hsla(190, 100%, 50%, ${safeAlpha})`,
    `hsla(210, 100%, 55%, ${safeAlpha * 0.85})`,
    `hsla(270, 85%, 60%, ${safeAlpha * 0.6})`,
    `hsla(160, 90%, 45%, ${safeAlpha * 0.75})`,
  ];
}
