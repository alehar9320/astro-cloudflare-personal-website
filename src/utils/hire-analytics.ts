import posthog from 'posthog-js';

export const HIRE_EVENTS = [
  'hire_cta_click',
  'contact_page_view',
  'cv_download',
  'linkedin_click',
  'chat_opened',
  'chat_message_sent',
] as const;

export const HIRE_SURFACES = ['nav', 'hero', 'contact_cta', 'contact_page', 'fab'] as const;

export type HireEvent = (typeof HIRE_EVENTS)[number];
export type HireSurface = (typeof HIRE_SURFACES)[number];

export function trackHireEvent(event: HireEvent, surface: HireSurface): void {
  if (typeof posthog?.capture !== 'function') return;
  posthog.capture(event, { surface });
}

export function trackHireEventFromElement(el: Element | null): void {
  if (!el) return;
  const event = el.getAttribute('data-event');
  const surface = el.getAttribute('data-surface');
  if (!event || !surface) return;
  if (!(HIRE_EVENTS as readonly string[]).includes(event)) return;
  if (!(HIRE_SURFACES as readonly string[]).includes(surface)) return;
  trackHireEvent(event as HireEvent, surface as HireSurface);
}
