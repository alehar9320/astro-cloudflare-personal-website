/**
 * Mathematical utilities for Northern Lights canvas rendering and pointer refraction.
 */

export interface WaveParams {
  amplitude: number;
  frequency: number;
  phase: number;
  speed: number;
}

export interface RefractionOffset {
  dx: number;
  dy: number;
  factor: number;
}

/**
 * Calculates multi-harmonic sine wave height at position x and time t.
 * Combines primary wave with secondary harmonic for natural fluid motion.
 */
export function calculateWaveY(x: number, time: number, wave: WaveParams): number {
  const primary = Math.sin(x * wave.frequency + time * wave.speed + wave.phase);
  const harmonic = Math.cos(x * wave.frequency * 1.5 - time * wave.speed * 0.8 + wave.phase) * 0.35;
  return (primary + harmonic) * wave.amplitude;
}

/**
 * Calculates pointer displacement with cubic smoothstep attenuation (1 - d/r)^2.
 * Renders optical refraction without expensive physics engines or dynamic allocations.
 */
export function calculatePointerRefraction(
  px: number,
  py: number,
  pointerX: number,
  pointerY: number,
  radius: number
): RefractionOffset {
  if (radius <= 0) {
    return { dx: 0, dy: 0, factor: 0 };
  }

  const distX = px - pointerX;
  const distY = py - pointerY;
  const distSq = distX * distX + distY * distY;
  const radiusSq = radius * radius;

  if (distSq >= radiusSq || distSq === 0) {
    return { dx: 0, dy: 0, factor: 0 };
  }

  const dist = Math.sqrt(distSq);
  // Cubic smoothstep falloff: (1 - d/r)^2
  const normalized = 1 - dist / radius;
  const factor = normalized * normalized;

  // Normalized directional vector scaled by smoothstep factor and max displacement
  const maxDisplacement = radius * 0.4;
  const dx = (distX / dist) * factor * maxDisplacement;
  const dy = (distY / dist) * factor * maxDisplacement;

  return { dx, dy, factor };
}

/**
 * Dynamically samples spatial step interval based on viewport width.
 * Prevents garbage collection thrashing and maintains 60fps across viewports.
 */
export function calculateAdaptiveStep(viewportWidth: number): number {
  if (viewportWidth <= 0) return 4;
  return Math.max(4, Math.floor(viewportWidth / 120));
}

/**
 * Returns color stops for Northern Lights palette gradients.
 */
export function getAuroraColors(isDarkTheme = true): {
  cyan: string;
  emerald: string;
  marine: string;
  glow: string;
} {
  if (isDarkTheme) {
    return {
      cyan: 'rgba(0, 242, 254, 0.75)',
      emerald: 'rgba(0, 245, 212, 0.65)',
      marine: 'rgba(13, 27, 42, 0.85)',
      glow: 'rgba(79, 172, 254, 0.4)',
    };
  }
  return {
    cyan: 'rgba(0, 180, 216, 0.6)',
    emerald: 'rgba(0, 150, 199, 0.5)',
    marine: 'rgba(224, 251, 252, 0.7)',
    glow: 'rgba(72, 202, 228, 0.35)',
  };
}
