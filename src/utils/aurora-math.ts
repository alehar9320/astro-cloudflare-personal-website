/**
 * Utility functions for Northern Lights interactive canvas math and physics calculations.
 * Prism 👩‍🚀 Creative & Interactive Developer.
 */

/**
 * Caps Device Pixel Ratio at maximum 2 to avoid GPU memory overhead on High-DPI screens.
 */
export function clampDpr(dpr: number): number {
  if (dpr <= 0 || !Number.isFinite(dpr)) return 1;
  return Math.min(dpr, 2);
}

/**
 * Computes wave height Y using combined sine waves for smooth organic motion.
 */
export function calculateWaveY(
  x: number,
  time: number,
  baseY: number,
  amplitude: number,
  frequency: number,
  phase: number = 0
): number {
  const primaryWave = Math.sin(x * frequency + time + phase) * amplitude;
  const secondaryWave = Math.sin(x * (frequency * 1.8) - time * 0.7) * (amplitude * 0.35);
  return baseY + primaryWave + secondaryWave;
}

/**
 * Calculates pointer influence displacement radius for fluid wave refraction interaction.
 * Returns a displacement offset value between 0 and maxDisplacement based on proximity.
 */
export function calculatePointerDistortion(
  x: number,
  y: number,
  pointerX: number,
  pointerY: number,
  radius: number,
  maxDisplacement: number
): number {
  if (radius <= 0) return 0;
  const dx = x - pointerX;
  const dy = y - pointerY;
  const distSq = dx * dx + dy * dy;
  const radiusSq = radius * radius;

  if (distSq >= radiusSq) return 0;

  const dist = Math.sqrt(distSq);
  const factor = 1 - dist / radius;
  // Smoothstep easing for soft fluid deformation
  const smoothFactor = factor * factor * (3 - 2 * factor);
  return smoothFactor * maxDisplacement;
}

/**
 * Interpolates between marine blue and Northern Lights cyan/teal.
 */
export function interpolateAuroraColor(factor: number, isDark: boolean = true): string {
  const clamped = Math.max(0, Math.min(1, factor));

  if (isDark) {
    // Hue ranges from 210 (deep marine) to 170 (aurora cyan)
    const hue = Math.round(210 - clamped * 40);
    const lightness = Math.round(25 + clamped * 30);
    const alpha = (0.25 + clamped * 0.45).toFixed(2);
    return `hsla(${hue}, 85%, ${lightness}%, ${alpha})`;
  } else {
    // Light mode palette
    const hue = Math.round(200 - clamped * 30);
    const lightness = Math.round(45 + clamped * 20);
    const alpha = (0.3 + clamped * 0.4).toFixed(2);
    return `hsla(${hue}, 75%, ${lightness}%, ${alpha})`;
  }
}
