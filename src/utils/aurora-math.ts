/**
 * Pure TypeScript utilities for Northern Lights (Aurora) harmonic wave synthesis,
 * vector displacement, pseudo-simplex gradient noise, and palette interpolation.
 */

export interface Vector2D {
  x: number;
  y: number;
}

export interface RefractionResult {
  dx: number;
  dy: number;
  intensity: number;
}

export interface ColorStop {
  r: number;
  g: number;
  b: number;
  a: number;
}

export type PaletteKey = 'marine' | 'emerald' | 'arctic';

export const AURORA_PALETTES: Record<PaletteKey, ColorStop[]> = {
  marine: [
    { r: 12, g: 74, b: 110, a: 0.8 }, // Deep Marine Blue
    { r: 6, g: 182, b: 212, a: 0.85 }, // Bright Cyan
    { r: 59, g: 130, b: 246, a: 0.75 }, // Soft Sky Blue
    { r: 168, g: 85, b: 247, a: 0.6 }, // Subtle Violet Shift
  ],
  emerald: [
    { r: 6, g: 95, b: 70, a: 0.8 }, // Deep Forest Emerald
    { r: 16, g: 185, b: 129, a: 0.85 }, // Vivid Emerald Green
    { r: 45, g: 212, b: 191, a: 0.75 }, // Mint Aqua
    { r: 56, g: 189, b: 248, a: 0.6 }, // Polar Cyan
  ],
  arctic: [
    { r: 15, g: 23, b: 42, a: 0.85 }, // Dark Arctic Midnight
    { r: 99, g: 102, b: 241, a: 0.8 }, // Polar Indigo
    { r: 14, g: 165, b: 233, a: 0.85 }, // Ice Blue
    { r: 244, g: 114, b: 182, a: 0.5 }, // Rare Pink Dawn Glow
  ],
};

/**
 * Calculates a dual-harmonic wave displacement for a given position and time offset.
 */
export function calculateHarmonicWave(
  x: number,
  time: number,
  amplitude: number,
  frequency: number,
  phase = 0
): number {
  const primaryWave = Math.sin(x * frequency + time + phase) * amplitude;
  const secondaryWave = Math.sin(x * frequency * 2.1 - time * 0.75 + phase) * (amplitude * 0.35);
  const tertiaryWave = Math.cos(x * frequency * 0.5 + time * 1.2) * (amplitude * 0.15);
  return primaryWave + secondaryWave + tertiaryWave;
}

/**
 * Computes pointer refraction vectors and normalized intensity when (x, y) is within maxRadius of (px, py).
 */
export function calculatePointerRefraction(
  x: number,
  y: number,
  px: number,
  py: number,
  maxRadius: number
): RefractionResult {
  if (maxRadius <= 0) {
    return { dx: 0, dy: 0, intensity: 0 };
  }

  const distValX = x - px;
  const distValY = y - py;
  const distSq = distValX * distValX + distValY * distValY;
  const radiusSq = maxRadius * maxRadius;

  if (distSq >= radiusSq || distSq === 0) {
    return { dx: 0, dy: 0, intensity: 0 };
  }

  const dist = Math.sqrt(distSq);
  const intensity = Math.pow(1 - dist / maxRadius, 2);
  const normalX = distValX / dist;
  const normalY = distValY / dist;

  return {
    dx: normalX * intensity * 24,
    dy: normalY * intensity * 24,
    intensity,
  };
}

/**
 * Light, fast pseudo 2D Simplex/Perlin-style gradient noise algorithm.
 * Returns a value normalized between -1.0 and 1.0.
 */
export function pseudoNoise2D(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;

  // Smoothstep ease curve
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);

  // Hash coordinates into pseudo-gradients
  const hash = (nx: number, ny: number): number => {
    const h = Math.sin(nx * 12.9898 + ny * 78.233) * 43758.5453123;
    return h - Math.floor(h);
  };

  const g00 = hash(xi, yi) * Math.PI * 2;
  const g10 = hash(xi + 1, yi) * Math.PI * 2;
  const g01 = hash(xi, yi + 1) * Math.PI * 2;
  const g11 = hash(xi + 1, yi + 1) * Math.PI * 2;

  const d00 = Math.cos(g00) * xf + Math.sin(g00) * yf;
  const d10 = Math.cos(g10) * (xf - 1) + Math.sin(g10) * yf;
  const d01 = Math.cos(g01) * xf + Math.sin(g01) * (yf - 1);
  const d11 = Math.cos(g11) * (xf - 1) + Math.sin(g11) * (yf - 1);

  const nx0 = d00 + u * (d10 - d00);
  const nx1 = d01 + u * (d11 - d01);
  const noise = nx0 + v * (nx1 - nx0);

  return Math.max(-1, Math.min(1, noise * 1.414));
}

/**
 * Interpolates between color stops of a given palette based on a normalized factor t (0.0 to 1.0).
 */
export function interpolateAuroraColor(
  t: number,
  paletteKey: PaletteKey = 'marine',
  alphaMultiplier = 1
): string {
  const palette = AURORA_PALETTES[paletteKey] || AURORA_PALETTES.marine;
  const clampedT = Math.max(0, Math.min(1, t));

  if (palette.length === 0) {
    return 'rgba(0,0,0,0)';
  }

  if (palette.length === 1) {
    const c = palette[0];
    return `rgba(${c.r}, ${c.g}, ${c.b}, ${c.a * alphaMultiplier})`;
  }

  const scaled = clampedT * (palette.length - 1);
  const index = Math.floor(scaled);
  const fraction = scaled - index;

  const c1 = palette[index];
  const c2 = palette[Math.min(index + 1, palette.length - 1)];

  const r = Math.round(c1.r + (c2.r - c1.r) * fraction);
  const g = Math.round(c1.g + (c2.g - c1.g) * fraction);
  const b = Math.round(c1.b + (c2.b - c1.b) * fraction);
  const a = (c1.a + (c2.a - c1.a) * fraction) * alphaMultiplier;

  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
}
