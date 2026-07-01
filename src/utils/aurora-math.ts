/**
 * Aurora Math Utilities
 *
 * Provides mathematical functions for generating fluid, "Northern Lights" style
 * animations using sine waves and frequency modulation.
 */

export interface AuroraWave {
  y: number;
  length: number;
  amplitude: number;
  frequency: number;
  phase: number;
  color: string;
  speed: number;
  opacity: number;
}

/**
 * Creates a set of wave parameters for the aurora effect.
 */
export function createAuroraWaves(width: number, height: number): AuroraWave[] {
  return [
    {
      y: height * 0.3,
      length: width * 0.8,
      amplitude: 60,
      frequency: 0.002,
      phase: 0,
      color: 'rgba(0, 210, 255, 0.4)', // accent-light
      speed: 0.01,
      opacity: 0.5,
    },
    {
      y: height * 0.4,
      length: width * 1.2,
      amplitude: 80,
      frequency: 0.0015,
      phase: Math.PI / 4,
      color: 'rgba(0, 102, 204, 0.3)', // accent-regular
      speed: 0.008,
      opacity: 0.4,
    },
    {
      y: height * 0.35,
      length: width * 1.5,
      amplitude: 100,
      frequency: 0.001,
      phase: Math.PI / 2,
      color: 'rgba(0, 34, 102, 0.2)', // accent-dark
      speed: 0.005,
      opacity: 0.3,
    },
  ];
}

/**
 * Calculates the Y position of a wave at a given X coordinate.
 */
export function calculateWaveY(x: number, wave: AuroraWave, time: number): number {
  return (
    wave.y +
    Math.sin(x * wave.frequency + wave.phase + time * wave.speed) * wave.amplitude +
    Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 0.3) * (wave.amplitude * 0.5)
  );
}

/**
 * Draws a single aurora wave on a canvas context.
 */
export function drawAuroraWave(
  ctx: CanvasRenderingContext2D,
  wave: AuroraWave,
  width: number,
  height: number,
  time: number
) {
  ctx.beginPath();
  ctx.moveTo(0, height);

  for (let x = 0; x <= width; x += 5) {
    const y = calculateWaveY(x, wave, time);
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.lineTo(width, height);
  ctx.lineTo(0, height);

  const gradient = ctx.createLinearGradient(0, wave.y - wave.amplitude, 0, height);
  gradient.addColorStop(0, wave.color);
  gradient.addColorStop(1, 'transparent');

  ctx.fillStyle = gradient;
  ctx.globalAlpha = wave.opacity;
  ctx.fill();
  ctx.globalAlpha = 1.0;
}
