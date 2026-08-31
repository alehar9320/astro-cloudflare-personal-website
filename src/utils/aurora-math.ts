/**
 * Pure math and physics utilities for Northern Lights canvas light refraction ribbons.
 * Designed for 60fps interactive animations without external dependencies.
 */

export interface WaveParameters {
  frequency: number;
  amplitude: number;
  speed: number;
  phase: number;
  harmonics?: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface RefractionVector {
  dx: number;
  dy: number;
  distance: number;
  intensity: number;
}

export interface AdaptiveQualityConfig {
  pixelRatio: number;
  layerCount: number;
  stepSize: number;
}

/**
 * Calculates multi-harmonic sine wave height displacement at a given x position and time t.
 */
export function calculateAuroraWaveHeight(x: number, t: number, params: WaveParameters): number {
  const { frequency, amplitude, speed, phase, harmonics = 2 } = params;
  const baseTime = t * speed + phase;

  let displacement = Math.sin(x * frequency + baseTime) * amplitude;

  if (harmonics >= 2) {
    displacement += Math.sin(x * frequency * 2.1 + baseTime * 1.3) * (amplitude * 0.35);
  }

  if (harmonics >= 3) {
    displacement += Math.sin(x * frequency * 4.3 - baseTime * 0.7) * (amplitude * 0.15);
  }

  return displacement;
}

/**
 * Calculates vector refraction displacement towards or away from an interactive pointer position.
 */
export function calculateRefractionOffset(
  pointer: Point2D | null,
  wavePoint: Point2D,
  maxRadius: number = 200,
  maxStrength: number = 30
): RefractionVector {
  if (!pointer) {
    return { dx: 0, dy: 0, distance: Infinity, intensity: 0 };
  }

  const dx = wavePoint.x - pointer.x;
  const dy = wavePoint.y - pointer.y;
  const distSq = dx * dx + dy * dy;
  const maxRadiusSq = maxRadius * maxRadius;

  if (distSq >= maxRadiusSq || distSq === 0) {
    return { dx: 0, dy: 0, distance: Math.sqrt(distSq), intensity: 0 };
  }

  const distance = Math.sqrt(distSq);
  // Smooth gaussian-like curve for natural light refraction effect
  const factor = Math.exp(-distSq / (2 * (maxRadius * 0.4) * (maxRadius * 0.4)));
  const intensity = factor;

  // Normalized direction * refraction strength
  const angle = Math.atan2(dy, dx);
  const refractionDx = Math.cos(angle) * maxStrength * intensity;
  const refractionDy = Math.sin(angle) * maxStrength * intensity;

  return {
    dx: refractionDx,
    dy: refractionDy,
    distance,
    intensity,
  };
}

/**
 * Interpolates between Northern Lights marine cyan, emerald, and deep blue palette colors.
 * @param factor Value between 0.0 and 1.0 representing height or wave position
 * @param alpha Opacity value between 0.0 and 1.0
 */
export function interpolateAuroraColor(factor: number, alpha: number = 0.8): string {
  const clampedFactor = Math.max(0, Math.min(1, factor));
  const clampedAlpha = Math.max(0, Math.min(1, alpha));

  // Northern Lights Palette:
  // 0.0 -> Marine Blue (10, 32, 64)
  // 0.5 -> Deep Cyan (0, 180, 200)
  // 1.0 -> Emerald Teal (40, 230, 180)

  let r: number, g: number, b: number;

  if (clampedFactor <= 0.5) {
    const t = clampedFactor * 2; // 0..1
    r = Math.round(10 + (0 - 10) * t);
    g = Math.round(32 + (180 - 32) * t);
    b = Math.round(64 + (200 - 64) * t);
  } else {
    const t = (clampedFactor - 0.5) * 2; // 0..1
    r = Math.round(0 + (40 - 0) * t);
    g = Math.round(180 + (230 - 180) * t);
    b = Math.round(200 + (180 - 200) * t);
  }

  return `rgba(${r}, ${g}, ${b}, ${clampedAlpha.toFixed(2)})`;
}

/**
 * Calculates adaptive quality configurations (resolution scale, layer count, and step size)
 * based on viewport dimensions and observed average FPS.
 */
export function getAdaptiveCanvasQuality(
  viewportWidth: number,
  averageFps: number = 60,
  devicePixelRatio: number = 1
): AdaptiveQualityConfig {
  const isMobile = viewportWidth < 640;
  const isLowPower = averageFps < 45;

  let pixelRatio = Math.min(devicePixelRatio, 2);
  let layerCount = 4;
  let stepSize = 4;

  if (isMobile || isLowPower) {
    pixelRatio = Math.min(pixelRatio, 1.25);
    layerCount = 2;
    stepSize = 8;
  } else if (viewportWidth < 1024) {
    layerCount = 3;
    stepSize = 5;
  }

  if (averageFps < 30) {
    pixelRatio = 1.0;
    layerCount = 2;
    stepSize = 10;
  }

  return { pixelRatio, layerCount, stepSize };
}
