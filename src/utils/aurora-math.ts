/**
 * Native math utilities for interactive HTML5 Canvas animations ("Northern Lights" wave & light refraction).
 */

/**
 * Calculates cubic smoothstep attenuation factor for distance-based falloff.
 * Returns a value between 0.0 (at or beyond radius) and 1.0 (at origin).
 */
export function cubicSmoothstep(distance: number, radius: number): number {
  if (radius <= 0 || distance >= radius) return 0;
  if (distance <= 0) return 1;
  const normalized = 1 - distance / radius;
  return Math.max(0, Math.min(1, normalized * normalized * (3 - 2 * normalized)));
}

/**
 * Calculates multi-harmonic wave Y offset for organic Northern Lights curtain motion.
 */
export function calculateAuroraWaveHeight(
  x: number,
  time: number,
  wavelength: number,
  amplitude: number,
  speed: number = 1.0,
  harmonics: number = 3
): number {
  if (wavelength <= 0) return 0;
  let wave = 0;
  let currentFreq = 1 / wavelength;
  let currentAmp = amplitude;

  for (let i = 1; i <= harmonics; i++) {
    const phaseShift = time * speed * 0.001 * i;
    wave += Math.sin((x * currentFreq + phaseShift) * Math.PI * 2) * currentAmp;
    currentFreq *= 1.8;
    currentAmp *= 0.45;
  }

  return wave;
}

/**
 * Calculates pointer-driven refraction displacement offset based on distance.
 */
export function calculateRefractionOffset(
  pointerX: number,
  pointerY: number,
  targetX: number,
  targetY: number,
  radius: number,
  maxDisplacement: number
): { dx: number; dy: number } {
  const diffX = targetX - pointerX;
  const diffY = targetY - pointerY;
  const dist = Math.hypot(diffX, diffY);

  if (dist <= 0 || dist >= radius) {
    return { dx: 0, dy: 0 };
  }

  const factor = cubicSmoothstep(dist, radius);
  const displacement = factor * maxDisplacement;

  return {
    dx: (diffX / dist) * displacement,
    dy: (diffY / dist) * displacement,
  };
}
