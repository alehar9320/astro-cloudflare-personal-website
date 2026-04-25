import { describe, it, expect } from 'vitest';
import { iconPaths } from '../IconPaths';

describe('iconPaths', () => {
  it('should contain expected icon names', () => {
    expect(iconPaths).toHaveProperty('terminal-window');
    expect(iconPaths).toHaveProperty('strategy');
    expect(iconPaths).toHaveProperty('rocket-launch');
    expect(iconPaths).toHaveProperty('github-logo');
  });

  it('should not contain removed icon names', () => {
    expect(iconPaths).not.toHaveProperty('trophy');
    expect(iconPaths).not.toHaveProperty('code');
    expect(iconPaths).not.toHaveProperty('heart');
  });

  it('should have non-empty string values for each icon', () => {
    Object.values(iconPaths).forEach((path) => {
      expect(typeof path).toBe('string');
      expect(path.length).toBeGreaterThan(0);
    });
  });
});
