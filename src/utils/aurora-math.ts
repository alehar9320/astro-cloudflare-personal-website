/**
 * Pure TypeScript math and physics utilities for Northern Lights canvas rendering.
 */

/**
 * Clamps a value between a minimum and maximum bound.
 */
export function clamp(val: number, min: number, max: number): number {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

/**
 * Calculates cubic smoothstep attenuation for optical light refraction.
 * Returns 1 at distance 0, tapering smoothly down to 0 at distance >= radius.
 */
export function cubicSmoothstep(distance: number, radius: number): number {
  if (radius <= 0) return 0;
  if (distance <= 0) return 1;
  if (distance >= radius) return 0;

  const t = 1 - distance / radius;
  return t * t * (3 - 2 * t);
}

/**
 * Calculates compound sine/cosine wave vertical offset for smooth organic aurora curtains.
 */
export function calculateAuroraWave(
  x: number,
  time: number,
  frequency: number,
  amplitude: number,
  speed: number
): number {
  const primaryWave = Math.sin(x * frequency + time * speed) * amplitude;
  const harmonicWave = Math.cos(x * frequency * 0.5 - time * speed * 0.7) * (amplitude * 0.5);
  const microWave = Math.sin(x * frequency * 1.8 + time * speed * 1.2) * (amplitude * 0.2);

  return primaryWave + harmonicWave + microWave;
}

/**
 * Hardware & viewport performance configuration parameters.
 */
export interface AuroraPerformanceConfig {
  waveCount: number;
  sampleStep: number;
  particleCount: number;
  fpsCap: number;
}

/**
 * Returns rendering budget and configuration based on mobile viewport and low power mode flags.
 */
export function getPerformanceConfig(
  isMobile: boolean,
  isLowPower: boolean
): AuroraPerformanceConfig {
  if (isLowPower) {
    return {
      waveCount: 2,
      sampleStep: 8,
      particleCount: 15,
      fpsCap: 30,
    };
  }

  if (isMobile) {
    return {
      waveCount: 3,
      sampleStep: 5,
      particleCount: 30,
      fpsCap: 60,
    };
  }

  return {
    waveCount: 5,
    sampleStep: 3,
    particleCount: 60,
    fpsCap: 60,
  };
}
