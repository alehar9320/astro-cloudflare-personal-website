/**
 * Visitor-facing changelog titles for What’s New.
 * Maps known shipped conventional-commit lines to short sentences.
 * Unknown items keep their meaning after SHA / type / PR chrome is stripped.
 */

export type VisitorChangelogEntry = {
  pr: number;
  subject: string;
  title: string;
};

/** Known shipped PRs on this site. Do not invent work that is not in the feed. */
export const VISITOR_CHANGELOG: readonly VisitorChangelogEntry[] = [
  {
    pr: 864,
    subject: 'Fix biography IFS Design System proof link hit target and mobile dock clearance',
    title: 'The IFS Design System link on Biography is easier to tap, including on phones',
  },
  {
    pr: 825,
    subject: 'Quiet Contact hire line to LinkedIn; no twin-mouth',
    title: 'Contact names one hire path: LinkedIn',
  },
  {
    pr: 823,
    subject: 'Cold-land Work/case so shared proof is a real site entry',
    title: 'Case pages opened from a shared link now show a way back to Work on phones',
  },
  {
    pr: 819,
    subject: 'What’s New: denser desktop Last-30 so lines clear composer',
    title: 'What’s New fits more updates above the chat dock on desktop',
  },
  {
    pr: 817,
    subject: 'Raise home Read the case 44x44 hit-box clear of dock',
    title: 'Home “Read the case” stays clear of the chat dock',
  },
  {
    pr: 815,
    subject: 'Keep home Read the case clear of the docked composer',
    title: 'Home “Read the case” stays clear of the chat dock',
  },
  {
    pr: 1167,
    subject: 'What’s New: hiring visitors read outcome lines, not eng shorthand',
    title: 'What’s New now describes each update in plain language',
  },
  {
    pr: 945,
    subject: "in-sentence What's New link to /whats-new/",
    title: 'The “This site” page now links to What’s New',
  },
  {
    pr: 1020,
    subject:
      'Hiring managers on the copilots case get a continue to IFS Design System proof, not a circular stub',
    title: 'The AI coding copilots case now ends with a link to the IFS Design System case',
  },
  {
    pr: 1019,
    subject: 'quiet open welcome h2 to AI twin',
    title: 'Open chat shows a quieter “AI twin” heading',
  },
  {
    pr: 1107,
    subject: 'drop in-body LinkedIn; keep chrome ContactCTA',
    title: 'Biography ends with a single LinkedIn link',
  },
  {
    pr: 1116,
    subject: 'Analytics: Get in touch from chrome only',
    title: 'The user behavior analytics case ends with a single LinkedIn link',
  },
  {
    pr: 1110,
    subject: 'Copilots: Get in touch from chrome only',
    title: 'The AI coding copilots case ends with a single LinkedIn link',
  },
  {
    pr: 1109,
    subject: 'drop in-body hire-cta; keep chrome ContactCTA',
    title: 'Work ends with a single LinkedIn link',
  },
  {
    pr: 1642,
    subject: 'drop thesis in-body Get in touch; add 404 to HireSurface',
    title: 'The master thesis case ends with a single LinkedIn link',
  },
  {
    pr: 983,
    subject:
      'Visitors on the IFS Design System case take Get in touch from chrome, not a second primary under the H1',
    title: 'The IFS Design System case ends with a single LinkedIn link',
  },
  {
    pr: 1034,
    subject: 'link copilots mention to the case',
    title: 'Biography links the AI coding copilots mention to its case',
  },
  {
    pr: 1035,
    subject: 'link M.Sc. row to master-thesis case',
    title: 'Biography links the M.Sc. entry to the master thesis case',
  },
  {
    pr: 1635,
    subject: 'align leftover hire hint to LinkedIn',
    title: 'The 404 page hint now just says LinkedIn',
  },
  {
    pr: 1634,
    subject: 'start desktop open stage below the header nav',
    title: 'With chat open on a laptop, the header nav links stay clickable',
  },
  {
    pr: 939,
    subject: 'Give laptop open chat a conversation stage under the header',
    title: 'On a laptop, open chat sits under the header instead of covering the whole page',
  },
  {
    pr: 1643,
    subject: 'case meta descriptions describe the case, not the hire CTA',
    title: 'Shared Work case links now preview what each case is about',
  },
  {
    pr: 1644,
    subject: 'page and feed descriptions describe the page, not the hire CTA',
    title:
      'Shared links to Home, Biography, Work and Contact, and the RSS feed, now describe the page itself',
  },
  {
    pr: 524,
    subject: 'rewrite What’s New for visitors',
    title: 'What’s New rewritten for visitors',
  },
  {
    pr: 523,
    subject: 'rewrite /experimental/now/ for visitors',
    title: 'Now page rewritten for visitors',
  },
  {
    pr: 522,
    subject: 'drop experimental pages from the sitemap',
    title: 'Experimental pages removed from the sitemap',
  },
  {
    pr: 521,
    subject: 'drop sitemap URLs that 404',
    title: 'Sitemap no longer lists pages that 404',
  },
  {
    pr: 520,
    subject: 'add a live RSS feed for the work',
    title: 'RSS feed of the work',
  },
  {
    pr: 519,
    subject: 'offer LinkedIn hire on the not-found page',
    title: 'Get in touch on LinkedIn from the not-found page',
  },
  {
    pr: 518,
    subject: 'add a working web app manifest',
    title: 'Web app manifest',
  },
  {
    pr: 517,
    subject: 'add a working apple-touch-icon',
    title: 'Home-screen icon',
  },
  {
    pr: 516,
    subject: 'point robots.txt at the live sitemap',
    title: 'robots.txt points at the sitemap',
  },
  {
    pr: 515,
    subject: 'add a live sitemap for search',
    title: 'Sitemap of the live site',
  },
  {
    pr: 514,
    subject: 'add live rel=canonical for search and shares',
    title: 'Canonical URL for the live site',
  },
  {
    pr: 513,
    subject: 'make the twin the Home first-view',
    title: 'Chat is the first view on Home',
  },
  {
    pr: 511,
    subject: 'put the Home headshot in the twin',
    title: 'Home headshot in the chat',
  },
  {
    pr: 510,
    subject: 'keep the docked chat FAB off footer GitHub at 1280',
    title: 'Chat button no longer covers the footer GitHub link',
  },
  {
    pr: 508,
    subject: 'conversational fold for the twin',
    title: 'Conversational layout for the chat',
  },
  {
    pr: 507,
    subject: 'add PM/DevEx to work-case share description',
    title: 'Work-case shares include Product Manager, Developer Experience',
  },
  {
    pr: 506,
    subject: 'work-case browser titles include PM/DevEx',
    title: 'Work-case browser titles include Product Manager, Developer Experience',
  },
  {
    pr: 505,
    subject: 'work-case share preview includes PM/DevEx and LinkedIn',
    title: 'Work-case share preview includes Product Manager, Developer Experience and LinkedIn',
  },
  {
    pr: 504,
    subject: 'point share URLs at the live site',
    title: 'Share URLs point at the live site',
  },
  {
    pr: 503,
    subject: 'point structured data at the live site',
    title: 'Structured data points at the live site',
  },
  {
    pr: 496,
    subject: 'put IFS Design System first and Lidköping last on /work',
    title: 'IFS Design System first on Work, Lidköping last',
  },
  {
    pr: 502,
    subject: 'show the published design-system outcome on /work',
    title: 'Published design-system outcome on Work',
  },
  {
    pr: 501,
    subject: 'point LinkedIn share photos at the live portrait',
    title: 'LinkedIn share photos use the live portrait',
  },
  {
    pr: 500,
    subject: 'set the twin idle prompt to Ask about the work',
    title: 'Chat prompt is Ask about the work',
  },
  {
    pr: 499,
    subject: 'let visitors clear the twin chat and drop the FAB portrait',
    title: 'Visitors can clear the chat',
  },
  {
    pr: 494,
    subject: "frame the master's thesis as earlier work, not a PM case",
    title: "Master's thesis framed as earlier work",
  },
  {
    pr: 493,
    subject: 'frame Lidköping as earlier work, not a PM case',
    title: 'Lidköping framed as earlier work',
  },
  {
    pr: 492,
    subject: 'rewrite analytics page as a visitor PM story',
    title: 'Analytics page rewritten for visitors',
  },
  {
    pr: 491,
    subject: 'rewrite copilots page as a visitor PM story',
    title: 'Copilots page rewritten for visitors',
  },
  {
    pr: 490,
    subject: 'fold About into Biography as one visitor page',
    title: 'About folded into Biography',
  },
  {
    pr: 489,
    subject: 'rewrite IFS Design System page as a visitor PM story',
    title: 'IFS Design System page rewritten for visitors',
  },
];

