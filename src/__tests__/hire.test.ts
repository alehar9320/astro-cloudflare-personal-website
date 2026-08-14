import { describe, expect, it } from 'vitest';
import { hire, hireMailto, hireSchema } from '../data/hire';

describe('hire path', () => {
  it('keeps email, availability, and CV on the contact page target', () => {
    expect(hire.availability).toBe(
      'Open to conversations about product leadership, DevEx, and Industrial AI.',
    );
    expect(hire.email).toBe('hello@harenstam.com');
    expect(hire.cvHref).toBe('/alexander-harenstam-cv.pdf');
    expect(hire.cvLabel).toBe('Download CV');
    expect(hireMailto).toBe(`mailto:${hire.email}`);
    expect(hire.linkedinHref).toContain('linkedin.com');
  });

  it('validates the hire config with Zod', () => {
    expect(() => hireSchema.parse(hire)).not.toThrow();
  });
});
