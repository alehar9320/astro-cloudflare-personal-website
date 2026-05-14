import { describe, it, expect } from 'vitest';
import { collections } from '../content.config';

describe('content.config', () => {
  it('should have a work collection', () => {
    expect(collections).toHaveProperty('work');
  });

  it('should have the correct loader for work collection', () => {
    expect(collections.work).toHaveProperty('loader');
  });

  describe('work schema validation', () => {
    const schema = collections.work.schema;

    it('validates a correct work entry', () => {
      if (typeof schema === 'function' || !schema || !('safeParse' in schema)) {
        throw new Error('Schema should be a Zod object');
      }
      const validData = {
        title: 'Project Title',
        description: 'Project Description',
        publishDate: '2023-01-01',
        tags: ['tag1', 'tag2'],
        img: '/assets/image.jpg',
        img_alt: 'Image alt text',
      };
      const result = schema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('fails when title is missing', () => {
      if (typeof schema === 'function' || !schema || !('safeParse' in schema)) {
        throw new Error('Schema should be a Zod object');
      }
      const invalidData = {
        description: 'Project Description',
        publishDate: '2023-01-01',
        tags: ['tag1'],
        img: '/assets/image.jpg',
        img_alt: 'Alt',
      };
      const result = schema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('fails when img_alt is empty', () => {
      if (typeof schema === 'function' || !schema || !('safeParse' in schema)) {
        throw new Error('Schema should be a Zod object');
      }
      const invalidData = {
        title: 'Project Title',
        description: 'Project Description',
        publishDate: '2023-01-01',
        tags: ['tag1'],
        img: '/assets/image.jpg',
        img_alt: '',
      };
      const result = schema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('fails when publishDate is invalid', () => {
      if (typeof schema === 'function' || !schema || !('safeParse' in schema)) {
        throw new Error('Schema should be a Zod object');
      }
      const invalidData = {
        title: 'Project Title',
        description: 'Project Description',
        publishDate: 'not-a-date',
        tags: ['tag1'],
        img: '/assets/image.jpg',
        img_alt: 'Alt',
      };
      const result = schema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('coerces valid date strings into Date objects', () => {
      if (typeof schema === 'function' || !schema || !('safeParse' in schema)) {
        throw new Error('Schema should be a Zod object');
      }
      const validData = {
        title: 'Project Title',
        description: 'Project Description',
        publishDate: '2023-05-20',
        tags: ['tag1'],
        img: '/assets/image.jpg',
        img_alt: 'Alt',
      };
      const result = schema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.publishDate).toBeInstanceOf(Date);
        expect(result.data.publishDate.toISOString()).toContain('2023-05-20');
      }
    });
  });
});
