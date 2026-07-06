import { describe, it, expect } from 'vitest';
import { collections } from '../content.config';
import flagsFixture from '../content/flags/config.json';

describe('content.config', () => {
  it('should have a work collection', () => {
    expect(collections).toHaveProperty('work');
  });

  it('validates flags fixture against schema', async () => {
    const { schema } = collections.flags as never;
    const result = (schema as { safeParse: Function }).safeParse(flagsFixture);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toMatchObject(flagsFixture);
  });

  it('validates work schema with sample data', () => {
    const { schema } = collections.work as never;
    const sample = {
      title: 'T',
      description: 'D',
      publishDate: '2025-01-01',
      tags: ['A'],
      img: '/a.jpg',
      img_alt: 'A',
    };
    const result = (schema as { safeParse: Function }).safeParse(sample);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.title).toBe(sample.title);
  });
});
