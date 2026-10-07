/**
 * Pure TypeScript mathematical utilities for calculating Northern Lights wave refractions
 * and dynamic spatial sampling intervals for Canvas rendering.
 */

export interface WaveParameters {
  wavelength: number;
  amplitude: number;
  speed: number;
  offset: number;
}

/**
 * Calculates height displacement for a single sine wave component.
 */
export function calculateWaveComponent(x: number, time: number, params: WaveParameters): number {
  const { wavelength, amplitude, speed, offset } = params;
  if (wavelength <= 0) return 0;
  return Math.sin(x / wavelength + time * speed + offset) * amplitude;
}

/**
 * Calculates superimposed aurora wave height at a given x coordinate.
 */
export function calculateAuroraWavePoint(
  x: number,
  time: number,
  baseY: number,
  waves: WaveParameters[]
): number {
  let displacement = 0;
  for (let i = 0; i < waves.length; i++) {
    displacement += calculateWaveComponent(x, time, waves[i]);
  }
  return baseY + displacement;
}

/**
 * Determines spatial step pixel increment based on viewport width
 * to maintain 60fps frame rates across desktop and mobile devices.
 */
export function getSpatialStep(width: number): number {
  if (width <= 0) return 4;
  return Math.max(4, Math.floor(width / 120));
}

/**
 * Interpolates between Marine Blue and Cyan/Emerald aurora colors.
 * @param t Normalized position along height (0 to 1)
 * @param alpha Opacity (0 to 1)
 */
export function getAuroraColor(t: number, alpha: number): string {
  const clampedT = Math.max(0, Math.min(1, t));
  const clampedAlpha = Math.max(0, Math.min(1, alpha));

  // Marine Blue: (15, 23, 42)
  // Cyan: (6, 182, 212)
  // Emerald Accent: (16, 185, 129)
  let r: number, g: number, b: number;

  if (clampedT < 0.5) {
    const factor = clampedT * 2;
    r = Math.round(15 + (6 - 15) * factor);
    g = Math.round(23 + (182 - 23) * factor);
    b = Math.round(42 + (212 - 42) * factor);
  } else {
    const factor = (clampedT - 0.5) * 2;
    r = Math.round(6 + (16 - 6) * factor);
    g = Math.round(182 + (185 - 182) * factor);
    b = Math.round(212 + (129 - 212) * factor);
  }

  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
}
