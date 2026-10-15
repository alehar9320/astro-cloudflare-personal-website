/**
 * Math utility for Northern Lights aurora wave superposition & light refraction.
 */

export interface WaveConfig {
  frequency: number;
  amplitude: number;
  phase: number;
  speed: number;
}

/**
 * Default wave configurations for layered aurora ribbon rendering.
 */
export const DEFAULT_AURORA_WAVES: WaveConfig[] = [
  { frequency: 0.005, amplitude: 35, phase: 0, speed: 0.8 },
  { frequency: 0.012, amplitude: 18, phase: 1.2, speed: 1.2 },
  { frequency: 0.002, amplitude: 50, phase: 2.5, speed: 0.5 },
];

/**
 * Calculates the y displacement at x given time and wave configuration parameters.
 * Uses multi-sine superposition to create fluid organic aurora undulations.
 */
export function calculateAuroraWave(
  x: number,
  time: number,
  configs: WaveConfig[] = DEFAULT_AURORA_WAVES
): number {
  let displacement = 0;
  for (let i = 0; i < configs.length; i++) {
    const w = configs[i];
    displacement += Math.sin(x * w.frequency + time * w.speed + w.phase) * w.amplitude;
  }
  return displacement;
}

/**
 * Calculates an HSL color string interpolating between deep marine blue and bright cyan / teal
 * based on wave height ratio (0 = low, 1 = crest) and opacity.
 */
export function calculateAuroraColor(ratio: number, opacity = 1): string {
  const clampedRatio = Math.max(0, Math.min(1, ratio));
  // Deep marine blue: hue 215, sat 65%, lightness 15%
  // Cyan aurora glow: hue 185, sat 100%, lightness 55%
  const hue = 215 - clampedRatio * 30; // 215 -> 185
  const saturation = 65 + clampedRatio * 35; // 65% -> 100%
  const lightness = 15 + clampedRatio * 40; // 15% -> 55%
  const alpha = Math.max(0, Math.min(1, opacity));

  return `hsla(${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%, ${alpha.toFixed(2)})`;
}

/**
 * Calculates responsive canvas dimensions and pixel ratio bounds based on viewport size.
 * Scales down high-DPI density on mobile screens to maintain smooth 60fps frame rates.
 */
export function getAuroraCanvasDimensions(
  containerWidth: number,
  containerHeight: number,
  devicePixelRatio = 1,
  isMobile = false
): { width: number; height: number; dpr: number } {
  const safeWidth = Math.max(1, Math.round(containerWidth));
  const safeHeight = Math.max(1, Math.round(containerHeight));

  // Cap DPR to 1 on mobile / low-power devices, max 2 on desktop to save GPU allocations
  const capDpr = isMobile ? 1 : Math.min(2, Math.max(1, devicePixelRatio));

  return {
    width: Math.round(safeWidth * capDpr),
    height: Math.round(safeHeight * capDpr),
    dpr: capDpr,
  };
}

/**
 * Calculates pointer refraction displacement offset for interactive wave ripple effect.
 */
export function calculatePointerRefraction(
  x: number,
  pointerX: number,
  radius = 120,
  intensity = 30
): number {
  const dist = Math.abs(x - pointerX);
  if (dist >= radius) return 0;
  // Smooth cosine-squared curve for natural ripple decay
  const factor = Math.cos((dist / radius) * (Math.PI / 2));
  return factor * factor * intensity;
}
