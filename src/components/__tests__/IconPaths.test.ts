import { describe, it, expect } from 'vitest';
import { iconPaths } from '../IconPaths';

describe('iconPaths', () => {
  it('should contain expected icon names', () => {
    expect(iconPaths).toHaveProperty('terminal-window');
    expect(iconPaths).toHaveProperty('list');
    expect(iconPaths).toHaveProperty('strategy');
    expect(iconPaths).toHaveProperty('rocket-launch');
  });

  it('should have non-empty string values for each icon', () => {
    Object.values(iconPaths).forEach((path) => {
      expect(typeof path).toBe('string');
      expect(path.length).toBeGreaterThan(0);
    });
  });

  it('should start with a valid SVG element tag (<path, <circle, <rect, <g)', () => {
    Object.values(iconPaths).forEach((path) => {
      const trimmed = path.trim();
      const startsWithValidTag = ['<path', '<circle', '<rect', '<g'].some((tag) =>
        trimmed.startsWith(tag)
      );
      expect(startsWithValidTag).toBe(true);
    });
  });
});
