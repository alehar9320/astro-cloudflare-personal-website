import { describe, it, expect } from 'vitest';
import { z } from './mocks/astro-zod';
import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { collections } from '../content.config';

describe('content.config', () => {
  it('exercises infrastructure mocks', () => {
    const schema = z.object({ test: z.string() });
    expect(schema.parse({ test: 'value' })).toEqual({ test: 'value' });
    expect(z.exerciseMock()).toBe(true);

    expect(glob).toBeDefined();
    expect(defineCollection).toBeDefined();
  });

  it('should have a work collection with valid schema', () => {
    expect(collections).toHaveProperty('work');
    const workSchema = collections.work.schema;
    const validData = {
      title: 'Project A',
      description: 'A great project',
      publishDate: '2023-01-01',
      tags: ['web'],
      img: '/img.png',
      img_alt: 'An image',
    };
    const parsed = workSchema.parse(validData);
    expect(parsed.publishDate).toBeInstanceOf(Date);
    expect(parsed.title).toBe('Project A');
  });

  it('should fail work schema for invalid publishDate coercion', () => {
    const workSchema = collections.work.schema;
    expect(() => workSchema.parse({ publishDate: 'not-a-date' })).toThrow();
  });

  it('should fail work schema for empty img_alt', () => {
    const workSchema = collections.work.schema;
    const invalidData = {
      title: 'Project A',
      description: 'A great project',
      publishDate: '2023-01-01',
      tags: ['web'],
      img: '/img.png',
      img_alt: '',
    };
    expect(() => workSchema.parse(invalidData)).toThrow();
  });

  it('should have a flags collection with default values', () => {
    expect(collections).toHaveProperty('flags');
    const flagsSchema = collections.flags.schema;
    const defaults = flagsSchema.parse({});
    expect(defaults).toEqual({
      portfolio_tactile_v1: false,
      enable_strategic_pulse: false,
      portfolio_shimmer_v1: false,
      enable_product_manifesto: false,
      enable_skills_pulse_v1: false,
      enable_reading_list: false,
    });
  });

  it('should have the correct loaders', () => {
    expect(collections.work).toHaveProperty('loader');
    expect(collections.flags).toHaveProperty('loader');
  });
});
