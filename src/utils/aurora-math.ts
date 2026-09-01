/**
 * Linear interpolation utility for smooth animation transitions.
 */
export function lerp(start: number, end: number, amt: number): number {
  return start + (end - start) * Math.max(0, Math.min(1, amt));
}

export interface WaveParameters {
  amplitude: number;
  frequency: number;
  phase: number;
  speed: number;
}

/**
 * Calculates the vertical Y position of a wave point, given position, time, and wave parameters.
 * Optionally factors in pointer refraction displacement.
 */
export function calculateWaveY(
  x: number,
  baseY: number,
  time: number,
  params: WaveParameters,
  pointerX?: number,
  pointerY?: number,
  pointerRadius: number = 150
): number {
  const wave =
    Math.sin(x * params.frequency + time * params.speed + params.phase) * params.amplitude;
  const harmonic =
    Math.cos(x * params.frequency * 0.5 + time * params.speed * 0.7) * (params.amplitude * 0.3);

  let displacement = 0;
  if (pointerX !== undefined && pointerY !== undefined) {
    const dist = Math.hypot(x - pointerX, baseY + wave - pointerY);
    if (dist < pointerRadius) {
      const factor = 1 - dist / pointerRadius;
      displacement = Math.sin(factor * Math.PI) * (params.amplitude * 0.8);
    }
  }

  return baseY + wave + harmonic + displacement;
}

export interface ColorStop {
  stop: number;
  color: string;
}

/**
 * Returns color stops for the "Northern Lights" theme: marine blue, cyan, and aurora highlights.
 */
export function getAuroraColorStops(layerIndex: number): ColorStop[] {
  const palettes: ColorStop[][] = [
    // Layer 0: Cyan / Marine Blue gradient
    [
      { stop: 0, color: 'rgba(0, 210, 255, 0.65)' },
      { stop: 0.5, color: 'rgba(10, 132, 255, 0.45)' },
      { stop: 1, color: 'rgba(13, 27, 42, 0)' },
    ],
    // Layer 1: Emerald Cyan / Electric Blue gradient
    [
      { stop: 0, color: 'rgba(48, 209, 88, 0.55)' },
      { stop: 0.6, color: 'rgba(0, 210, 255, 0.35)' },
      { stop: 1, color: 'rgba(10, 132, 255, 0)' },
    ],
    // Layer 2: Indigo / Cyan refraction
    [
      { stop: 0, color: 'rgba(94, 92, 230, 0.5)' },
      { stop: 0.5, color: 'rgba(0, 210, 255, 0.3)' },
      { stop: 1, color: 'rgba(13, 27, 42, 0)' },
    ],
  ];

  return palettes[layerIndex % palettes.length];
}
