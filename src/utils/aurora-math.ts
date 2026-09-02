/**
 * Native mathematical utilities for Northern Lights canvas refractions and wave animations.
 */

export interface WaveConfig {
  wavelength: number;
  amplitude: number;
  speed: number;
  phase?: number;
}

export interface ParticleState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
}

/**
 * Calculates height offset for a single sine wave.
 */
export function calculateAuroraWave(
  x: number,
  time: number,
  wavelength: number,
  amplitude: number,
  speed: number,
  phase: number = 0
): number {
  if (wavelength <= 0) return 0;
  const frequency = (Math.PI * 2) / wavelength;
  return Math.sin(x * frequency + time * speed + phase) * amplitude;
}

/**
 * Superimposes multiple sine waves to create organic, non-repeating wave movements.
 */
export function superimposeWaves(x: number, time: number, waves: WaveConfig[]): number {
  let totalOffset = 0;
  for (let i = 0; i < waves.length; i++) {
    const w = waves[i];
    if (w) {
      totalOffset += calculateAuroraWave(x, time, w.wavelength, w.amplitude, w.speed, w.phase ?? 0);
    }
  }
  return totalOffset;
}

/**
 * Linear interpolation between two RGB color tuples.
 */
export function interpolateColor(
  colorA: [number, number, number],
  colorB: [number, number, number],
  factor: number
): [number, number, number] {
  const t = Math.max(0, Math.min(1, factor));
  return [
    Math.round(colorA[0] + (colorB[0] - colorA[0]) * t),
    Math.round(colorA[1] + (colorB[1] - colorA[1]) * t),
    Math.round(colorA[2] + (colorB[2] - colorA[2]) * t),
  ];
}

/**
 * Updates a floating refractive particle's position and wraps around viewport boundaries.
 */
export function updateParticle(
  particle: ParticleState,
  bounds: { width: number; height: number }
): ParticleState {
  const { vx, vy, alpha } = particle;
  let { x, y } = particle;

  if (bounds.width > 0) {
    x = (x + vx + bounds.width) % bounds.width;
  } else {
    x += vx;
  }

  if (bounds.height > 0) {
    y = (y + vy + bounds.height) % bounds.height;
  } else {
    y += vy;
  }

  return { x, y, vx, vy, alpha };
}
