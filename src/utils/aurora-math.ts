export interface AuroraWaveParams {
  baseFrequency: number;
  baseAmplitude: number;
  speed: number;
  harmonics?: number;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

const DEFAULT_PARAMS: AuroraWaveParams = {
  baseFrequency: 0.005,
  baseAmplitude: 40,
  speed: 0.001,
  harmonics: 3,
};

/**
 * Calculates wave height displacement at coordinate x and time t using sine wave superposition.
 * Ensures zero allocations inside high-frequency animation loops.
 */
export function calculateAuroraWave(
  x: number,
  time: number,
  params: Partial<AuroraWaveParams> = {}
): number {
  const baseFreq = params.baseFrequency ?? DEFAULT_PARAMS.baseFrequency;
  const baseAmp = params.baseAmplitude ?? DEFAULT_PARAMS.baseAmplitude;
  const speed = params.speed ?? DEFAULT_PARAMS.speed;
  const harmonics = params.harmonics ?? DEFAULT_PARAMS.harmonics ?? 3;

  let y = 0;
  let currentFreq = baseFreq;
  let currentAmp = baseAmp;

  for (let i = 0; i < harmonics; i++) {
    const phaseShift = i * 1.35;
    y += Math.sin(x * currentFreq + time * speed * (i + 1) + phaseShift) * currentAmp;
    currentFreq *= 2.1;
    currentAmp *= 0.45;
  }

  return y;
}

/**
 * Interpolates color between Northern Lights Marine Blue (rgb(10, 25, 47)) and Cyan Glow (rgb(0, 242, 254))
 * based on normalized wave displacement (-1 to 1).
 */
export function refractColor(normalizedDisplacement: number, alpha = 0.8): string {
  // Clamp ratio to [-1, 1] then shift to [0, 1]
  const clamped = Math.max(-1, Math.min(1, normalizedDisplacement));
  const t = (clamped + 1) / 2;

  // Marine Blue: (10, 25, 47) -> Cyan: (0, 242, 254)
  const r = Math.round(10 + (0 - 10) * t);
  const g = Math.round(25 + (242 - 25) * t);
  const b = Math.round(47 + (254 - 47) * t);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
