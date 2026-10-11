/**
 * Pure math utilities for interactive Northern Lights (Aurora) light refractions and canvas rendering.
 * Hand-crafted for 60fps canvas animation and vector displacement without external dependencies.
 */

export interface Vector2D {
  x: number;
  y: number;
}

export interface RefractionResult {
  dx: number;
  dy: number;
  factor: number;
}

/**
 * Calculates harmonic sine wave superposition for realistic organic aurora curtain motion.
 */
export function calculateAuroraWave(
  x: number,
  time: number,
  amplitude: number = 30,
  frequency: number = 0.008,
  speed: number = 0.0015
): number {
  const primaryWave = Math.sin(x * frequency + time * speed) * amplitude;
  const secondaryWave = Math.sin(x * frequency * 2.3 - time * speed * 1.7) * (amplitude * 0.4);
  const harmonicWave = Math.cos(x * frequency * 0.5 + time * speed * 0.8) * (amplitude * 0.25);

  return primaryWave + secondaryWave + harmonicWave;
}

/**
 * Calculates light refraction vector displacement caused by interactive pointer position.
 * Returns dx, dy displacement offsets and a 0..1 proximity factor.
 */
export function calculatePointerRefraction(
  px: number,
  py: number,
  pointerX: number,
  pointerY: number,
  radius: number = 180,
  strength: number = 25
): RefractionResult {
  const diffX = px - pointerX;
  const diffY = py - pointerY;
  const distanceSq = diffX * diffX + diffY * diffY;
  const radiusSq = radius * radius;

  if (distanceSq >= radiusSq || distanceSq === 0) {
    return { dx: 0, dy: 0, factor: 0 };
  }

  const distance = Math.sqrt(distanceSq);
  const factor = 1 - distance / radius;
  // Smooth gaussian-like falloff curve: factor^2
  const smoothFactor = factor * factor;

  const nx = diffX / distance;
  const ny = diffY / distance;

  return {
    dx: nx * smoothFactor * strength,
    dy: ny * smoothFactor * strength,
    factor: smoothFactor,
  };
}

/**
 * Interpolates color along the Northern Lights color spectrum:
 * Marine Blue -> Deep Teal -> Vibrant Cyan -> Aurora Emerald
 */
export function getAuroraColor(energyRatio: number, isDarkTheme: boolean = true): string {
  const clamped = Math.max(0, Math.min(1, energyRatio));

  if (isDarkTheme) {
    // Dark mode spectrum: Deep marine -> Cyan -> Light Emerald
    if (clamped < 0.35) {
      // #020b18 to #004052
      const t = clamped / 0.35;
      const r = Math.round(2 + (0 - 2) * t);
      const g = Math.round(11 + (64 - 11) * t);
      const b = Math.round(24 + (82 - 24) * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (clamped < 0.75) {
      // #004052 to #00f2fe
      const t = (clamped - 0.35) / 0.4;
      const r = 0;
      const g = Math.round(64 + (242 - 64) * t);
      const b = Math.round(82 + (254 - 82) * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // #00f2fe to #00ffa3
      const t = (clamped - 0.75) / 0.25;
      const r = 0;
      const g = Math.round(242 + (255 - 242) * t);
      const b = Math.round(254 + (163 - 254) * t);
      return `rgb(${r}, ${g}, ${b})`;
    }
  } else {
    // Light mode spectrum: Soft Cyan/Teal -> Marine Accent
    if (clamped < 0.5) {
      const t = clamped / 0.5;
      const r = Math.round(180 + (0 - 180) * t);
      const g = Math.round(235 + (180 - 235) * t);
      const b = Math.round(250 + (220 - 250) * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      const t = (clamped - 0.5) / 0.5;
      const r = 0;
      const g = Math.round(180 + (120 - 180) * t);
      const b = Math.round(220 + (180 - 220) * t);
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
}
