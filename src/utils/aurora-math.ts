/**
 * Mathematical utilities for Northern Lights Aurora canvas interactive rendering.
 * Pure TypeScript, zero external dependencies, 60fps optimized.
 */

export interface AuroraPalette {
  name: string;
  background: string;
  stops: string[];
}

export const AURORA_PALETTES: Record<string, AuroraPalette> = {
  arctic: {
    name: 'Arctic Aurora',
    background: '#090d16',
    stops: ['#00f5d4', '#00b4d8', '#7b2cbf', '#03045e'],
  },
  cyanShimmer: {
    name: 'Cyan Shimmer',
    background: '#041019',
    stops: ['#70e000', '#38b000', '#0077b6', '#03045e'],
  },
  deepBorealis: {
    name: 'Deep Borealis',
    background: '#0d1b2a',
    stops: ['#48cae4', '#5390d9', '#64dfdf', '#1b263b'],
  },
};

/**
 * Linearly interpolates between start and end by amt [0..1].
 */
export function lerp(start: number, end: number, amt: number): number {
  return start + (end - start) * Math.max(0, Math.min(1, amt));
}

/**
 * Calculates multi-layered sine wave superposition for smooth organic fluid motion.
 * @param x Horizontal position coordinate
 * @param t Time variable (seconds or frame ticks)
 * @param baseFreq Base wave frequency modifier (default 0.005)
 * @param baseAmp Base wave amplitude (default 30)
 */
export function calculateSineSuperposition(
  x: number,
  t: number,
  baseFreq = 0.005,
  baseAmp = 30
): number {
  const wave1 = Math.sin(x * baseFreq + t * 0.8) * baseAmp;
  const wave2 = Math.sin(x * baseFreq * 2.3 + t * 1.2) * (baseAmp * 0.45);
  const wave3 = Math.cos(x * baseFreq * 0.7 - t * 0.5) * (baseAmp * 0.25);
  return wave1 + wave2 + wave3;
}

/**
 * Calculates magnetosphere force and displacement vectors relative to cursor/touch target.
 */
export function calculateMagnetosphereVector(
  x: number,
  y: number,
  mouseX: number,
  mouseY: number,
  maxRadius = 180,
  force = 45
): { dx: number; dy: number; dist: number; influence: number } {
  const deltaX = x - mouseX;
  const deltaY = y - mouseY;
  const distSq = deltaX * deltaX + deltaY * deltaY;
  const maxRadiusSq = maxRadius * maxRadius;

  if (distSq >= maxRadiusSq || distSq === 0) {
    return { dx: 0, dy: 0, dist: Math.sqrt(distSq), influence: 0 };
  }

  const dist = Math.sqrt(distSq);
  const influence = Math.pow(1 - dist / maxRadius, 2);
  const pushX = (deltaX / dist) * force * influence;
  const pushY = (deltaY / dist) * force * influence;

  return { dx: pushX, dy: pushY, dist, influence };
}

/**
 * Helper to retrieve a safe palette choice by key or cycle index.
 */
export function getAuroraPalette(keyOrIndex: string | number): AuroraPalette {
  const keys = Object.keys(AURORA_PALETTES);
  if (typeof keyOrIndex === 'number') {
    const idx = Math.abs(Math.floor(keyOrIndex)) % keys.length;
    return AURORA_PALETTES[keys[idx]];
  }
  return AURORA_PALETTES[keyOrIndex] || AURORA_PALETTES.arctic;
}
