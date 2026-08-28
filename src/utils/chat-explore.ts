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

export function exploreCardForQuestion(lastUserMessage: string): ExploreCard | null {
  const question = lastUserMessage.trim().toLowerCase();
  if (!question) return null;

  // Email / CV stay off — no public email, no placeholder CV.
  if (
    question.includes('email') ||
    question.includes('cv') ||
    question.includes('résumé') ||
    question.includes('resume')
  ) {
    return null;
  }

  // Hire / LinkedIn / contact → in-stream LinkedIn confirm (one primary, unstacked).
  if (
    question.includes('linkedin') ||
    question.includes('get in touch') ||
    question.includes('hire') ||
    /\bcontact\b/.test(question)
  ) {
    return LINKEDIN_CONFIRM;
  }

  if (
    question.includes('design system') ||
    question.includes('zeroheight') ||
    /\b(2x|30x|roi)\b/.test(question)
  ) {
    return EXPLORE_CARDS.designSystem;
  }

  if (question.includes('copilot') || question.includes('ai coding')) {
    return EXPLORE_CARDS.copilots;
  }

  if (
    question.includes('analytics') ||
    question.includes('telemetry') ||
    question.includes('user behavior')
  ) {
    return EXPLORE_CARDS.analytics;
  }

  if (
    question.includes('thesis') ||
    question.includes("master's") ||
    question.includes('masters')
  ) {
    return EXPLORE_CARDS.thesis;
  }

  if (
    question.includes('biograph') ||
    question.includes('background') ||
    /\babout you\b/.test(question) ||
    question.includes('about yourself') ||
    question.includes('who are you') ||
    question.includes('education') ||
    question.includes('experience') ||
    question.includes('how do you work as a pm') ||
    question.includes('how do you work as a product manager')
  ) {
    return EXPLORE_CARDS.biography;
  }

  if (/\bcases?\b/.test(question) && !question.includes('industrial')) {
    return EXPLORE_CARDS.designSystem;
  }

  if (
    question.includes('industrial ai') ||
    question.includes('portfolio') ||
    /\bwork\b/.test(question)
  ) {
    return EXPLORE_CARDS.work;
  }

  return null;
}
