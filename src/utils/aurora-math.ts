/**
 * Aurora Math Utilities
 * Optimized mathematical functions for fluid, aurora-like animations.
 */

export interface AuroraWavePoint {
  x: number;
  y: number;
  opacity: number;
}

/**
 * Calculates a point on an aurora wave using sine waves and time.
 * @param x - Horizontal position
 * @param time - Animation time
 * @param amplitude - Height of the wave
 * @param frequency - Frequency of the wave
 * @param speed - Speed of movement
 * @returns Vertical offset and opacity
 */
export function calculateAuroraPoint(
  x: number,
  time: number,
  amplitude: number,
  frequency: number,
  speed: number
): number {
  // Primary wave
  const wave1 = Math.sin(x * frequency + time * speed);
  // Secondary harmonic for complexity
  const wave2 = Math.sin(x * frequency * 2.5 - time * speed * 0.8) * 0.5;
  // Tertiary wave for organic feel
  const wave3 = Math.sin(x * frequency * 0.5 + time * speed * 1.5) * 0.2;

  const totalWave = (wave1 + wave2 + wave3) / 1.7;
  return totalWave * amplitude;
}

/**
 * Normalizes a value between a range.
 */
export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

/**
 * Generates a simple pseudo-random noise value for variations.
 */
export function simpleNoise(t: number): number {
  return (Math.sin(t) + Math.sin(t * 1.5) + Math.sin(t * 2.1)) / 3;
}
