export type ExploreCard = {
  title: string;
  line: string;
  href: string;
  /** action = secondary soft card; linkedin = in-stream confirm with one primary */
  variant?: 'action' | 'linkedin';
  actionLabel?: string;
};

export const LINKEDIN_HREF = 'https://www.linkedin.com/in/alehar/';

export const LINKEDIN_CONFIRM: ExploreCard = {
  title: 'Continue the conversation on LinkedIn',
  line: '',
  href: LINKEDIN_HREF,
  variant: 'linkedin',
  actionLabel: 'Continue on LinkedIn',
};

export const EXPLORE_CARDS = {
  designSystem: {
    title: 'IFS Design System',
    line: 'From the first version to IFS Cloud.',
    href: '/work/ifs-design-system/',
    variant: 'action',
    actionLabel: 'View the case',
  },
  copilots: {
    title: 'Internal AI coding copilots',
    line: 'Internal AI coding copilots for IFS engineering teams.',
    href: '/work/ai-coding-copilots/',
    variant: 'action',
    actionLabel: 'Open',
  },
  analytics: {
    title: 'User behavior analytics',
    line: 'Usage telemetry for IFS Cloud roadmap decisions.',
    href: '/work/user-behavior-analytics/',
    variant: 'action',
    actionLabel: 'Open',
  },
  thesis: {
    title: "Chalmers master's thesis",
    line: "Chalmers master's thesis, 2017.",
    href: '/work/master-thesis/',
    variant: 'action',
    actionLabel: 'Open',
  },
  biography: {
    title: 'Biography',
    line: 'Product Manager, Developer Experience at IFS.',
    href: '/biography/',
    variant: 'action',
    actionLabel: 'Open',
  },
  work: {
    title: 'Work',
    line: 'The IFS Design System case, then earlier work.',
    href: '/work/',
    variant: 'action',
    actionLabel: 'Open',
  },
} as const satisfies Record<string, ExploreCard>;

const SUPPRESS_PATTERN = /email|cv|résumé|resume/i;
const LINKEDIN_PATTERN = /linkedin|get in touch|hire|\bcontact\b/i;
const DESIGN_SYSTEM_PATTERN = /design system|zeroheight|\b(?:2x|30x|roi)\b/i;
const COPILOTS_PATTERN = /copilot|ai coding/i;
const ANALYTICS_PATTERN = /analytics|telemetry|user behavior/i;
const THESIS_PATTERN = /thesis|master[’']?s/i;
const BIOGRAPHY_PATTERN =
  /biograph|background|\babout you\b|about yourself|who are you|education|experience|how do you work as a (?:pm|product manager)/i;
const CASES_PATTERN = /\bcases?\b/i;
const WORK_PATTERN = /industrial ai|portfolio|\bwork\b/i;

/**
 * Matches user questions to relevant explore cards.
 * Hoists static regular expressions to module scope to avoid dynamic RegExp compilation and string allocations per request on edge runtimes.
 */
export function exploreCardForQuestion(lastUserMessage: string): ExploreCard | null {
  const question = lastUserMessage.trim().toLowerCase();
  if (!question) return null;

  // Email / CV stay off — no public email, no placeholder CV.
  if (SUPPRESS_PATTERN.test(question)) {
    return null;
  }

  // Hire / LinkedIn / contact → in-stream LinkedIn confirm (one primary, unstacked).
  if (LINKEDIN_PATTERN.test(question)) {
    return LINKEDIN_CONFIRM;
  }

  if (DESIGN_SYSTEM_PATTERN.test(question)) {
    return EXPLORE_CARDS.designSystem;
  }

  if (COPILOTS_PATTERN.test(question)) {
    return EXPLORE_CARDS.copilots;
  }

  if (ANALYTICS_PATTERN.test(question)) {
    return EXPLORE_CARDS.analytics;
  }

  if (THESIS_PATTERN.test(question)) {
    return EXPLORE_CARDS.thesis;
  }

  if (BIOGRAPHY_PATTERN.test(question)) {
    return EXPLORE_CARDS.biography;
  }

  if (CASES_PATTERN.test(question) && !question.includes('industrial')) {
    return EXPLORE_CARDS.designSystem;
  }

  if (WORK_PATTERN.test(question)) {
    return EXPLORE_CARDS.work;
  }

  return null;
}
