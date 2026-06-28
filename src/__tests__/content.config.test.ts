import { describe, it, expect } from 'vitest';
import { z } from './mocks/astro-zod';
import type { ZodTypeAny } from 'zod';
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
    const schemaOrFn = collections.flags.schema;
    let schema: ZodTypeAny;
    if (typeof schemaOrFn === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      schema = (schemaOrFn as any)({ image: () => z.any(), z }) as ZodTypeAny;
    } else {
      schema = schemaOrFn as ZodTypeAny;
    }
    const result = schema.safeParse(flagsFixture);
    expect(result.success).toBe(true);

    if (result.success) {
      // Use toMatchObject to ensure all fixture properties are correctly validated
      // while allowing for Zod-injected default values.
      expect(result.data).toMatchObject(flagsFixture);
    }
  });

  it('validates work schema with sample data', () => {
    const schemaOrFn = collections.work.schema;
    let schema: ZodTypeAny;
    if (typeof schemaOrFn === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      schema = (schemaOrFn as any)({ image: () => z.any(), z }) as ZodTypeAny;
    } else {
      schema = schemaOrFn as ZodTypeAny;
    }
    const sampleWork = {
      title: 'Sample Work',
      description: 'A sample description',
      publishDate: '2025-01-01',
      tags: ['tag1', 'tag2'],
      img: '/assets/sample.jpg',
      img_alt: 'Sample alt text',
    };
    const result = schema.safeParse(sampleWork);
    expect(result.success).toBe(true);
    if (result.success) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = result.data as any;
      expect(data.title).toBe(sampleWork.title);
      expect(data.publishDate).toBeInstanceOf(Date);
    }
  });
});
