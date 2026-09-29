export interface WaveConfig {
  baseY: number;
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
}

export interface PointerState {
  x: number;
  y: number;
  active: boolean;
}

/**
 * Calculates cubic smoothstep attenuation `(1 - distance / radius)^2`
 * for distance in [0, radius]. Returns 0 if distance >= radius or radius <= 0.
 */
export function cubicSmoothstep(distance: number, radius: number): number {
  if (radius <= 0 || distance >= radius) return 0;
  if (distance <= 0) return 1;
  const norm = 1 - distance / radius;
  return norm * norm;
}

/**
 * Calculates sinusoidal wave y-position with pointer-driven displacement.
 */
export function calculateWaveY(
  x: number,
  time: number,
  config: WaveConfig,
  pointer: PointerState,
  pointerRadius = 180
): number {
  const baseWave =
    Math.sin(x * config.frequency + time * config.speed + config.phase) * config.amplitude;

  let displacement = 0;
  if (pointer.active) {
    const dx = x - pointer.x;
    const dist = Math.abs(dx);
    if (dist < pointerRadius) {
      const factor = cubicSmoothstep(dist, pointerRadius);
      const dy = pointer.y - config.baseY;
      displacement = dy * factor * 0.25;
    }
  }

  return config.baseY + baseWave + displacement;
}
