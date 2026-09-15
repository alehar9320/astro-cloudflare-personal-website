/**
 * Aurora Math & Physics Utilities for Canvas & WebGL Visualizations
 * Provides pure TypeScript math calculations for multi-harmonic sine wave synthesis,
 * color refraction, spring dynamics, and device pixel ratio capping.
 */

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export interface SpringState {
  position: number;
  velocity: number;
}

/**
 * Northern Lights color palette definitions in RGB format.
 */
export const NORTHERN_LIGHTS_PALETTE = {
  marine: { r: 10, g: 25, b: 47 } as ColorRGB,
  cyan: { r: 0, g: 242, b: 254 } as ColorRGB,
  emerald: { r: 16, g: 185, b: 129 } as ColorRGB,
  violet: { r: 121, g: 40, b: 202 } as ColorRGB,
  sky: { r: 56, g: 189, b: 248 } as ColorRGB,
};

/**
 * Caps device pixel ratio to avoid excessive memory allocation on high-DPI displays.
 */
export function capDevicePixelRatio(dpr: number, maxDpr = 2): number {
  if (isNaN(dpr) || dpr <= 0) return 1;
  return Math.min(dpr, maxDpr);
}

/**
 * Smoothly interpolates between two RGB colors using factor t in [0, 1].
 */
export function interpolateColor(c1: ColorRGB, c2: ColorRGB, t: number): ColorRGB {
  const clampedT = Math.max(0, Math.min(1, t));
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * clampedT),
    g: Math.round(c1.g + (c2.g - c1.g) * clampedT),
    b: Math.round(c1.b + (c2.b - c1.b) * clampedT),
  };
}

/**
 * Calculates wave elevation at position x and time t using multi-harmonic sine synthesis.
 */
export function calculateAuroraWaveElevation(
  x: number,
  time: number,
  wavelength: number,
  amplitude: number,
  harmonicRatio = 0.5,
  phaseShift = 0
): number {
  if (wavelength <= 0) return 0;
  const k = (2 * Math.PI) / wavelength;
  const primaryWave = Math.sin(k * x + time + phaseShift) * amplitude;
  const secondaryWave = Math.sin(k * 2 * x - time * 1.5 + phaseShift) * (amplitude * harmonicRatio);
  return primaryWave + secondaryWave;
}

/**
 * Updates a spring physics particle state toward a target position.
 */
export function updateSpringState(
  state: SpringState,
  target: number,
  stiffness = 0.05,
  damping = 0.85
): SpringState {
  const force = (target - state.position) * stiffness;
  const newVelocity = (state.velocity + force) * damping;
  const newPosition = state.position + newVelocity;
  return {
    position: newPosition,
    velocity: newVelocity,
  };
}

/**
 * Formats RGB color object into standard CSS rgba string with opacity.
 */
export function formatRgba(color: ColorRGB, alpha = 1): string {
  const clampedAlpha = Math.max(0, Math.min(1, alpha));
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${clampedAlpha})`;
}
