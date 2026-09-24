/** @vitest-environment jsdom */
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  HIRE_CONTACT_ACTION,
  initHireAnalytics,
  matchesHireContactCard,
  trackHireEvent,
} from './hire-analytics';

describe('hire-analytics', () => {
  beforeAll(() => {
    window.__hireAnalyticsInit = false;
    initHireAnalytics();
  });

  beforeEach(() => {
    window.dataLayer = [];
    document.body.innerHTML = '';
    delete window.posthog;
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

  it('exports the exact Nick KR2.1 action name', () => {
    expect(HIRE_CONTACT_ACTION).toBe('Contact card — Get in touch / LinkedIn hire');
  });

  it('matches LinkedIn href or Get in touch text only', () => {
    document.body.innerHTML = [
      '<a id="li" href="https://www.linkedin.com/in/alehar/">LI</a>',
      '<a id="apex" href="https://linkedin.com/in/alehar/">apex</a>',
      '<a id="git" href="/x">Get in touch</a>',
      '<a id="nav" href="/contact/" data-hire-event="hire_cta_click" data-hire-surface="nav">Contact</a>',
    ].join('');
    expect(matchesHireContactCard(document.getElementById('li')!)).toBe(true);
    expect(matchesHireContactCard(document.getElementById('apex')!)).toBe(true);
    expect(matchesHireContactCard(document.getElementById('git')!)).toBe(true);
    expect(matchesHireContactCard(document.getElementById('nav')!)).toBe(false);
  });

  it('rejects spoofed LinkedIn substring hosts', () => {
    document.body.innerHTML = [
      '<a id="evil1" href="https://evil.com/linkedin.com">x</a>',
      '<a id="evil2" href="https://linkedin.com.evil.com/">x</a>',
      '<a id="evil3" href="https://notlinkedin.com/">x</a>',
      '<a id="rel" href="/linkedin.com">x</a>',
      '<a id="bad" href="not a url">x</a>',
      '<a id="throwish" href="http://[">x</a>',
    ].join('');
    expect(matchesHireContactCard(document.getElementById('evil1')!)).toBe(false);
    expect(matchesHireContactCard(document.getElementById('evil2')!)).toBe(false);
    expect(matchesHireContactCard(document.getElementById('evil3')!)).toBe(false);
    expect(matchesHireContactCard(document.getElementById('rel')!)).toBe(false);
    expect(matchesHireContactCard(document.getElementById('bad')!)).toBe(false);
    expect(matchesHireContactCard(document.getElementById('throwish')!)).toBe(false);
  });

  it('captures the named action on Get in touch / LinkedIn hire clicks', () => {
    const capture = vi.fn();
    window.posthog = { capture };
    document.body.innerHTML =
      '<a href="https://www.linkedin.com/in/alehar/" data-hire-event="hire_cta_click"' +
      ' data-hire-surface="hero">Get in touch</a>';
    document.querySelector('a')!.click();
    expect(capture).toHaveBeenCalledWith(HIRE_CONTACT_ACTION, { surface: 'hero' });
  });

  it('does not capture the named action for nav Contact that is not LinkedIn', () => {
    const capture = vi.fn();
    window.posthog = { capture };
    document.body.innerHTML =
      '<a href="/contact/" data-hire-event="hire_cta_click" data-hire-surface="nav">Contact</a>';
    document.querySelector('a')!.click();
    expect(capture).not.toHaveBeenCalled();
    expect(window.dataLayer).toEqual([{ event: 'hire_cta_click', surface: 'nav' }]);
  });

  it('fail-opens when PostHog is missing or throws', () => {
    delete window.posthog;
    document.body.innerHTML =
      '<a href="https://www.linkedin.com/in/alehar/" data-hire-event="linkedin_click"' +
      ' data-hire-surface="contact_page">Get in touch</a>';
    expect(() => document.querySelector('a')!.click()).not.toThrow();

    window.posthog = {
      capture: () => {
        throw new Error('posthog down');
      },
    };
    expect(() => document.querySelector('a')!.click()).not.toThrow();
  });
});
