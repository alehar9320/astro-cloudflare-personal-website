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
    const collection = collections.flags;
    const schema = typeof collection.schema === "function"
      ? (collection.schema as (ctx: unknown) => { safeParse: (data: unknown) => { success: boolean; data: unknown } })({ image: () => ({}) })
      : collection.schema;

    // @ts-expect-error - schema is unknown but we expect safeParse
    const result = schema.safeParse(flagsFixture);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toMatchObject(flagsFixture);
    }
  });

  it('validates work schema with sample data', () => {
    const collection = collections.work;
    const schema = typeof collection.schema === "function"
      ? (collection.schema as (ctx: unknown) => { safeParse: (data: unknown) => { success: boolean; data: unknown } })({ image: () => ({}) })
      : collection.schema;

    const sampleWork = {
      title: 'Sample Work',
      description: 'A sample description',
      publishDate: '2025-01-01',
      tags: ['tag1', 'tag2'],
      img: '/assets/sample.jpg',
      img_alt: 'Sample alt text',
    };

    // @ts-expect-error - schema is unknown but we expect safeParse
    const result = schema.safeParse(sampleWork);
    expect(result.success).toBe(true);
    if (result.success) {
      // @ts-expect-error - result.data is unknown
      expect(result.data.title).toBe(sampleWork.title);
      // @ts-expect-error - result.data is unknown
      expect(result.data.publishDate).toBeInstanceOf(Date);
    }
  });
});
