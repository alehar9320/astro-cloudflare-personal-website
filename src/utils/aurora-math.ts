/**
 * Pure math utilities for Northern Lights (Aurora) refraction animations.
 * Hardware-accelerated, zero-allocation math operations for 60fps canvas contexts.
 */

/**
 * Cubic smoothstep falloff calculation for light refraction / pointer displacement.
 * Attenuation formula: (1 - distance / radius)^2 for distance <= radius, else 0.
 *
 * @param distance Distance from the pointer / focal point
 * @param radius Effective influence radius
 * @returns Smooth intensity value between 0.0 and 1.0
 */
export function cubicSmoothstep(distance: number, radius: number): number {
  if (radius <= 0) return 0;
  if (distance < 0) distance = Math.abs(distance);
  if (distance >= radius) return 0;

  const norm = 1 - distance / radius;
  return norm * norm;
}

/**
 * Multi-layered sine wave calculation representing dynamic aurora curtains.
 * Combines primary wave frequency with secondary harmonics for organic fluid motion.
 *
 * @param x Horizontal pixel position
 * @param time Dynamic timestamp / time value in seconds
 * @param frequency Base spatial frequency
 * @param amplitude Base vertical wave displacement amplitude
 * @returns Calculated y-offset value
 */
export function computeAuroraWave(
  x: number,
  time: number,
  frequency: number = 0.005,
  amplitude: number = 25
): number {
  const primaryWave = Math.sin(x * frequency + time * 1.2) * amplitude;
  const secondaryWave = Math.sin(x * frequency * 2.1 - time * 0.8) * (amplitude * 0.4);
  const tertiaryWave = Math.cos(x * frequency * 0.7 + time * 1.5) * (amplitude * 0.2);

  return primaryWave + secondaryWave + tertiaryWave;
}

/**
 * Calculates responsive canvas scaling factor based on devicePixelRatio and max threshold.
 * Caps scaling at 2x on mobile/retina devices to preserve GPU memory and battery performance.
 *
 * @param devicePixelRatio Window devicePixelRatio property
 * @returns Capped DPR factor (1.0 - 2.0)
 */
export function getOptimizedDpr(devicePixelRatio: number = 1): number {
  if (!devicePixelRatio || isNaN(devicePixelRatio) || devicePixelRatio <= 0) {
    return 1;
  }
  return Math.min(Math.max(1, devicePixelRatio), 2);
}
