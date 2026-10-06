/**
 * Aurora Math Utilities for Northern Lights Canvas Simulation
 * Pure, side-effect-free math helper functions for canvas rendering loops.
 */

export interface WaveParams {
  frequency: number;
  amplitude: number;
  speed: number;
  phaseShift: number;
  verticalOffset: number;
}

/**
 * Calculates the Y coordinate of a sine wave synthesized from wave parameters and time.
 */
export function calculateWaveY(x: number, time: number, params: WaveParams): number {
  const { frequency, amplitude, speed, phaseShift, verticalOffset } = params;
  return verticalOffset + Math.sin(x * frequency + time * speed + phaseShift) * amplitude;
}

/**
 * Calculates dynamic spatial sampling step size based on viewport width.
 * Higher viewport widths use larger spatial steps to cap vertex evaluation overhead.
 * Maintains 60fps performance across mobile and high-DPI desktop viewports.
 */
export function getSpatialStep(viewportWidth: number): number {
  if (viewportWidth <= 0) return 4;
  return Math.max(4, Math.floor(viewportWidth / 120));
}

export interface RefractionOffset {
  dx: number;
  dy: number;
}

/**
 * Calculates interactive light refraction offset when user cursor/touch is near wave vertex.
 * Uses inverse distance decay for smooth repulsion/refraction micro-interactions.
 */
export function calculateRefractionOffset(
  mouseX: number | null,
  mouseY: number | null,
  waveX: number,
  waveY: number,
  maxRadius = 150,
  maxDisplacement = 25
): RefractionOffset {
  if (mouseX === null || mouseY === null) {
    return { dx: 0, dy: 0 };
  }

  const deltaX = waveX - mouseX;
  const deltaY = waveY - mouseY;
  const distanceSquared = deltaX * deltaX + deltaY * deltaY;
  const maxRadiusSquared = maxRadius * maxRadius;

  if (distanceSquared >= maxRadiusSquared || distanceSquared === 0) {
    return { dx: 0, dy: 0 };
  }

  const distance = Math.sqrt(distanceSquared);
  const factor = (1 - distance / maxRadius) * maxDisplacement;

  return {
    dx: (deltaX / distance) * factor,
    dy: (deltaY / distance) * factor,
  };
}
