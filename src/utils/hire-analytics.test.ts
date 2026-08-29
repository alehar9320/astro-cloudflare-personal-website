/** @vitest-environment jsdom */
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { initHireAnalytics, trackHireEvent } from './hire-analytics';

describe('hire-analytics', () => {
  beforeAll(() => {
    window.__hireAnalyticsInit = false;
    initHireAnalytics();
  });

  beforeEach(() => {
    window.dataLayer = [];
    document.body.innerHTML = '';
  });

  it('dispatches a CustomEvent and pushes to dataLayer', () => {
    const seen: string[] = [];
    const handler = (e: Event) => seen.push((e as CustomEvent).detail.surface);
    window.addEventListener('hire_cta_click', handler);
    trackHireEvent('hire_cta_click', 'hero');
    window.removeEventListener('hire_cta_click', handler);
    expect(seen).toEqual(['hero']);
    expect(window.dataLayer).toEqual([{ event: 'hire_cta_click', surface: 'hero' }]);
  });

  it('does not throw when dataLayer is missing', () => {
    delete window.dataLayer;
    expect(() => trackHireEvent('linkedin_click', 'contact_cta')).not.toThrow();
  });

  it('is idempotent', () => {
    initHireAnalytics();
    initHireAnalytics();
    document.body.innerHTML =
      '<a href="/contact/" data-hire-event="hire_cta_click" data-hire-surface="nav">Contact</a>';
    document.querySelector('a')!.click();
    expect(window.dataLayer).toHaveLength(1);
  });

  it('tracks delegated hire clicks', () => {
    document.body.innerHTML =
      '<a href="/x" data-hire-event="cv_download" data-hire-surface="contact_page">CV</a>';
    document.querySelector('a')!.click();
    expect(window.dataLayer).toEqual([{ event: 'cv_download', surface: 'contact_page' }]);
  });

  it('tracks hire_cta_click and linkedin_click via the delegated handler', () => {
    document.body.innerHTML = [
      '<a href="/contact/" data-hire-event="hire_cta_click" data-hire-surface="hero">Contact</a>',
      '<a href="https://linkedin.com" data-hire-event="linkedin_click"' +
        ' data-hire-surface="contact_cta">LI</a>',
    ].join('');
    document.querySelectorAll('a').forEach((el) => (el as HTMLElement).click());
    expect(window.dataLayer).toEqual([
      { event: 'hire_cta_click', surface: 'hero' },
      { event: 'linkedin_click', surface: 'contact_cta' },
    ]);
  });

  it('ignores chat_opened and chat_message_sent on the delegated handler', () => {
    document.body.innerHTML =
      '<button data-hire-event="chat_opened" data-hire-surface="fab">x</button>';
    document.querySelector('button')!.click();
    expect(window.dataLayer).toEqual([]);

    document.body.innerHTML =
      '<form data-hire-event="chat_message_sent" data-hire-surface="fab">' +
      '<button type="button">x</button></form>';
    document.querySelector('button')!.click();
    expect(window.dataLayer).toEqual([]);
  });

  it('ignores clicks without hire attrs', () => {
    document.body.innerHTML = '<button>plain</button>';
    document.querySelector('button')!.click();
    expect(window.dataLayer).toEqual([]);
  });

  it('ignores clicks with only one of the two hire attrs', () => {
    document.body.innerHTML = [
      '<button data-hire-event="hire_cta_click">only event</button>',
      '<button data-hire-surface="hero">only surface</button>',
    ].join('');
    document.querySelectorAll('button').forEach((el) => (el as HTMLElement).click());
    expect(window.dataLayer).toEqual([]);
  });
});
