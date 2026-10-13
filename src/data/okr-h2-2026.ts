/**
 * Site-success OKRs — H2 2026 (29 Aug – 31 Dec 2026). Nick-locked numbers only.
 *
 * Currents come from getOkrSnapshot() (src/utils/okr-current.ts). Never hand-type a current value.
 *
 * Filter recipe (must stay identical; not visitor chrome):
 * - PRs: alehar9320/astro-cloudflare-personal-website, state=MERGED, base=main, count by mergedAt.
 * - Visitors: PostHog project 171414 (eu), $pageview, $host = me.alehar.workers.dev,
 *   filterTestAccounts = true, exclude $os = Linux (Alexander, Grok Bot/agents, datacenter).
 *   No localhost / *-me.alehar.workers.dev preview hosts.
 * - Contact-card: $autocapture with element href containing linkedin.com OR element text
 *   containing "Get in touch", same host + Linux-exclude. Unique persons.
 *
 * Live recipes (#1663; exact copies of the queries in src/utils/okr-current.ts):
 * - KR1.1 Unique visitors (14 days), PostHog HogQL:
 *   SELECT count(DISTINCT person_id) FROM events WHERE event = '$pageview' AND properties.$host = 'me.alehar.workers.dev' AND properties.$os != 'Linux' AND timestamp >= now() - INTERVAL 14 DAY
 * - KR1.2 Bounce rate (14 days), PostHog:
 *   { kind: 'WebOverviewQuery', dateRange: { date_from: '-14d' }, properties: [{ key: '$host', value: 'me.alehar.workers.dev', operator: 'exact', type: 'event' }, { key: '$os', value: 'Linux', operator: 'is_not', type: 'event' }], filterTestAccounts: true }
 *   Result item whose key === 'bounce rate'.
 * - KR2.2 LinkedIn / Get in touch (30 days), PostHog HogQL, unique persons:
 *   SELECT count(DISTINCT person_id) FROM events WHERE timestamp >= now() - INTERVAL 30 DAY AND properties.$host = 'me.alehar.workers.dev' AND properties.$os != 'Linux' AND (event = 'Contact card — Get in touch / LinkedIn hire' OR (event = '$autocapture' AND (elements_chain_href ILIKE '%linkedin.com%' OR arrayExists(t -> t ILIKE '%Get in touch%', elements_chain_texts))))
 * - KR3.1 PRs merged to main (7 days), GitHub search total_count:
 *   repo:alehar9320/astro-cloudflare-personal-website+is:pr+is:merged+base:main+merged:>=YYYY-MM-DD (today − 7 days, UTC)
 * - KR3.2 Open PRs (now), GitHub search total_count (drafts included):
 *   repo:alehar9320/astro-cloudflare-personal-website+is:pr+is:open
 * - KR3.3 PRs closed without merging (30 days), GitHub: closeRate(merged, closedUnmerged) with
 *   closedUnmerged = …+is:pr+is:closed+is:unmerged+closed:>=YYYY-MM-DD and
 *   merged = …+is:pr+is:merged+merged:>=YYYY-MM-DD (today − 30 days, UTC).
 */

export type ProgressDirection = 'up' | 'down' | 'none';

export type KeyResult = {
  id: string;
  label: string;
  window: string;
  baselineLabel: string;
  targetLabel: string;
  baseline: number | null;
  target: number;
  direction: ProgressDirection;
  strict?: boolean;
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
        targetLabel: '400',
        baseline: 297,
        target: 400,
        direction: 'up',
      },
      {
        id: 'KR1.2',
        label: 'Bounce rate',
        window: '14 days',
        baselineLabel: '82.5%',
        targetLabel: '≤ 70%',
        baseline: 82.5,
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
        targetLabel: '5',
        baseline: 0,
        target: 5,
        direction: 'up',
      },
    ],
    supporting: ['Hire tracking in PostHog — live', 'Hire path stays LinkedIn only'],
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
        targetLabel: 'median ≥ 8 / week through Dec',
        baseline: 25,
        target: 8,
        direction: 'none',
        note: "August's 200 merges in 30 days was a farm spike — target is steady weeks, not that peak",
      },
      {
        id: 'KR3.2',
        label: 'Open PRs',
        window: 'now',
        baselineLabel: '—',
        targetLabel: '≤ 25',
        baseline: null,
        target: 25,
        direction: 'down',
      },
      {
        id: 'KR3.3',
        label: 'PRs closed without merging',
        window: '30 days',
        baselineLabel: '—',
        targetLabel: '< 10%',
        baseline: null,
        target: 10,
        direction: 'down',
        strict: true,
      },
    ],
    supporting: ['At least half of weekly merges visitor-facing, for 8 weeks before year-end'],
  },
];
