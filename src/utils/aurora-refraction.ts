/**
 * Pure TypeScript mathematical utilities for Aurora Canvas Light Refraction.
 * Designed for 60fps canvas rendering without external physics engines or GC overhead.
 */

/**
 * Calculates cubic smoothstep falloff attenuation based on distance and effect radius.
 * Clamps result between 0 and 1.
 *
 * @param distance Distance from origin point
 * @param radius Maximum interaction radius
 * @returns Attenuation value between 0 and 1
 */
export function cubicSmoothstep(distance: number, radius: number): number {
  if (radius <= 0 || distance >= radius || distance < 0) {
    return 0;
  }
  const norm = 1 - distance / radius;
  return norm * norm;
}

/**
 * Computes wave vertical displacement at position x and time t using layered sine function.
 *
 * @param x Horizontal pixel position
 * @param time Elapsed time in seconds
 * @param amplitude Wave height in pixels
 * @param frequency Wave frequency multiplier
 * @param phase Phase offset in radians
 * @param offset Base Y-level offset
 * @returns Vertical Y coordinate
 */
export function calculateWaveY(
  x: number,
  time: number,
  amplitude: number,
  frequency: number,
  phase: number,
  offset: number
): number {
  return offset + Math.sin(x * frequency + time + phase) * amplitude;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Linearly interpolates between deep marine blue, teal, and vibrant cyan based on factor [0, 1].
 *
 * @param factor Value between 0 and 1
 * @returns RGB color object
 */
export function interpolateAuroraColor(factor: number): RGBColor {
  const clampedFactor = Math.max(0, Math.min(1, factor));

  // Keyframes: Marine Blue (0.0) -> Deep Teal (0.5) -> Vibrant Cyan (1.0)
  const c0: RGBColor = { r: 9, g: 30, b: 58 }; // #091E3A
  const c1: RGBColor = { r: 0, g: 92, b: 138 }; // #005C8A
  const c2: RGBColor = { r: 0, g: 242, b: 254 }; // #00F2FE

  if (clampedFactor <= 0.5) {
    const t = clampedFactor * 2;
    return {
      r: Math.round(c0.r + (c1.r - c0.r) * t),
      g: Math.round(c0.g + (c1.g - c0.g) * t),
      b: Math.round(c0.b + (c1.b - c0.b) * t),
    };
  } else {
    const t = (clampedFactor - 0.5) * 2;
    return {
      r: Math.round(c1.r + (c2.r - c1.r) * t),
      g: Math.round(c1.g + (c2.g - c1.g) * t),
      b: Math.round(c1.b + (c2.b - c1.b) * t),
    };
  }
}

/**
 * Formats an RGBColor object into a CSS rgba string.
 */
export function formatRgba(color: RGBColor, alpha: number): string {
  const clampedAlpha = Math.max(0, Math.min(1, alpha));
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${clampedAlpha})`;
}

/**
 * Calculates pointer influence displacement vector for canvas points.
 */
export function calculateDisplacedPoint(
  x: number,
  y: number,
  pointerX: number,
  pointerY: number,
  radius: number,
  strength: number
): { x: number; y: number } {
  const dx = x - pointerX;
  const dy = y - pointerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0 || distance >= radius) {
    return { x, y };
  }

  const attenuation = cubicSmoothstep(distance, radius);
  const displacement = attenuation * strength;
  const nx = dx / distance;
  const ny = dy / distance;

  return {
    x: x + nx * displacement,
    y: y + ny * displacement,
  };
}
