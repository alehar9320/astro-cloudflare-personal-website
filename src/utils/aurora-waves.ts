/**
 * Math utilities for Northern Lights aurora wave simulation and pointer light refraction.
 */

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface RefractionVector {
  dx: number;
  dy: number;
}

/**
 * Caps Device Pixel Ratio at 2 to prevent excessive GPU/memory overhead on High-DPI screens.
 */
export function calculateDPR(dpr: number = 1): number {
  if (isNaN(dpr) || dpr <= 0) return 1;
  return Math.min(dpr, 2);
}

/**
 * Clamps a numerical value within [min, max] range.
 */
export function clamp(val: number, min: number, max: number): number {
  if (min > max) throw new Error('min cannot be greater than max');
  return Math.max(min, Math.min(max, val));
}

/**
 * Computes multi-frequency sine wave elevation for wave superposition.
 */
export function computeSineWave(
  x: number,
  time: number,
  amplitude: number,
  frequency: number,
  speed: number,
  phaseShift: number = 0
): number {
  return amplitude * Math.sin(frequency * x + time * speed + phaseShift);
}

/**
 * Computes Gaussian light refraction displacement vectors induced by pointer position.
 */
export function computePointerRefraction(
  x: number,
  y: number,
  px: number,
  py: number,
  radius: number = 150,
  maxDisplacement: number = 25
): RefractionVector {
  if (radius <= 0) return { dx: 0, dy: 0 };
  const diffX = x - px;
  const diffY = y - py;
  const distSq = diffX * diffX + diffY * diffY;
  const radiusSq = radius * radius;

  if (distSq >= radiusSq) {
    return { dx: 0, dy: 0 };
  }

  const dist = Math.sqrt(distSq);
  if (dist === 0) return { dx: 0, dy: 0 };

  // Gaussian decay factor for smooth refraction falloff
  const normalizedDist = dist / radius;
  const factor = Math.exp(-normalizedDist * normalizedDist * 3) * maxDisplacement;

  return {
    dx: (diffX / dist) * factor,
    dy: (diffY / dist) * factor,
  };
}

/**
 * Linearly interpolates between two RGB colors based on factor t [0..1].
 */
export function lerpColor(colorA: RGBColor, colorB: RGBColor, t: number): RGBColor {
  const boundedT = clamp(t, 0, 1);
  return {
    r: Math.round(colorA.r + (colorB.r - colorA.r) * boundedT),
    g: Math.round(colorA.g + (colorB.g - colorA.g) * boundedT),
    b: Math.round(colorA.b + (colorB.b - colorA.b) * boundedT),
  };
}
