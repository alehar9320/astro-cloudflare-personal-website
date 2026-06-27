import { describe, it, expect } from 'vitest';
import { PERSON_SCHEMA } from '../constants/schema';

describe('PERSON_SCHEMA', () => {
  it('should be correctly defined', () => {
    expect(PERSON_SCHEMA['@type']).toBe('Person');
    expect(PERSON_SCHEMA['@id']).toBe('https://harenstam.com/#person');
    expect(PERSON_SCHEMA.name).toBe('Alexander Härenstam');
    expect(PERSON_SCHEMA.jobTitle).toBe('Strategic Product Leader');
    expect(PERSON_SCHEMA.url).toBe('https://harenstam.com/');
    expect(PERSON_SCHEMA.sameAs).toContain('https://www.linkedin.com/in/alehar/');
    expect(PERSON_SCHEMA.sameAs).toContain('https://github.com/alehar9320/');
    expect(PERSON_SCHEMA.sameAs).toContain('https://blog.ifs.com/author/alexander-harenstam/');
    expect(PERSON_SCHEMA.worksFor['@type']).toBe('Organization');
    expect(PERSON_SCHEMA.worksFor.name).toBe('IFS');
    expect(PERSON_SCHEMA.alumniOf['@type']).toBe('CollegeOrUniversity');
    expect(PERSON_SCHEMA.alumniOf.name).toBe('Chalmers University of Technology');
  });
});
