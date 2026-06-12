/**
 * Pure TypeScript utility for Aurora mathematical simulations.
 * Uses a combination of multiple sine waves to create fluid, non-repetitive motion.
 */

export interface AuroraWave {
  y: number;
  opacity: number;
  color: string;
}

/**
 * Calculates a point on an Aurora wave.
 * @param x The horizontal position
 * @param time The elapsed time
 * @param index The wave index (to offset waves)
 * @param height The canvas height
 * @returns The vertical position (y)
 */
export const calculateAuroraPoint = (
  x: number,
  time: number,
  index: number,
  height: number
): number => {
  const baseLine = height * 0.4 + index * 30; // Stagger waves vertically

  // Combine three sine waves with different frequencies and amplitudes
  const wave1 = Math.sin(x * 0.0015 + time * 0.8 + index) * 60;
  const wave2 = Math.sin(x * 0.003 - time * 0.5 + index * 2) * 35;
  const wave3 = Math.sin(x * 0.008 + time * 0.3) * 15;

  // Add some vertical drift based on time
  const drift = Math.sin(time * 0.2 + index) * 20;

  return baseLine + wave1 + wave2 + wave3 + drift;
};

/**
 * Returns the color palette for the Aurora waves.
 * Maps to Alexander Härenstam's "Northern Lights" theme.
 */
export const getAuroraColors = (isDark: boolean = true) => {
  if (isDark) {
    return [
      'rgba(0, 210, 255, 0.35)', // --accent-light
      'rgba(0, 102, 204, 0.25)', // --accent-regular
      'rgba(0, 34, 102, 0.15)', // --accent-dark
    ];
  }
  return [
    'rgba(0, 102, 204, 0.25)', // --accent-regular
    'rgba(0, 210, 255, 0.15)', // --accent-light
    'rgba(0, 210, 255, 0.05)', // --accent-light (very subtle)
  ];
};
