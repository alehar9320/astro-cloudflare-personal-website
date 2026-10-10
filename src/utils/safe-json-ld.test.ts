import { describe, expect, it } from 'vitest';
import { safeJsonLd } from './safe-json-ld';

describe('safeJsonLd', () => {
  it('serializes simple objects correctly', () => {
    const obj = { name: 'Alexander Härenstam', role: 'Product Manager' };
    const result = safeJsonLd(obj);
    expect(result).toBe(JSON.stringify(obj));
  });

  it('neutralizes script tag breakout vectors', () => {
    const malicious = { title: '</script><script>alert("xss")</script>' };
    const result = safeJsonLd(malicious);
    expect(result).not.toContain('<');
    expect(result).toContain('\\u003c/script>\\u003cscript>');
    expect(JSON.parse(result)).toEqual(malicious);
  });
});
