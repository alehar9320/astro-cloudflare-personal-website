export interface WaveLayer {
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
}

export interface Vector2D {
  dx: number;
  dy: number;
}

export interface RGBAColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
  Calculate sine wave superposition height for a given horizontal position and time step.
 */
export function calculateWaveSuperposition(x: number, time: number, layers: WaveLayer[]): number {
  let total = 0;
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    total += layer.amplitude * Math.sin(x * layer.frequency + time * layer.speed + layer.phase);
  }
  return total;
}

/**
  Calculate magnetosphere vector displacement for point (px, py) relative to cursor (mx, my).
 */
export function calculateMagnetosphereDisplacement(
  px: number,
  py: number,
  mx: number,
  my: number,
  radius: number
): Vector2D {
  const dx = px - mx;
  const dy = py - my;
  const distSq = dx * dx + dy * dy;
  const radiusSq = radius * radius;

  if (distSq >= radiusSq || distSq === 0) {
    return { dx: 0, dy: 0 };
  }

  const dist = Math.sqrt(distSq);
  const factor = (1 - dist / radius) ** 2;
  return {
    dx: (dx / dist) * factor * 25,
    dy: (dy / dist) * factor * 25,
  };
}

/**
  Interpolates Northern Lights palette colors based on normalized wave energy factor [0, 1].
 */
export function interpolateAuroraColor(factor: number): RGBAColor {
  const clamped = Math.max(0, Math.min(1, factor));

  // Keyframes: 0.0 -> Marine, 0.4 -> Cyan, 0.75 -> Electric Cyan, 1.0 -> Aurora Violet
  if (clamped < 0.4) {
    const t = clamped / 0.4;
    return {
      r: Math.round(15 + (6 - 15) * t),
      g: Math.round(23 + (182 - 23) * t),
      b: Math.round(42 + (212 - 42) * t),
      a: Number((0.8 + (0.85 - 0.8) * t).toFixed(2)),
    };
  } else if (clamped < 0.75) {
    const t = (clamped - 0.4) / 0.35;
    return {
      r: Math.round(6 + (34 - 6) * t),
      g: Math.round(182 + (211 - 182) * t),
      b: Math.round(212 + (238 - 212) * t),
      a: Number((0.85 + (0.9 - 0.85) * t).toFixed(2)),
    };
  } else {
    const t = (clamped - 0.75) / 0.25;
    return {
      r: Math.round(34 + (129 - 34) * t),
      g: Math.round(211 + (140 - 211) * t),
      b: Math.round(238 + (248 - 238) * t),
      a: Number((0.9 + (0.85 - 0.9) * t).toFixed(2)),
    };
  }
}

/**
  Format RGBAColor into CSS string format.
 */
export function formatRGBAColor(color: RGBAColor): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
}
