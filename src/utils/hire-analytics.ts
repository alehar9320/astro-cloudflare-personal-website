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
  });
}
