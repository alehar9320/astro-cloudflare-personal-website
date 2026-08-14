import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('posthog-js', () => ({
  default: { capture: vi.fn() },
}));

import posthog from 'posthog-js';
import { trackHireEvent, trackHireEventFromElement } from './hire-analytics';

describe('hire-analytics', () => {
  beforeEach(() => {
    vi.mocked(posthog.capture).mockClear();
  });

  it('captures named hire events with a surface property', () => {
    trackHireEvent('hire_cta_click', 'hero');
    expect(posthog.capture).toHaveBeenCalledWith('hire_cta_click', { surface: 'hero' });
  });

  it('reads data-event and data-surface from an element', () => {
    const el = document.createElement('a');
    el.setAttribute('data-event', 'cv_download');
    el.setAttribute('data-surface', 'contact_page');
    trackHireEventFromElement(el);
    expect(posthog.capture).toHaveBeenCalledWith('cv_download', { surface: 'contact_page' });
  });

  it('ignores unknown events and surfaces', () => {
    const el = document.createElement('a');
    el.setAttribute('data-event', 'not_a_hire_event');
    el.setAttribute('data-surface', 'hero');
    trackHireEventFromElement(el);
    expect(posthog.capture).not.toHaveBeenCalled();
  });
});
