/**
 * Math and physics utilities for Northern Lights Aurora wave superposition,
 * vector displacement refractions, and color interpolation.
 */

export interface WaveHarmonic {
  frequency: number;
  amplitude: number;
  speed: number;
  phaseOffset: number;
}

export interface WaveParameters {
  baseY: number;
  harmonics: WaveHarmonic[];
}

export interface PointerCoordinates {
  x: number;
  y: number;
}

export interface DisplacementOffset {
  dx: number;
  dy: number;
}

/**
 * Northern Lights cyan & marine blue palette stops.
 */
export const AURORA_COLOR_PALETTE: readonly string[] = [
  'rgba(0, 242, 254, 0.75)', // Vivid cyan
  'rgba(79, 172, 254, 0.65)', // Cyan-blue
  'rgba(58, 123, 213, 0.55)', // Deep ocean blue
  'rgba(0, 210, 255, 0.80)', // Electric sky cyan
  'rgba(13, 27, 42, 0.40)', // Dark marine glow
];

/**
 * Computes superimposed wave elevation at horizontal position `x` and timestamp `time` (in seconds).
 * Y = baseY + sum_i ( amplitude_i * sin(frequency_i * x + speed_i * time + phaseOffset_i) )
 */
export function computeWaveY(x: number, time: number, params: WaveParameters): number {
  let elevation = params.baseY;
  for (const h of params.harmonics) {
    elevation += h.amplitude * Math.sin(h.frequency * x + h.speed * time + h.phaseOffset);
  }
  return elevation;
}

/**
 * Computes vector displacement refraction offset at coordinates (x, y) given pointer location and influence radius.
 * When the pointer is within maxRadius of (x, y), a smooth quadratic attenuation displacement vector is calculated.
 */
export function calculateRefractionOffset(
  x: number,
  y: number,
  pointer: PointerCoordinates | null,
  maxRadius = 120,
  maxDisplacement = 25
): DisplacementOffset {
  if (!pointer) {
    return { dx: 0, dy: 0 };
  }

  const diffX = x - pointer.x;
  const diffY = y - pointer.y;
  const distanceSq = diffX * diffX + diffY * diffY;
  const radiusSq = maxRadius * maxRadius;

  if (distanceSq >= radiusSq || distanceSq === 0) {
    return { dx: 0, dy: 0 };
  }

  const distance = Math.sqrt(distanceSq);
  // Smooth quadratic falloff curve (1 - d/R)^2
  const factor = (1 - distance / maxRadius) ** 2;
  const force = factor * maxDisplacement;

  const dx = (diffX / distance) * force;
  const dy = (diffY / distance) * force;

  return { dx, dy };
}

/**
 * Interpolates color along the Northern Lights color gradient spectrum.
 * `t` parameter normalized between 0 and 1.
 */
export function interpolateAuroraColor(
  t: number,
  palette: readonly string[] = AURORA_COLOR_PALETTE
): string {
  if (palette.length === 0) return 'rgba(0, 242, 254, 1)';
  if (palette.length === 1) return palette[0];

  const clampedT = Math.max(0, Math.min(1, t));
  const index = clampedT * (palette.length - 1);
  return palette[Math.round(index)];
}
