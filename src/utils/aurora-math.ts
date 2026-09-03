/**
 * Pure TypeScript math and particle physics utilities for Northern Lights (Aurora) animations.
 * Zero external dependencies. Designed for 60fps canvas calculations.
 */

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  hue: number; // 140 (emerald) to 200 (cyan/marine) or 260 (violet)
  baseAlpha: number;
}

export interface MouseState {
  x: number;
  y: number;
  active: boolean;
}

/**
 * Calculates a multi-frequency sine wave offset for a given x coordinate and time.
 * Combines 3 harmonic sine functions to create natural organic fluid motion.
 */
export function calculateAuroraWave(
  x: number,
  width: number,
  time: number,
  layerOffset: number = 0
): number {
  const normX = (x / (width || 1)) * Math.PI * 2;
  const wave1 = Math.sin(normX * 1.5 + time * 0.8 + layerOffset);
  const wave2 = Math.sin(normX * 3.0 - time * 0.5 + layerOffset * 1.3) * 0.5;
  const wave3 = Math.cos(normX * 0.8 + time * 1.2 + layerOffset * 0.7) * 0.25;

  return wave1 + wave2 + wave3;
}

/**
 * Updates a particle's position and velocity with soft boundary wrapping
 * and gentle mouse/touch vector field repulsion/attraction.
 */
export function updateParticle(
  particle: Particle,
  width: number,
  height: number,
  mouse: MouseState | null
): void {
  // Drift velocity
  particle.x += particle.vx;
  particle.y += particle.vy;

  // Gentle mouse interaction
  if (mouse && mouse.active) {
    const dx = mouse.x - particle.x;
    const dy = mouse.y - particle.y;
    const distSq = dx * dx + dy * dy;
    const maxDist = 120;
    const maxDistSq = maxDist * maxDist;

    if (distSq < maxDistSq && distSq > 1) {
      const dist = Math.sqrt(distSq);
      const force = (1 - dist / maxDist) * 0.35;
      particle.vx -= (dx / dist) * force;
      particle.vy -= (dy / dist) * force;
    }
  }

  // Damping velocity back towards ambient drift
  particle.vx *= 0.98;
  particle.vy *= 0.98;

  // Wrap around canvas bounds seamlessly
  if (particle.x < -10) particle.x = width + 10;
  if (particle.x > width + 10) particle.x = -10;
  if (particle.y < -10) particle.y = height + 10;
  if (particle.y > height + 10) particle.y = -10;
}

/**
 * Creates an initial array of particles configured for the Northern Lights color space.
 */
export function createAuroraParticles(count: number, width: number, height: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const baseAlpha = 0.2 + Math.random() * 0.6;
    // Northern Lights palette: Emerald (150) -> Cyan (185) -> Marine/Violet (220-250)
    const hueChoice = Math.random();
    let hue = 185; // Cyan
    if (hueChoice < 0.4) {
      hue = 150 + Math.random() * 20; // Emerald
    } else if (hueChoice > 0.8) {
      hue = 230 + Math.random() * 30; // Violet/Marine
    } else {
      hue = 175 + Math.random() * 20; // Cyan
    }

    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.4 - 0.2, // Slight upward drift
      radius: 1.5 + Math.random() * 2.5,
      alpha: baseAlpha,
      baseAlpha,
      hue,
    });
  }
  return particles;
}

/**
 * Converts a ratio [0..1] to an HSL Northern Lights string with alpha transparency.
 */
export function getAuroraColor(ratio: number, alpha: number = 1.0): string {
  const clampedRatio = Math.max(0, Math.min(1, ratio));
  // Interpolate hue from Emerald (140) through Cyan (190) to Marine/Violet (250)
  const hue = 140 + clampedRatio * 110;
  return `hsla(${Math.round(hue)}, 85%, 60%, ${alpha.toFixed(2)})`;
}