const BY_PR = new Map(VISITOR_CHANGELOG.map((entry) => [entry.pr, entry.title]));
const BY_SUBJECT = new Map(
  VISITOR_CHANGELOG.map((entry) => [entry.subject.toLowerCase(), entry.title])
);
/** Titles from VISITOR_CHANGELOG, so a second toVisitorRelease pass still knows a line is mapped. */
const MAPPED_TITLES = new Set(VISITOR_CHANGELOG.map((entry) => entry.title.toLowerCase()));

const SHA_PREFIX = /^[a-f0-9]{7,40}\s+/i;
const CONVENTIONAL_PREFIX =
  /^(feat|fix|chore|docs|refactor|test|style|perf|build|ci)(\([^)]+\))?:\s*/i;
const PR_SUFFIX = /(?:\s*\(#\d+\))+\s*$/;
/** Dev-only lines What's New must not show: docs/context-only commits and scrape/redaction wording. */
const DEV_ONLY_ITEM =
  /^(?:[a-f0-9]{7,40}\s+)?docs(?:\((?:context|readme|agents)\))?!?:|\bscrape\b|\bredaction\b/i;
/** A #NNN ref still left after the trailing (#PR) is stripped (e.g. "(#1639 follow-up)", "/work/ #1109 nits"). */
const INLINE_ISSUE_REF = /#\d+/;
/**
 * Matt's call (b), #1163: an UNMAPPED line is dev-shaped (hidden) when it still has a
 * conventional prefix or an "Area:" prefix (e.g. "What’s New:", "Analytics:"), or a code token:
 * #NNN, a file path, backticks, or dev words. Mapped VISITOR_CHANGELOG rows always render.
 */
const AREA_PREFIX = /^(?:[\p{L}\d’'&/-]+\s){0,2}[\p{L}\d’'&/-]+:\s/u;
/** Visitor-surface prefixes that may look like "Area:" but name a visitor thing (Johan 6098040346). */
const VISITOR_PREFIX =
  /^(?:new|updated)\s+(?:case|case study|page|post|project|section|talk)s?:\s/i;
const FILE_PATH =
  /`|\b[\w-]+\.(?:ts|tsx|js|mjs|cjs|astro|md|mdx|json|css|ya?ml|toml|html)\b|(?:^|\s)\.?\/?(?:src|public|scripts|context|docs|tests?)\/|(?:^|\s)\/[\w.-]+\//i;
const DEV_WORD =
  /\b(?:scrape|redaction|context|shorthand|regex|lint|eslint|prettier|posthog|tsconfig|wrangler|dependabot|deps?|bump|workflow|refactor|fixture|mock|stub|ssr|kv)\b/i;
/** "CI" only as an uppercase whole word, so visitor words that contain "ci" are never hit. */
const DEV_WORD_UPPER = /\bCI\b/;
/* Optimization (⚡ Bolt): Hoist PR_MATCH_REGEX and SPACES_REGEX to avoid dynamic RegExp instantiations on edge changelog title processing.
   Benchmark: Eliminates redundant regex creation during visitor title mapping. */
/** Every `(#N)` group; the lookup uses the LAST one, which is the squash PR (earlier ones are issue refs). */
const PR_MATCH_REGEX = /\(#(\d+)\)/g;
const MULTI_SPACES_REGEX = /\s{2,}/g;

/**
 * Strip SHA, conventional-commit type, and all trailing (#123) suffixes from a changelog line.
 */
export function stripChangelogChrome(raw: string): string {
  return raw
    .trim()
    .replace(SHA_PREFIX, '')
    .replace(CONVENTIONAL_PREFIX, '')
    .replace(PR_SUFFIX, '')
    .replace(MULTI_SPACES_REGEX, ' ')
    .trim();
}

function titleCaseFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const INTERNAL_CHANGELOG_ITEM =
  /\b(palette|oracle|scribe|sentinel|vantage|bolt|jules|kinetic|engine|prism|apex|aurora|janitor|observabilityclerk|stuntdouble|stunt[- ]double|archie)\b|\bcontent:\s*|[🎨🔮✍️🛡️🔍⚡🐱⚙️👩‍🚀👨‍💼❤️🧹📋🎭🏛️🧑‍🎓]|\bagent[- ]farm\b|\bgoogle-labs-jules\b|\bjohan nits\b|\bprune\b|\bparser\b|\bunit[- ]test\b|\bcoverage\b|\bvisitor[- ]changelog\b|\btest[- ]only\b|\bvitest\b|\bplaywright\b|\bposthog\b|\b(?:hire|tap) tracking\b/i;
const BULLET_PREFIX = /^[-*+]\s+/;

/**
 * The VISITOR_CHANGELOG title for a raw line (by its LAST `(#N)`, then by subject), or for a line
 * that already is a mapped title. Undefined when the line is unmapped.
 */
export function mappedVisitorTitle(raw: string): string | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  let lastPr: string | undefined;
  for (const match of trimmed.matchAll(PR_MATCH_REGEX)) lastPr = match[1];
  if (lastPr) {
    const byPr = BY_PR.get(Number(lastPr));
    if (byPr) return byPr;
  }
  const bySubject = BY_SUBJECT.get(stripChangelogChrome(trimmed).toLowerCase());
  if (bySubject) return bySubject;
  return MAPPED_TITLES.has(trimmed.toLowerCase()) ? trimmed : undefined;
}

/**
 * Matt's call (b): true when an UNMAPPED line still reads as an engineering squash (conventional or
 * "Area:" prefix, #NNN, file path, backticks, dev words). Mapped lines are never dev-shaped.
 */
export function isDevShapedUnmappedLine(raw: string): boolean {
  return !mappedVisitorTitle(raw) && isDevShapedLine(raw);
}

/** The dev-shape check alone, ignoring VISITOR_CHANGELOG (so tests can treat a mapped line as unmapped). */
export function isDevShapedLine(raw: string): boolean {
  const noSha = raw.trim().replace(SHA_PREFIX, '');
  if (CONVENTIONAL_PREFIX.test(noSha)) return true;
  if (AREA_PREFIX.test(noSha) && !VISITOR_PREFIX.test(noSha)) return true;
  const subject = stripChangelogChrome(raw);
  return (
    INLINE_ISSUE_REF.test(subject) ||
    FILE_PATH.test(subject) ||
    DEV_WORD.test(subject) ||
    DEV_WORD_UPPER.test(subject)
  );
}

/**
 * Visitor sentence for a changelog item. Lookup known shipped PRs, else sanitize.
 * Idempotent: already-visitor copy (no SHA / type / PR chrome) is returned as-is.
 */
export function toVisitorChangelogTitle(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;

  const mapped = mappedVisitorTitle(trimmed);
  if (mapped) return mapped;

  const subject = stripChangelogChrome(trimmed);
  if (subject === trimmed) return trimmed;
  if (!subject) return titleCaseFirst(trimmed.replace(SHA_PREFIX, '').trim());
  return titleCaseFirst(subject);
}

/**
 * Rewrite a GitHub release body so list items are visitor copy, not SHA + feat + (#PR).
 * Optimization: Uses pointer-based line scanning (`indexOf('\n', startPos)`) and a single-pass
 * transformation loop to eliminate `body.split('\n')` array allocations and dual iteration overhead on edge SSR requests.
 */
export function toVisitorReleaseBody(body: string): string {
  const result: string[] = [];
  let startPos = 0;
  let hadBullets = false;
  const len = body.length;

  while (startPos < len) {
    let nextNewline = body.indexOf('\n', startPos);
    if (nextNewline === -1) {
      nextNewline = len;
    }

    let line = body.slice(startPos, nextNewline);
    if (line.endsWith('\r')) {
      line = line.slice(0, -1);
    }
    startPos = nextNewline + 1;

    const trimmed = line.trim();
    if (!BULLET_PREFIX.test(trimmed)) continue;

    hadBullets = true;
    const message = trimmed.replace(BULLET_PREFIX, '');
    if (
      !INTERNAL_CHANGELOG_ITEM.test(message) &&
      !DEV_ONLY_ITEM.test(message) &&
      !isDevShapedUnmappedLine(message)
    ) {
      const title = toVisitorChangelogTitle(message);
      if (!INLINE_ISSUE_REF.test(title)) result.push(`- ${title}`);
    }
  }

  if (result.length === 0) {
    if (hadBullets) return '';
    const trimmed = body.trim();
    return trimmed && !INTERNAL_CHANGELOG_ITEM.test(trimmed)
      ? toVisitorChangelogTitle(trimmed)
      : '';
  }

  return result.join('\n');
}

/**
 * Keep dates, URLs, and versions. Replace changelog names with visitor sentences.
 */
export function toVisitorRelease<T extends { body: string }>(release: T): T {
  return { ...release, body: toVisitorReleaseBody(release.body) };
}
