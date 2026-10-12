export interface WaveLayer {
  amplitude: number;
  frequency: number;
  speed: number;
  phase: number;
}

export interface RefractionVector {
  dx: number;
  dy: number;
  intensity: number;
}

export interface ColorRGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Northern Lights color stops for smooth interpolation:
 * 0.0 -> Deep Marine Blue (0, 21, 41)
 * 0.35 -> Northern Cyan (0, 229, 255)
 * 0.70 -> Emerald Teal (0, 255, 213)
 * 1.00 -> Translucent Aurora Violet (107, 33, 168)
 */
const COLOR_STOPS: { pos: number; color: ColorRGBA }[] = [
  { pos: 0.0, color: { r: 0, g: 21, b: 41, a: 0.85 } },
  { pos: 0.35, color: { r: 0, g: 229, b: 255, a: 0.75 } },
  { pos: 0.7, color: { r: 0, g: 255, b: 213, a: 0.65 } },
  { pos: 1.0, color: { r: 107, g: 33, b: 168, a: 0.5 } },
];

/**
 * Calculates superimposed sine wave height for a given position and time step.
 */
export function calculateWaveHeight(x: number, time: number, layers: WaveLayer[]): number {
  if (layers.length === 0) return 0;
  let totalHeight = 0;
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    totalHeight +=
      Math.sin(x * layer.frequency + time * layer.speed + layer.phase) * layer.amplitude;
  }
  return totalHeight;
}

/**
 * Calculates smooth vector refraction displacement from a point toward mouse position
 * with quadratic distance falloff.
 */
export function calculateRefractionVector(
  mouseX: number,
  mouseY: number,
  pointX: number,
  pointY: number,
  maxRadius: number
): RefractionVector {
  if (maxRadius <= 0) {
    return { dx: 0, dy: 0, intensity: 0 };
  }

  const deltaX = mouseX - pointX;
  const deltaY = mouseY - pointY;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance >= maxRadius || distance === 0) {
    return { dx: 0, dy: 0, intensity: 0 };
  }

  // Smooth quadratic falloff curve: (1 - (dist / maxRadius))^2
  const normalizedDist = distance / maxRadius;
  const intensity = Math.pow(1 - normalizedDist, 2);

  return {
    dx: (deltaX / distance) * intensity * 24,
    dy: (deltaY / distance) * intensity * 24,
    intensity,
  };
}

/**
 * Interpolates color across the Northern Lights gradient color palette.
 */
export function interpolateAuroraColor(t: number): ColorRGBA {
  // Clamp parameter between 0 and 1
  const clampedT = Math.max(0, Math.min(1, t));

  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    const start = COLOR_STOPS[i];
    const end = COLOR_STOPS[i + 1];

    if (clampedT >= start.pos && clampedT <= end.pos) {
      const range = end.pos - start.pos;
      const localT = range === 0 ? 0 : (clampedT - start.pos) / range;

      return {
        r: Math.round(start.color.r + (end.color.r - start.color.r) * localT),
        g: Math.round(start.color.g + (end.color.g - start.color.g) * localT),
        b: Math.round(start.color.b + (end.color.b - start.color.b) * localT),
        a: Number((start.color.a + (end.color.a - start.color.a) * localT).toFixed(3)),
      };
    }
  }

  return COLOR_STOPS[COLOR_STOPS.length - 1].color;
}

/**
 * Converts ColorRGBA object to css rgba() string representation.
 */
export function colorToRgbaString(color: ColorRGBA): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
}
