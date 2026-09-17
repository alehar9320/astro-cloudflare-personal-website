/**
 * Aurora Waves Canvas Math Utility (👩‍🚀 Prism)
 * Pure TypeScript sine-wave & particle interaction logic for Northern Lights visuals.
 */

export interface WaveConfig {
  amplitude: number;
  frequency: number;
  speed: number;
  color: string;
  lineWidth: number;
}

export interface MousePosition {
  x: number;
  y: number;
  active: boolean;
}

/**
 * Calculates Y coordinate for a sine wave given X position, time, phase offset, and pointer distortion.
 */
export function calculateWaveY(
  x: number,
  time: number,
  config: WaveConfig,
  baseY: number,
  mouse: MousePosition
): number {
  const baseSine = Math.sin(x * config.frequency + time * config.speed);
  const secondarySine = Math.cos(x * config.frequency * 0.5 + time * config.speed * 0.7);
  let y = baseY + (baseSine + secondarySine * 0.5) * config.amplitude;

  if (mouse.active) {
    const dx = x - mouse.x;
    const distanceSq = dx * dx;
    const maxRadius = 180;
    if (distanceSq < maxRadius * maxRadius) {
      const distance = Math.sqrt(distanceSq);
      const influence = Math.pow(1 - distance / maxRadius, 2);
      // If mouse.y is at baseY (dy === 0), Math.sin(influence * Math.PI) is non-zero, but dy makes distortion 0.
      // Use offset or non-zero factor so mouse influence is reflected regardless of cursor elevation.
      const dy = mouse.y - baseY;
      const verticalOffset = dy === 0 ? 30 : dy;
      y += Math.sin(influence * Math.PI * 0.5) * verticalOffset * 0.4;
    }
  }

  return y;
}

/**
 * Calculates effective Device Pixel Ratio capped at 2 to prevent excessive GPU allocation.
 */
export function getCappedDpr(dpr: number): number {
  return Math.min(Math.max(1, dpr || 1), 2);
}

/**
 * Returns default Northern Lights wave configurations.
 */
export function getDefaultAuroraWaveConfigs(): WaveConfig[] {
  return [
    {
      amplitude: 28,
      frequency: 0.006,
      speed: 1.2,
      color: 'rgba(56, 189, 248, 0.45)', // Cyan / sky light
      lineWidth: 3,
    },
    {
      amplitude: 36,
      frequency: 0.004,
      speed: 0.8,
      color: 'rgba(14, 165, 233, 0.35)', // Marine blue
      lineWidth: 2.5,
    },
    {
      amplitude: 20,
      frequency: 0.008,
      speed: 1.5,
      color: 'rgba(129, 140, 248, 0.25)', // Northern aurora violet
      lineWidth: 2,
    },
  ];
}
