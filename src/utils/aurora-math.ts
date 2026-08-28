/**
 * Mathematical utilities for Northern Lights canvas wave superposition
 * and interactive magnetosphere vector displacement.
 */

export interface WaveConfig {
  amplitude: number;
  frequency: number;
  speed: number;
  harmonic: number;
}

export interface Vector2D {
  x: number;
  y: number;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/**
 * Calculates Y offset for multi-harmonic sine wave superposition at coordinate x and time t.
 */
export function calculateWaveY(x: number, t: number, baseY: number, config: WaveConfig): number {
  const primaryWave = Math.sin(x * config.frequency + t * config.speed) * config.amplitude;
  const harmonicWave =
    Math.sin(x * config.frequency * config.harmonic - t * config.speed * 0.7) *
    (config.amplitude * 0.35);
  return baseY + primaryWave + harmonicWave;
}

/**
 * Computes vector displacement of a point (x, y) relative to cursor pointer (px, py).
 */
export function applyMagnetosphereDisplacement(
  point: Vector2D,
  pointer: Vector2D,
  radius = 180,
  maxDisplacement = 45
): Vector2D {
  const dx = point.x - pointer.x;
  const dy = point.y - pointer.y;
  const distSq = dx * dx + dy * dy;

  if (distSq === 0 || distSq > radius * radius) {
    return { x: point.x, y: point.y };
  }

  const dist = Math.sqrt(distSq);
  const factor = (1 - dist / radius) * maxDisplacement;
  const angle = Math.atan2(dy, dx);

  return {
    x: point.x + Math.cos(angle) * factor,
    y: point.y + Math.sin(angle) * factor,
  };
}
