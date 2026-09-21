/**
 * Northern Lights Aurora Wave & Refraction Math Utilities
 * Pure TypeScript functions for HTML5 Canvas mathematical rendering.
 */

/**
 * Calculates cubic smoothstep falloff for pointer-driven light refraction.
 *
 * @param distance - Distance from pointer to canvas node
 * @param radius - Influence radius of the pointer
 * @returns Attenuation factor between 0.0 and 1.0
 */
export function cubicSmoothstep(distance: number, radius: number): number {
  if (radius <= 0 || distance >= radius) {
    return 0;
  }
  if (distance <= 0) {
    return 1;
  }
  const norm = 1 - distance / radius;
  return norm * norm;
}

/**
 * Computes multi-harmonic sine/cosine wave elevation for dynamic aurora curtain movement.
 *
 * @param x - Horizontal position
 * @param y - Vertical position
 * @param time - Current timestamp or frame counter
 * @param frequency - Wave frequency scaling factor (default: 0.01)
 * @param amplitude - Wave peak displacement amplitude (default: 15)
 * @returns Compound displacement value
 */
export function computeAuroraWave(
  x: number,
  y: number,
  time: number,
  frequency = 0.01,
  amplitude = 15
): number {
  const primaryWave = Math.sin(x * frequency + time * 0.002);
  const secondaryWave = Math.cos(y * frequency * 1.5 + time * 0.003) * 0.5;
  const crossHarmonic = Math.sin((x + y) * frequency * 0.8 + time * 0.001) * 0.25;

  return (primaryWave + secondaryWave + crossHarmonic) * amplitude;
}

/**
 * Scales particle/node visual radius based on viewport width to preserve 60fps performance on mobile screens.
 *
 * @param baseRadius - Default particle radius on desktop viewports
 * @param viewportWidth - Current window innerWidth in pixels
 * @returns Scaled node radius
 */
export function scaleParticleRadius(baseRadius: number, viewportWidth: number): number {
  if (viewportWidth < 480) {
    return Math.max(1, baseRadius * 0.6);
  }
  if (viewportWidth < 768) {
    return Math.max(1, baseRadius * 0.8);
  }
  return baseRadius;
}

/**
 * Interpolates between Marine Blue (#0e2a47) and Cyan (#00f2fe) based on wave elevation.
 *
 * @param elevation - Wave intensity normalized value (typically -1.0 to 1.0)
 * @param opacity - Alpha channel value between 0.0 and 1.0
 * @returns CSS hsla color string matching Northern Lights palette
 */
export function calculateAuroraColor(elevation: number, opacity = 1.0): string {
  // Clamp elevation between -1 and 1
  const clampedElevation = Math.max(-1, Math.min(1, elevation));
  const factor = (clampedElevation + 1) / 2; // Map -1..1 to 0..1

  // Marine Blue (Hue ~210, Saturation ~67%, Lightness ~16%)
  // Cyan Light (Hue ~183, Saturation ~100%, Lightness ~50%)
  const hue = 210 + factor * (183 - 210);
  const saturation = 67 + factor * (100 - 67);
  const lightness = 16 + factor * (50 - 16);
  const alpha = Math.max(0, Math.min(1, opacity));

  return `hsla(${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(lightness)}%, ${alpha.toFixed(2)})`;
}
