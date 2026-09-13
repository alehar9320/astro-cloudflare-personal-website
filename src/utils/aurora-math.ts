/**
 * Caps device pixel ratio to prevent GPU overhead on high-DPI retina screens.
 *
 * @param dpr - Raw window devicePixelRatio.
 * @returns Clamped device pixel ratio between 1 and 2.
 */
export function clampDpr(dpr: number): number {
  if (isNaN(dpr) || dpr <= 0) return 1;
  return Math.min(Math.max(dpr, 1), 2);
}

/**
 * Calculates compound harmonic wave displacement for fluid aurora motion.
 *
 * @param x - Horizontal coordinate along canvas width.
 * @param time - Current time value in seconds.
 * @param wavelength - Primary wave length multiplier.
 * @param amplitude - Primary wave height amplitude.
 * @param speed - Wave propagation velocity.
 * @returns Calculated vertical offset displacement.
 */
export function calculateHarmonicWave(
  x: number,
  time: number,
  wavelength: number,
  amplitude: number,
  speed: number
): number {
  if (amplitude === 0) return 0;
  const primaryWave = Math.sin(x * wavelength + time * speed) * amplitude;
  const secondaryWave = Math.sin(x * (wavelength * 2.1) - time * (speed * 1.3)) * (amplitude * 0.4);
  const tertiaryWave = Math.cos(x * (wavelength * 0.5) + time * (speed * 0.7)) * (amplitude * 0.2);
  return primaryWave + secondaryWave + tertiaryWave;
}

/**
 * Applies damped vector attraction towards an interactive focus target.
 *
 * @param currentPos - Current x, y position.
 * @param targetPos - Target x, y destination.
 * @param attractionFactor - Attraction strength factor (0-1).
 * @param maxSpeed - Maximum allowable velocity per frame.
 * @returns Bounded position step vector { x, y }.
 */
export function calculateVectorAttraction(
  currentPos: { x: number; y: number },
  targetPos: { x: number; y: number },
  attractionFactor: number,
  maxSpeed: number
): { x: number; y: number } {
  const dx = targetPos.x - currentPos.x;
  const dy = targetPos.y - currentPos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 0.001) {
    return { x: targetPos.x, y: targetPos.y };
  }

  const speed = Math.min(distance * attractionFactor, maxSpeed);
  const vx = (dx / distance) * speed;
  const vy = (dy / distance) * speed;

  return {
    x: currentPos.x + vx,
    y: currentPos.y + vy,
  };
}
