import { describe, it, expect } from 'vitest';
import { z } from './mocks/astro-zod';
import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { collections } from '../content.config';
import flagsFixture from '../content/flags/config.json';

describe('content.config', () => {
  it('exercises infrastructure mocks', () => {
    const schema = z.object({ test: z.string() });
    expect(schema.parse({ test: 'value' })).toEqual({ test: 'value' });
    expect(z.exerciseMock()).toBe(true);

    expect(glob).toBeDefined();
    expect(defineCollection).toBeDefined();
  });

  it('should have a work collection', () => {
    expect(collections).toHaveProperty('work');
  });

  it('should have the correct loader for work collection', () => {
    expect(collections.work).toHaveProperty('loader');
  });

  it('should have the correct schema for work collection', () => {
    expect(collections.work).toHaveProperty('schema');
  });

  it('validates flags fixture against schema', async () => {
    const { schema } = collections.flags;
    // @ts-expect-error - Astro 6 schema types are complex unions
    const result =
      schema && 'safeParse' in schema
        ? (schema as { safeParse: (d: unknown) => { success: boolean; data: unknown } }).safeParse(
            flagsFixture
          )
        : { success: false };
    expect(result.success).toBe(true);

    if (result.success && 'data' in result) {
      // Use toMatchObject to ensure all fixture properties are correctly validated
      // while allowing for Zod-injected default values.
      expect(result.data).toMatchObject(flagsFixture);
    }
  });

  it('validates work schema with sample data', () => {
    const { schema } = collections.work;
    const sampleWork = {
      title: 'Sample Work',
      description: 'A sample description',
      publishDate: '2025-01-01',
      tags: ['tag1', 'tag2'],
      img: '/assets/sample.jpg',
      img_alt: 'Sample alt text',
    };
    // @ts-expect-error - Astro 6 schema types are complex unions
    const result =
      schema && 'safeParse' in schema
        ? (schema as { safeParse: (d: unknown) => { success: boolean; data: unknown } }).safeParse(
            sampleWork
          )
        : { success: false };
    expect(result.success).toBe(true);
    if (result.success && 'data' in result) {
      const data = result.data as Record<string, unknown>;
      expect(data.title).toBe(sampleWork.title);
      expect(data.publishDate).toBeInstanceOf(Date);
    }
  });
});
