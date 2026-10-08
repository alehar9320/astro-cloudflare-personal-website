export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  size: number;
  colorIndex: number;
}

/**
 * Northern Lights color palette definitions (Marine Blue, Cyan, Aurora Green/Teal, Deep Navy).
 */
export const AURORA_COLORS = [
  '0, 210, 255', // Cyan / Light Blue
  '58, 123, 213', // Marine Blue
  '0, 242, 254', // Cyan Glint
  '79, 172, 254', // Electric Sky
  '10, 25, 47', // Deep Navy
] as const;

/**
 * Calculates multi-wave superposition value for sine/cosine wave animation.
 */
export function calculateAuroraWave(
  x: number,
  time: number,
  wavelength: number,
  amplitude: number,
  speed: number,
  phase: number
): number {
  const w = Math.max(0.0001, wavelength);
  const primaryWave = Math.sin(x * w + time * speed + phase) * amplitude;
  const secondaryWave =
    Math.cos(x * w * 1.5 - time * speed * 0.8 + phase * 0.5) * (amplitude * 0.5);
  return primaryWave + secondaryWave;
}

/**
 * Dynamic spatial step sampling based on viewport width to prevent GC thrashing and ensure 60fps frame rates.
 */
export function computeSpatialStep(viewportWidth: number): number {
  if (viewportWidth <= 0) return 4;
  return Math.max(4, Math.floor(viewportWidth / 120));
}

/**
 * Pre-allocates a pool of particles to avoid runtime allocations in the animation loop.
 */
export function createParticlePool(count: number, width: number, height: number): Particle[] {
  const safeCount = Math.max(1, count);
  const safeWidth = Math.max(1, width);
  const safeHeight = Math.max(1, height);
  const particles: Particle[] = new Array(safeCount);

  for (let i = 0; i < safeCount; i++) {
    const baseX = Math.random() * safeWidth;
    const baseY = Math.random() * safeHeight;
    particles[i] = {
      x: baseX,
      y: baseY,
      vx: 0,
      vy: 0,
      baseX,
      baseY,
      size: 1.5 + Math.random() * 2.5,
      colorIndex: i % AURORA_COLORS.length,
    };
  }

  return particles;
}

/**
 * In-place particle state update function with velocity damping and spring restoration force.
 */
export function updateParticlePositions(
  particles: Particle[],
  cursor: { x: number; y: number; active: boolean },
  width: number,
  height: number,
  speedMultiplier: number = 1.0
): void {
  const safeSpeed = Math.max(0.1, speedMultiplier);
  const damping = 0.92;
  const springStiffness = 0.02 * safeSpeed;
  const repulsionRadius = 120;
  const repulsionStrength = 1.5 * safeSpeed;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // Spring force back to base coordinates
    const dxBase = p.baseX - p.x;
    const dyBase = p.baseY - p.y;
    p.vx += dxBase * springStiffness;
    p.vy += dyBase * springStiffness;

    // Repulsion force from cursor when active inside canvas bounds
    if (cursor.active) {
      const dxCursor = p.x - cursor.x;
      const dyCursor = p.y - cursor.y;
      const distSq = dxCursor * dxCursor + dyCursor * dyCursor;

      if (distSq < repulsionRadius * repulsionRadius && distSq > 0.001) {
        const dist = Math.sqrt(distSq);
        const force = ((repulsionRadius - dist) / repulsionRadius) * repulsionStrength;
        p.vx += (dxCursor / dist) * force;
        p.vy += (dyCursor / dist) * force;
      }
    }

    // Apply damping and integrate position
    p.vx *= damping;
    p.vy *= damping;
    p.x += p.vx;
    p.y += p.vy;

    // Keep particles within viewport boundaries
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
  }
}

/**
 * Returns formatted hsla/rgba string for Northern Lights rendering.
 */
export function getNorthernLightsColor(colorIndex: number, alpha: number = 1.0): string {
  const clampedAlpha = Math.max(0, Math.min(1, alpha));
  const idx = Math.abs(Math.floor(colorIndex)) % AURORA_COLORS.length;
  const rgb = AURORA_COLORS[idx];
  return `rgba(${rgb}, ${clampedAlpha})`;
}
