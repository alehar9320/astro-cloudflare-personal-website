/**
 * Calculates the vertical Y coordinate of an aurora wave point based on sine math.
 *
 * @param x - The horizontal position along the canvas.
 * @param time - The current frame time counter.
 * @param amplitude - The peak height of the wave.
 * @param frequency - The spatial density/frequency of wave peaks.
 * @param speed - The temporal velocity of the wave.
 * @param phase - The wave phase offset.
 * @param baseLine - The vertical center line of the wave container.
 * @returns The calculated Y pixel coordinate.
 */
export function calculateWaveY(
  x: number,
  time: number,
  amplitude: number,
  frequency: number,
  speed: number,
  phase: number,
  baseLine: number
): number {
  return Math.sin(x * frequency + time * speed + phase) * amplitude + baseLine;
}
