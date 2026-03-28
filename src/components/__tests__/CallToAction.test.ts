import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { JSDOM } from 'jsdom';
import { describe, it, expect, beforeEach } from 'vitest';
import CallToAction from '../CallToAction.astro';

function parseHTML(html: string) {
  return new JSDOM(html).window.document;
}

describe('CallToAction', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it('renders an anchor element with the provided href', async () => {
    const html = await container.renderToString(CallToAction, {
      props: { href: 'https://example.com' },
    });
    const anchor = parseHTML(html).querySelector('a');

    expect(anchor).not.toBeNull();
    expect(anchor?.getAttribute('href')).toBe('https://example.com');
  });

  it('renders slot content inside the anchor', async () => {
    const html = await container.renderToString(CallToAction, {
      props: { href: '/contact' },
      slots: { default: 'Click Me' },
    });
    const anchor = parseHTML(html).querySelector('a');

    expect(anchor?.textContent?.trim()).toBe('Click Me');
  });

  it('does not render target attribute when not provided', async () => {
    const html = await container.renderToString(CallToAction, {
      props: { href: '/page' },
    });
    const anchor = parseHTML(html).querySelector('a');

    expect(anchor?.hasAttribute('target')).toBe(false);
  });

  it('does not render rel attribute when not provided', async () => {
    const html = await container.renderToString(CallToAction, {
      props: { href: '/page' },
    });
    const anchor = parseHTML(html).querySelector('a');

    expect(anchor?.hasAttribute('rel')).toBe(false);
  });

  it('renders target attribute when provided', async () => {
    const html = await container.renderToString(CallToAction, {
      props: { href: 'https://example.com', target: '_blank' },
    });
    const anchor = parseHTML(html).querySelector('a');

    expect(anchor?.getAttribute('target')).toBe('_blank');
  });

  it('renders rel attribute when provided', async () => {
    const html = await container.renderToString(CallToAction, {
      props: { href: 'https://example.com', rel: 'noopener noreferrer' },
    });
    const anchor = parseHTML(html).querySelector('a');

    expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('renders both target and rel attributes together', async () => {
    const html = await container.renderToString(CallToAction, {
      props: {
        href: 'https://example.com',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
    });
    const anchor = parseHTML(html).querySelector('a');

    expect(anchor?.getAttribute('href')).toBe('https://example.com');
    expect(anchor?.getAttribute('target')).toBe('_blank');
    expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('renders custom rel value (e.g. nofollow)', async () => {
    const html = await container.renderToString(CallToAction, {
      props: { href: 'https://example.com', rel: 'nofollow' },
    });
    const anchor = parseHTML(html).querySelector('a');

    expect(anchor?.getAttribute('rel')).toBe('nofollow');
  });

  it('renders custom target value (e.g. _self)', async () => {
    const html = await container.renderToString(CallToAction, {
      props: { href: '/internal', target: '_self' },
    });
    const anchor = parseHTML(html).querySelector('a');

    expect(anchor?.getAttribute('target')).toBe('_self');
  });
});