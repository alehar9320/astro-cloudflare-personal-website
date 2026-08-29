/**
 * Site-success OKRs — H2 2026 (29 Aug – 31 Dec 2026). Nick-locked numbers only.
 *
 * Current === Baseline as-of 29 Aug 2026. Do not invent newer currents.
 *
 * Filter recipe (must stay identical; not visitor chrome):
 * - PRs: alehar9320/astro-cloudflare-personal-website, state=MERGED, base=main, count by mergedAt.
 * - Visitors: PostHog project 171414 (eu), $pageview, $host = me.alehar.workers.dev,
 *   filterTestAccounts = true, exclude $os = Linux (Alexander, Grok Bot/agents, datacenter).
 *   No localhost / *-me.alehar.workers.dev preview hosts.
 * - Contact-card: $autocapture with element href containing linkedin.com OR element text
 *   containing "Get in touch", same host + Linux-exclude. Unique persons.
 */

export type ProgressDirection = 'up' | 'down' | 'none';

export type KeyResult = {
  id: string;
  label: string;
  window: string;
  baselineLabel: string;
  currentLabel: string;
  targetLabel: string;
  baseline: number;
  current: number;
  target: number;
  direction: ProgressDirection;
  note?: string;
};

export type Objective = {
  id: string;
  title: string;
  results: readonly KeyResult[];
  supporting: readonly string[];
};

export const OKR_COLUMNS = ['Baseline', 'Current', 'Target'] as const;

export const OBJECTIVES: readonly Objective[] = [
  {
    id: 'O1',
    title: 'Real people find the site',
    results: [
      {
        id: 'KR1.1',
        label: 'Unique visitors',
        window: '14 days',
        baselineLabel: '297',
        currentLabel: '297',
        targetLabel: '400',
        baseline: 297,
        current: 297,
        target: 400,
        direction: 'up',
      },
      {
        id: 'KR1.2',
        label: 'Bounce rate',
        window: '14 days',
        baselineLabel: '82.5%',
        currentLabel: '82.5%',
        targetLabel: '≤ 70%',
        baseline: 82.5,
        current: 82.5,
        target: 70,
        direction: 'down',
      },
    ],
    supporting: [],
  },
  {
    id: 'O2',
    title: 'A hire path visitors can take',
    results: [
      {
        id: 'KR2.2',
        label: 'LinkedIn / Get in touch',
        window: '30 days',
        baselineLabel: '0',
        currentLabel: '0',
        targetLabel: '5',
        baseline: 0,
        current: 0,
        target: 5,
        direction: 'up',
      },
    ],
    supporting: ['Hire tracking in PostHog — live by 30 Sep 2026', 'Hire path stays LinkedIn only'],
  },
  {
    id: 'O3',
    title: 'Shipping stays visible week to week',
    results: [
      {
        id: 'KR3.1',
        label: 'PRs merged to main',
        window: '7 days',
        baselineLabel: '25',
        currentLabel: '25',
        targetLabel: 'median ≥ 8 / week through Dec',
        baseline: 25,
        current: 25,
        target: 8,
        direction: 'none',
        note: "August's 200 merges in 30 days was a farm spike — target is steady weeks, not that peak",
      },
    ],
    supporting: ['At least half of weekly merges visitor-facing, for 8 weeks before year-end'],
  },
];

/**
 * Quiet bar only when Current sits between Baseline and Target in the expected
 * direction. KR3.1 is a future median floor (direction none) — never a miss bar
 * because 25 > 8.
 */
export function progressTowardTarget(kr: KeyResult): number | null {
  if (kr.direction === 'none') return null;
  if (kr.direction === 'up') {
    if (!(kr.current > kr.baseline && kr.current <= kr.target)) return null;
    const span = kr.target - kr.baseline;
    if (span <= 0) return null;
    return ((kr.current - kr.baseline) / span) * 100;
  }
  if (!(kr.current < kr.baseline && kr.current >= kr.target)) return null;
  const span = kr.baseline - kr.target;
  if (span <= 0) return null;
  return ((kr.baseline - kr.current) / span) * 100;
}
