/**
 * Aurora Canvas Math & Physics Utilities
 * Pure TypeScript math helpers for wave synthesis, cubic smoothstep refraction falloff,
 * Northern Lights color interpolation, and mobile performance scaling.
 */

/**
 * Calculates cubic smoothstep falloff for pointer refraction / light bending.
 * Returns a value between 0 (outside radius) and 1 (at center).
 */
export function cubicSmoothstepFalloff(distance: number, radius: number): number {
  if (radius <= 0 || distance >= radius) return 0;
  if (distance <= 0) return 1;

  const t = Math.max(0, 1 - distance / radius);
  return t * t * (3 - 2 * t);
}

/**
 * Synthesizes multi-harmonic wave heights for Northern Lights ribbons.
 */
export function calculateAuroraWaveHeight(
  x: number,
  time: number,
  wavelength: number = 150,
  amplitude: number = 40
): number {
  if (wavelength <= 0) return 0;

  const k = (2 * Math.PI) / wavelength;
  const wave1 = Math.sin(x * k + time);
  const wave2 = 0.5 * Math.sin(x * k * 2 - time * 1.3);
  const wave3 = 0.25 * Math.cos(x * k * 3.5 + time * 0.7);

  return (wave1 + wave2 + wave3) * amplitude;
}

/**
 * Computes optical point refraction towards/away from an interactive pointer position.
 */
export function calculateRefractedPoint(
  waveX: number,
  waveY: number,
  pointerX: number,
  pointerY: number,
  radius: number = 120,
  maxDisplacement: number = 30
): { x: number; y: number } {
  const dx = waveX - pointerX;
  const dy = waveY - pointerY;
  const distance = Math.hypot(dx, dy);

  if (distance === 0 || distance >= radius) {
    return { x: waveX, y: waveY };
  }

  const falloff = cubicSmoothstepFalloff(distance, radius);
  const nx = dx / distance;
  const ny = dy / distance;

  return {
    x: waveX + nx * falloff * maxDisplacement,
    y: waveY + ny * falloff * maxDisplacement,
  };
}

/**
 * Maps normalized wave intensity (-1 to 1) into Northern Lights RGBA color strings.
 * Marine Blue -> Cyan -> Emerald Green.
 */
export function calculateAuroraColor(normalizedVal: number, alpha: number = 0.8): string {
  const clampedAlpha = Math.max(0, Math.min(1, alpha));
  const t = Math.max(0, Math.min(1, (normalizedVal + 1) / 2));

  let r: number, g: number, b: number;

  if (t < 0.5) {
    // Transition Marine Blue (15, 43, 72) -> Cyan (0, 229, 255)
    const factor = t * 2;
    r = Math.round(15 + (0 - 15) * factor);
    g = Math.round(43 + (229 - 43) * factor);
    b = Math.round(72 + (255 - 72) * factor);
  } else {
    // Transition Cyan (0, 229, 255) -> Emerald Green (16, 185, 129)
    const factor = (t - 0.5) * 2;
    r = Math.round(0 + (16 - 0) * factor);
    g = Math.round(229 + (185 - 229) * factor);
    b = Math.round(255 + (129 - 255) * factor);
  }

  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
}

/**
 * Returns scaling factor for particle density and step sizes on smaller viewports.
 */
export function getMobileScaleFactor(viewportWidth: number, breakpoint: number = 768): number {
  if (viewportWidth <= 0) return 0.5;
  if (viewportWidth >= breakpoint) return 1.0;
  return Math.max(0.4, Number((viewportWidth / breakpoint).toFixed(2)));
}

/**
 * Calculates sampling resolution step size for rendering canvas ribbons at 60fps.
 */
export function calculateParticleStep(viewportWidth: number): number {
  if (viewportWidth < 480) return 8;
  if (viewportWidth < 768) return 6;
  return 4;
}
