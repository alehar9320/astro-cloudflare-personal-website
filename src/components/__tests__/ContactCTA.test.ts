import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { JSDOM } from 'jsdom';
import { describe, it, expect, beforeEach } from 'vitest';
import ContactCTA from '../ContactCTA.astro';

function parseHTML(html: string) {
  return new JSDOM(html).window.document;
}

describe('ContactCTA', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it('renders the heading text', async () => {
    const html = await container.renderToString(ContactCTA);
    const heading = parseHTML(html).querySelector('h2');

    expect(heading?.textContent?.trim()).toBe('Interested in working together?');
  });

  it('renders a link to the LinkedIn profile URL', async () => {
    const html = await container.renderToString(ContactCTA);
    const anchor = parseHTML(html).querySelector('a');

    expect(anchor?.getAttribute('href')).toBe('https://www.linkedin.com/in/alehar/');
  });

  it('renders the link with target="_blank" to open in a new tab', async () => {
    const html = await container.renderToString(ContactCTA);
    const anchor = parseHTML(html).querySelector('a');

    expect(anchor?.getAttribute('target')).toBe('_blank');
  });

  it('renders the link with rel="noopener noreferrer" for security', async () => {
    const html = await container.renderToString(ContactCTA);
    const anchor = parseHTML(html).querySelector('a');

    expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('includes "noopener" in rel to prevent window.opener access', async () => {
    const html = await container.renderToString(ContactCTA);
    const anchor = parseHTML(html).querySelector('a');
    const rel = anchor?.getAttribute('rel') ?? '';

    expect(rel).toContain('noopener');
  });

  it('includes "noreferrer" in rel to prevent referrer leakage', async () => {
    const html = await container.renderToString(ContactCTA);
    const anchor = parseHTML(html).querySelector('a');
    const rel = anchor?.getAttribute('rel') ?? '';

    expect(rel).toContain('noreferrer');
  });

  it('renders the call-to-action link text', async () => {
    const html = await container.renderToString(ContactCTA);
    const anchor = parseHTML(html).querySelector('a');

    expect(anchor?.textContent?.trim()).toContain('Send Me a Message');
  });

  it('renders inside an aside element', async () => {
    const html = await container.renderToString(ContactCTA);
    const aside = parseHTML(html).querySelector('aside');

    expect(aside).not.toBeNull();
  });
});