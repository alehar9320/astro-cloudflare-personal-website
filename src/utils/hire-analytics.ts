export const HIRE_CONTACT_ACTION = 'Contact card — Get in touch / LinkedIn hire';

export type HireEventName =
  | 'hire_cta_click'
  | 'contact_page_view'
  | 'cv_download'
  | 'linkedin_click'
  | 'chat_opened'
  | 'chat_message_sent';

export type HireSurface = 'nav' | 'hero' | 'contact_cta' | 'contact_page' | 'fab';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, string>>;
    __hireAnalyticsInit?: boolean;
    posthog?: {
      capture?: (event: string, properties?: Record<string, string>) => void;
    };
  }
}

/**
 * Nick KR2.1 named action. Filter recipe (do not invent):
 * host me.alehar.workers.dev, PostHog 171414 (eu), exclude $os = Linux,
 * href contains linkedin.com OR text contains "Get in touch".
 * Fail-open if PostHog is missing. Do not invent counts.
 */
export function matchesHireContactCard(el: Element): boolean {
  const href = el.getAttribute('href') ?? '';
  const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
  return href.includes('linkedin.com') || text.includes('Get in touch');
}

function captureHireContactAction(surface: HireSurface) {
  try {
    window.posthog?.capture?.(HIRE_CONTACT_ACTION, { surface });
  } catch {
    // Fail-open: hire click still works if PostHog is absent or throws.
  }
}

export function trackHireEvent(event: HireEventName, surface: HireSurface) {
  const payload = { event, surface };
  window.dispatchEvent(new CustomEvent(event, { detail: { surface } }));
  window.dataLayer?.push(payload);
}

export function initHireAnalytics() {
  if (window.__hireAnalyticsInit) return;
  window.__hireAnalyticsInit = true;

  document.addEventListener('click', (e) => {
    const el = (e.target as Element | null)?.closest?.('[data-hire-event]');
    if (!el) return;
    const event = el.getAttribute('data-hire-event') as HireEventName | null;
    const surface = el.getAttribute('data-hire-surface') as HireSurface | null;
    if (!event || !surface) return;
    // Chat open/send are fired from Chat.astro so toggle-close is not counted.
    if (event === 'chat_opened' || event === 'chat_message_sent') return;
    trackHireEvent(event, surface);
    if (matchesHireContactCard(el)) captureHireContactAction(surface);
  });
}
