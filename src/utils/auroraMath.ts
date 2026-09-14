/**
 * Pure TypeScript math and physics utilities for Northern Lights canvas effects.
 * Written for performance, zero external dependencies, and 60fps edge runtime execution.
 */

export interface ParticleState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

/**
 * Caps the device pixel ratio to a maximum of 2 to protect performance and GPU memory
 * on high-DPI displays while maintaining high visual crispness.
 */
export function getCappedDpr(windowDpr?: number): number {
  if (typeof windowDpr !== 'number' || isNaN(windowDpr) || windowDpr <= 0) {
    return 1;
  }
  return Math.min(windowDpr, 2);
}

/**
 * Calculates a multi-octave sine/cosine wave offset representing the undulating Northern Lights.
 * Superimposes three harmonic frequencies for organic fluid motion.
 */
export function getAuroraWaveY(
  x: number,
  time: number,
  baseHeight: number,
  amplitude: number,
  frequency: number
): number {
  const octave1 = Math.sin(x * frequency + time) * amplitude;
  const octave2 = Math.cos(x * frequency * 2.3 + time * 1.4) * (amplitude * 0.4);
  const octave3 = Math.sin(x * frequency * 0.5 + time * 0.7) * (amplitude * 0.25);
  return baseHeight + octave1 + octave2 + octave3;
}

/**
 * Updates a particle's position and velocity with pointer attraction vector forces and damping.
 */
export function updateParticlePosition(
  x: number,
  y: number,
  vx: number,
  vy: number,
  pointerX: number | null,
  pointerY: number | null,
  damping = 0.95,
  attractionStrength = 0.05
): { x: number; y: number; vx: number; vy: number } {
  let newVx = vx * damping;
  let newVy = vy * damping;

  if (pointerX !== null && pointerY !== null) {
    const dx = pointerX - x;
    const dy = pointerY - y;
    const distSq = dx * dx + dy * dy;

    // Apply attraction force within a max interaction radius of 200px
    if (distSq > 1 && distSq < 40000) {
      const dist = Math.sqrt(distSq);
      const force = (1 - dist / 200) * attractionStrength;
      newVx += (dx / dist) * force * 5;
      newVy += (dy / dist) * force * 5;
    }
  }

  return {
    x: x + newVx,
    y: y + newVy,
    vx: newVx,
    vy: newVy,
  };
}

/**
 * Calculates Snell's Law light refraction angle given an incident angle and refractive index ratio.
 * Handled with total internal reflection guarding.
 */
export function calculateRefractionAngle(incidentAngle: number, eta: number): number {
  const sinT2 = eta * eta * (1 - Math.cos(incidentAngle) * Math.cos(incidentAngle));
  if (sinT2 > 1) {
    // Total internal reflection: return inverse angle
    return -incidentAngle;
  }
  return Math.asin(eta * Math.sin(incidentAngle));
}
