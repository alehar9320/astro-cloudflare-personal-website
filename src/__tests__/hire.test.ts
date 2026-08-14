import { describe, expect, it } from 'vitest';
import { hire, hireMailto, hireSchema } from '../data/hire';

describe('hire path', () => {
  it('exposes email, availability, and a CV target', () => {
    expect(hire.status).toBe('Available');
    expect(hire.availability.length).toBeGreaterThan(0);
    expect(hire.email).toContain('@');
    expect(hire.cvHref.startsWith('/')).toBe(true);
    expect(hire.cvLabel.length).toBeGreaterThan(0);
    expect(hireMailto).toBe(`mailto:${hire.email}`);
  });

  it('validates the hire config with Zod', () => {
    expect(() => hireSchema.parse(hire)).not.toThrow();
  });
});
