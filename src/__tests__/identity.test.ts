import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { fetchDirectNotFound, isDirectNotFoundPath } from '../direct-not-found';
import { toVisitorChangelogTitle, toVisitorRelease } from '../utils/visitor-changelog';

const files = [
  'src/pages/biography.astro',
  'src/pages/work.astro',
  'src/components/MainHead.astro',
  'public/llms.txt',
  'src/pages/api/chat.ts',
];

describe('identity copy', () => {
  const sources = files.map((path) => ({ path, text: readFileSync(path, 'utf8') }));

  it('does not use Strategic Product Leader in about, biography, meta, llms.txt, or the twin prompt', () => {
    for (const { path, text } of sources) {
      expect(text.toLowerCase(), path).not.toContain('strategic product leader');
      expect(text.toLowerCase(), path).not.toContain('strategic product leadership');
    }
  });

  it('uses Product Manager, Developer Experience as the title', () => {
    for (const { path, text } of sources) {
      expect(text, path).toContain('Product Manager, Developer Experience');
    }
  });

  it('does not mint unverifiable metrics on Biography, Work, or the twin', () => {
    const work = sources.find((s) => s.path.endsWith('work.astro'))!.text;
    const twin = sources.find((s) => s.path.endsWith('chat.ts'))!.text;
    const bio = sources.find((s) => s.path.endsWith('biography.astro'))!.text;
    for (const { path, text } of sources) {
      expect(text, path).not.toContain('multi-million');
      expect(text, path).not.toContain('several millions');
      expect(text, path).not.toContain('Strategic Product Management');
    }
    expect(bio).not.toContain('autonomous industrial AI');
    expect(bio).not.toContain('mailto:');
    expect(bio).toContain('/work/ifs-design-system/');
    expect(bio).toContain('https://www.linkedin.com/in/alehar/');
    expect(bio).toContain('class="timeline"');
    expect(work).toContain('Product Manager, Developer Experience');
    expect(bio).toContain('Product Manager, Developer Experience at IFS.');
    expect(bio).not.toContain('Explore the professional journey');
    expect(bio).not.toContain('No new numbered');
    expect(bio).not.toContain('only numbered proof');
    expect(bio).toContain("Get in touch on{' '}");
    expect(bio.replace(/\s+/g, ' ')).toContain('up to 2x faster delivery');
    expect(bio).toContain('up to 30x ROI');
    expect(twin).toContain('up to 2x faster delivery');
    expect(twin).toContain('up to 30x ROI');
  });

  it('keeps spaces around TL;DR strong terms (Astro drops newline-only spaces)', () => {
    const work = sources.find((s) => s.path.endsWith('work.astro'))!.text;
    expect(work).toContain("{' '}<strong>IFS</strong>");
  });

  it('keeps the chat FAB off Get in touch on a phone', () => {
    const home = readFileSync('src/pages/index.astro', 'utf8');
    const chat = readFileSync('src/components/Chat.astro', 'utf8');
    const cta = readFileSync('src/components/ContactCTA.astro', 'utf8');
    const global = readFileSync('src/styles/global.css', 'utf8');
    expect(global).toContain('--chat-fab-clearance');
    expect(chat).toContain('bottom: var(--chat-fab-offset)');
    expect(chat).toContain('width: var(--chat-fab-size)');
    expect(home).toContain('padding-block: 1rem var(--chat-fab-clearance)');
    expect(home).toContain('justify-content: flex-start');
    expect(home).toContain('https://www.linkedin.com/in/alehar/');
    expect(home).toContain('Get in touch');
    expect(home).toContain('LinkedIn · replies from me');
    expect(home).toContain('class="hero-copy"');
    expect(home).toContain('proof-card');
    expect(home).toContain('From the first version to IFS Cloud.');
    expect(home).not.toContain('inception');
    expect(home).not.toContain('mailto:');
    expect((home.match(/<Hero/g) || []).length).toBe(1);
    expect((home.match(/class="proof-card"/g) || []).length).toBe(1);
    expect(cta).toContain('var(--chat-fab-clearance)');
    expect(cta).toContain('https://www.linkedin.com/in/alehar/');
    expect(cta).toContain('Get in touch');
    expect(cta).not.toContain('mailto:');
    expect(cta).toContain('LinkedIn · replies from me');
    expect(cta).not.toContain('high-impact');
  });

  it('keeps the chat FAB off Earlier work and the biography timeline on a phone', () => {
    const work = readFileSync('src/pages/work.astro', 'utf8');
    const bio = readFileSync('src/pages/biography.astro', 'utf8');
    expect(work).toContain('padding-bottom: var(--chat-fab-clearance)');
    expect(work).toContain('padding-right: var(--chat-fab-clearance)');
    expect(work).toContain('Earlier work');
    expect(bio).toContain('padding-bottom: var(--chat-fab-clearance)');
    expect(bio).toContain('padding-right: var(--chat-fab-clearance)');
    expect(bio).toContain('class="timeline"');
    expect(bio).toContain('https://www.linkedin.com/in/alehar/');
  });

  it('keeps the chat FAB off the LinkedIn hire CTA on /contact on a phone', () => {
    const contact = readFileSync('src/pages/contact.astro', 'utf8');
    const footer = readFileSync('src/components/Footer.astro', 'utf8');
    expect(contact).toContain('padding-bottom: var(--chat-fab-clearance)');
    expect(contact).toContain('padding-right: var(--chat-fab-clearance)');
    expect(contact).toContain('https://www.linkedin.com/in/alehar/');
    expect(contact).toContain('Get in touch');
    expect(contact).not.toContain('mailto:');
    expect(contact).toContain('Product Manager, Developer Experience');
    expect(contact).not.toContain('Open to conversations');
    expect(contact).toContain('LinkedIn · replies from me');
    expect(footer).toContain('padding: 3rem 2rem var(--chat-fab-clearance)');
  });

  it('keeps the docked chat FAB off the footer GitHub link at 1280', () => {
    const footer = readFileSync('src/components/Footer.astro', 'utf8');
    expect(footer).toContain('padding: 2.5rem 5rem var(--chat-fab-clearance)');
    expect(footer).toContain('padding-right: var(--chat-fab-clearance)');
    expect(footer).toContain('https://github.com/alehar9320');
    expect(footer).toContain('https://www.linkedin.com/in/alehar/');
    expect(footer).not.toContain('mailto:');
  });

  it('drops Latest Updates from the footer and keeps What’s New', () => {
    const footer = readFileSync('src/components/Footer.astro', 'utf8');
    expect(footer).not.toContain('Latest Updates');
    expect(footer).not.toContain('/whats-new');
    expect(footer).toContain('https://www.linkedin.com/in/alehar/');
    expect(footer).not.toContain('mailto:');
    expect(existsSync('src/pages/whats-new.astro')).toBe(true);
    const page = readFileSync('src/pages/whats-new.astro', 'utf8');
    expect(page).toContain('A public changelog of this site.');
  });

  it('drops Report an issue from the footer and keeps LinkedIn hire', () => {
    const footer = readFileSync('src/components/Footer.astro', 'utf8');
    expect(footer).not.toContain('Report an issue');
    expect(footer).not.toMatch(/github\.com\/[^\s"']+\/issues/);
    expect(footer).not.toContain('Latest Updates');
    expect(footer).toContain('https://www.linkedin.com/in/alehar/');
    expect(footer).not.toContain('mailto:');
    expect(footer).not.toContain('https://github.com/alehar9320/astro-cloudflare-personal-website');
    expect(footer).toContain('https://github.com/alehar9320');
  });

  it('drops agentic engineering from the footer and keeps LinkedIn hire', () => {
    const footer = readFileSync('src/components/Footer.astro', 'utf8');
    expect(footer).not.toContain('agentic engineering');
    expect(footer).not.toContain('Built and run with');
    expect(footer).not.toContain('Latest Updates');
    expect(footer).not.toContain('Report an issue');
    expect(footer).toContain('https://www.linkedin.com/in/alehar/');
    expect(footer).not.toContain('mailto:');
  });

  it('drops Source from the footer and keeps LinkedIn hire', () => {
    const footer = readFileSync('src/components/Footer.astro', 'utf8');
    expect(footer).not.toContain('>Source</span>');
    expect(footer).not.toContain('source-link');
    expect(footer).not.toContain('View source code for this site');
    expect(footer).not.toContain('https://github.com/alehar9320/astro-cloudflare-personal-website');
    expect(footer).toContain('https://github.com/alehar9320');
    expect(footer).not.toContain('Latest Updates');
    expect(footer).not.toContain('Report an issue');
    expect(footer).not.toContain('agentic engineering');
    expect(footer).toContain('https://www.linkedin.com/in/alehar/');
    expect(footer).not.toContain('mailto:');
  });

  it('drops Instagram and Facebook from the footer and keeps LinkedIn hire', () => {
    const footer = readFileSync('src/components/Footer.astro', 'utf8');
    expect(footer).not.toContain('instagram.com');
    expect(footer).not.toContain('facebook.com');
    expect(footer).toContain('https://www.linkedin.com/in/alehar/');
    expect(footer).toContain('https://github.com/alehar9320');
    expect(footer).not.toContain('mailto:');
    expect(footer).not.toContain('Latest Updates');
    expect(footer).not.toContain('Report an issue');
    expect(footer).not.toContain('agentic engineering');
    expect(footer).not.toContain('>Source</span>');
    expect(footer).not.toContain('source-link');
  });

  it('drops Designed & Developed from the footer and keeps LinkedIn hire', () => {
    const footer = readFileSync('src/components/Footer.astro', 'utf8');
    const nav = readFileSync('src/components/Nav.astro', 'utf8');
    expect(footer).not.toContain('Designed & Developed');
    expect(footer).toContain('https://www.linkedin.com/in/alehar/');
    expect(footer).toContain('https://github.com/alehar9320');
    expect(footer).not.toContain('mailto:');
    expect(footer).toContain('Stockholm');
    expect(footer).toContain('Sweden');
    expect(footer).not.toContain('href="https://astro.build/"');
    expect(footer).not.toContain('instagram.com');
    expect(footer).not.toContain('facebook.com');
    expect(nav).not.toContain('instagram.com');
    expect(nav).not.toContain('facebook.com');
    expect(footer).not.toContain('Latest Updates');
    expect(footer).not.toContain('Report an issue');
    expect(footer).not.toContain('agentic engineering');
    expect(footer).not.toContain('>Source</span>');
    expect(footer).not.toContain('source-link');
  });

  it('drops with Astro from the footer and keeps LinkedIn hire', () => {
    const footer = readFileSync('src/components/Footer.astro', 'utf8');
    const nav = readFileSync('src/components/Nav.astro', 'utf8');
    expect(footer).not.toContain('with Astro');
    expect(footer).not.toContain('href="https://astro.build/"');
    expect(footer).not.toContain('>Astro</a>');
    expect(footer).toContain('https://www.linkedin.com/in/alehar/');
    expect(footer).toContain('https://github.com/alehar9320');
    expect(footer).not.toContain('mailto:');
    expect(footer).toContain('Stockholm');
    expect(footer).toContain('Sweden');
    expect(footer).not.toContain('instagram.com');
    expect(footer).not.toContain('facebook.com');
    expect(nav).not.toContain('instagram.com');
    expect(nav).not.toContain('facebook.com');
    expect(footer).not.toContain('Designed & Developed');
    expect(footer).not.toContain('Latest Updates');
    expect(footer).not.toContain('Report an issue');
    expect(footer).not.toContain('agentic engineering');
    expect(footer).not.toContain('>Source</span>');
    expect(footer).not.toContain('source-link');
  });

  it('drops pin and flag emoji from the footer and keeps LinkedIn hire', () => {
    const footer = readFileSync('src/components/Footer.astro', 'utf8');
    const nav = readFileSync('src/components/Nav.astro', 'utf8');
    expect(footer).not.toContain('📍');
    expect(footer).not.toContain('🇸🇪');
    expect(footer).toContain('Stockholm');
    expect(footer).toContain('Sweden');
    expect(footer).toContain('https://www.linkedin.com/in/alehar/');
    expect(footer).not.toContain('mailto:');
    expect(nav).not.toContain('instagram.com');
    expect(nav).not.toContain('facebook.com');
    expect(footer).not.toContain('instagram.com');
    expect(footer).not.toContain('facebook.com');
    expect(footer).not.toContain('with Astro');
    expect(footer).not.toContain('Designed & Developed');
    expect(footer).not.toContain('Latest Updates');
    expect(footer).not.toContain('Report an issue');
    expect(footer).not.toContain('agentic engineering');
    expect(footer).not.toContain('>Source</span>');
    expect(footer).not.toContain('source-link');
  });

  it('drops Instagram and Facebook from site socials and keeps LinkedIn hire', () => {
    const nav = readFileSync('src/components/Nav.astro', 'utf8');
    const footer = readFileSync('src/components/Footer.astro', 'utf8');
    expect(nav).not.toContain('instagram.com');
    expect(nav).not.toContain('facebook.com');
    expect(footer).not.toContain('instagram.com');
    expect(footer).not.toContain('facebook.com');
    expect(nav).toContain('https://www.linkedin.com/in/alehar');
    expect(footer).toContain('https://www.linkedin.com/in/alehar/');
    expect(nav).toContain('https://github.com/alehar9320');
    expect(footer).toContain('https://github.com/alehar9320');
    expect(nav).not.toContain('mailto:');
    expect(footer).not.toContain('mailto:');
    expect(nav.toLowerCase()).not.toContain('alexander-harenstam-cv');
    expect(footer.toLowerCase()).not.toContain('alexander-harenstam-cv');
    expect(nav).not.toContain('.pdf');
    expect(footer).not.toContain('.pdf');
    expect(nav).not.toContain('instagram-logo');
    expect(nav).not.toContain('facebook-logo');
  });

  it('keeps the header terminal glyph and drops the competing footer rocket', () => {
    const nav = readFileSync('src/components/Nav.astro', 'utf8');
    const footer = readFileSync('src/components/Footer.astro', 'utf8');
    expect(nav).toContain('icon="terminal-window"');
    expect(nav).not.toContain('rocket-launch');
    expect(footer).not.toContain('rocket-launch');
    expect(footer).not.toContain('icon="rocket');
    expect(footer).not.toContain('M94.1 184.6');
    expect(footer).not.toContain('favicon.svg');
    expect(footer).not.toContain('terminal-window');
    expect(footer).not.toContain('href="https://astro.build/"');
    expect(footer).not.toContain('>Astro</a>');
    expect(footer).toContain('https://www.linkedin.com/in/alehar/');
    expect(footer).not.toContain('mailto:');
  });

  it('shows a Live / Not live signal on the chat header', () => {
    const chat = readFileSync('src/components/Chat.astro', 'utf8');
    expect(chat).toContain('chat-live-label');
    expect(chat).toContain('class="status-dot"');
    expect(chat).toContain("idle: 'Live'");
    expect(chat).toContain("error: 'Not live'");
    expect(chat).not.toContain("idle: 'Available'");
    expect(chat).not.toContain('.chat-toggle .status-dot');
  });

  it('points structured data at the live site, not harenstam.com', () => {
    const home = readFileSync('src/pages/index.astro', 'utf8');
    expect(home).toContain("'@id': 'https://me.alehar.workers.dev/#person'");
    expect(home).toContain("url: 'https://me.alehar.workers.dev/'");
    expect(home).toContain("url: 'https://me.alehar.workers.dev/assets/portrait.png'");
    expect(home).not.toContain('https://harenstam.com/');
    expect(home).toContain('https://www.linkedin.com/in/alehar/');
    expect(home).toContain('Product Manager, Developer Experience');
    expect(home).not.toContain('mailto:');
  });

  it('points LinkedIn share photos at the live portrait, not a 404', () => {
    const head = readFileSync('src/components/MainHead.astro', 'utf8');
    expect(head).toContain("shareImage = 'https://me.alehar.workers.dev/assets/portrait.png'");
    expect(head).toContain('property="og:image"');
    expect(head).toContain('content={shareImage}');
    expect(head).not.toContain('https://harenstam.com/assets/portrait.png');
    expect(head).not.toContain('mailto:');
  });

  it('points share URLs at the live site, not localhost', () => {
    const head = readFileSync('src/components/MainHead.astro', 'utf8');
    expect(head).toContain("liveOrigin = 'https://me.alehar.workers.dev'");
    expect(head).toContain('new URL(Astro.url.pathname, liveOrigin)');
    expect(head).toContain('property="og:url"');
    expect(head).toContain('name="twitter:url"');
    expect(head).toContain('content={shareUrl}');
    expect(head).toContain('rel="canonical"');
    expect(head).toContain('href={canonicalUrl}');
    expect(head).not.toContain('content={Astro.url}');
    expect(head).not.toContain('localhost');
    expect(head).not.toContain('harenstam.com');
  });

  it('keeps the twin idle prompt as Ask about the work', () => {
    const chat = readFileSync('src/components/Chat.astro', 'utf8');
    expect(chat).toContain('placeholder="Ask about the work"');
    expect(chat).not.toContain('Ask me something');
    expect(chat).not.toContain('chat-toggle-portrait');
    expect(chat).not.toContain('mailto:');
    expect(chat).toContain("idle: 'Live'");
    expect(chat).toContain("error: 'Not live'");
  });

  it('lets a visitor clear the twin chat and keeps identity in the header, not the FAB', () => {
    const chat = readFileSync('src/components/Chat.astro', 'utf8');
    expect(chat).toContain('aria-label="Clear conversation"');
    expect(chat).toContain('clearConversation');
    expect(chat).toContain('chat-header-avatar');
    expect(chat).toContain('Ask Alexander');
    expect(chat).not.toContain('chat-toggle-portrait');
    expect(chat).not.toContain('mailto:');
    expect(chat).toContain("idle: 'Live'");
    expect(chat).toContain("error: 'Not live'");
  });

  it('puts the Home headshot in the twin and drops the 480 page portrait', () => {
    const home = readFileSync('src/pages/index.astro', 'utf8');
    const chat = readFileSync('src/components/Chat.astro', 'utf8');
    expect(home).not.toContain('class="portrait"');
    expect(home).not.toContain('width="480"');
    expect(home).toContain("url: 'https://me.alehar.workers.dev/assets/portrait.png'");
    expect(home).toContain('https://www.linkedin.com/in/alehar/');
    expect(home).toContain('Get in touch');
    expect(home).not.toContain('mailto:');
    expect(chat).toContain('chat-welcome-portrait');
    expect(chat).toContain('/assets/portrait.png');
    expect(chat).toContain(
      'alt="Alexander Härenstam smiling in a red plaid shirt and tortoise shell glasses"'
    );
    expect(chat).not.toContain('chat-toggle-portrait');
    expect(chat).not.toContain('mailto:');
  });

  it('makes the twin the first-view chat with a headshot, follow-ups, and a docked FAB', () => {
    const chat = readFileSync('src/components/Chat.astro', 'utf8');
    const home = readFileSync('src/pages/index.astro', 'utf8');
    expect(chat).toContain('chat-welcome-portrait');
    expect(chat).toContain('/assets/portrait.png');
    expect(chat).toContain('class="chat-header-avatar" width="64" height="64"');
    expect(chat).toContain('chat-followups');
    expect(chat).toContain('showFollowUps');
    expect(chat).toContain('is-prominent');
    expect(chat).toContain('is-docked');
    expect(chat).toContain('dockChat');
    expect(chat).not.toContain('mailto:');
    expect(chat).not.toContain('harenstam.com');
    expect(chat).toContain('M7.9 20A9 9 0 1 0 4 16.1L2 22Z');
    expect(chat).not.toContain('chat-toggle-portrait');
    expect(home).toContain('https://www.linkedin.com/in/alehar/');
    expect(home).toContain('Get in touch');
    expect(home).toContain('Hero title="Product Manager, Developer Experience at IFS"');
    expect(home).not.toContain('mailto:');
    expect(chat).toContain('has-prominent-chat');
    expect(chat).toContain('min(32rem, calc(50vw - 2rem))');
    expect(chat).toContain('--prominent-phone-top');
    expect(chat).toContain('layoutProminentPhone');
    expect(chat).toContain('cta-hint');
    expect(home).toContain('Get in touch');
    expect(home).toContain('LinkedIn · replies from me');
    expect(home).toContain('body.has-prominent-chat');
    expect(home).toContain('proof-card');
    expect(home).toContain('Hero title="Product Manager, Developer Experience at IFS"');
  });

  it('keeps the chat FAB off the 2x/30x/Zeroheight proof on the design system case on a phone', () => {
    const slug = readFileSync('src/pages/work/[...slug].astro', 'utf8');
    const ds = readFileSync('src/content/work/ifs-design-system.md', 'utf8');
    expect(slug).toContain('ifs-design-system');
    expect(slug).toContain('ds-proof');
    expect(slug).toContain('.ds-proof :global(ul)');
    expect(slug).toContain('padding-bottom: var(--chat-fab-clearance)');
    expect(slug).toContain('padding-right: var(--chat-fab-clearance)');
    expect(ds).toContain('**Up to 2x faster**');
    expect(ds).toContain('**Up to 30x ROI**');
    expect(ds).toContain('**Zeroheight Design System Awards**');
    expect(ds).toContain('Product Manager, Developer Experience');
    expect(ds).not.toContain('This page is the proof');
    expect(ds).not.toContain('Decisions and tradeoffs');
    expect(ds).not.toContain('inception');
    expect(ds).not.toContain('mailto:');
  });

  it('keeps the chat FAB off Earlier work case body copy on a phone', () => {
    const slug = readFileSync('src/pages/work/[...slug].astro', 'utf8');
    expect(slug).toContain('earlier-case');
    expect(slug).toContain('ai-coding-copilots');
    expect(slug).toContain('user-behavior-analytics');
    expect(slug).toContain('master-thesis');
    expect(slug).toContain('lidkoping-stenhuggeri');
    expect(slug).toContain('.earlier-case > :global(:last-child)::before');
    expect(slug).toContain('float: right');
    expect(slug).toContain('.earlier-case :global(.tldr-box)');
    expect(slug).toContain('min-height: calc(100svh - var(--chat-fab-clearance))');
    expect(slug).not.toContain('.earlier-case :global(p)');
    expect(slug).not.toContain('.earlier-case :global(li)');
    expect(slug).not.toMatch(/\.earlier-case\s*\{[^}]*padding-right:/s);
    expect(slug).not.toMatch(/\.earlier-case :global\(\.tldr-box\)\s*\{[^}]*padding-right:/s);
    expect(slug).not.toContain('mailto:');
    const copilots = readFileSync('src/content/work/ai-coding-copilots.md', 'utf8');
    const analytics = readFileSync('src/content/work/user-behavior-analytics.md', 'utf8');
    const thesis = readFileSync('src/content/work/master-thesis.md', 'utf8');
    const lidkoping = readFileSync('src/content/work/lidkoping-stenhuggeri.md', 'utf8');
    expect(copilots).toContain('Internal AI coding copilots for');
    expect(analytics).toContain('Usage telemetry so');
    expect(thesis).toContain("Chalmers</strong> master's thesis, 2017");
    expect(lidkoping).toContain('Early Android work, 2013');
  });

  it('keeps only the IFS Design System on the main /work card grid', () => {
    const work = sources.find((s) => s.path.endsWith('work.astro'))!.text;
    expect(work).toContain("'lidkoping-stenhuggeri'");
    expect(work).toContain("'ai-coding-copilots'");
    expect(work).toContain("'user-behavior-analytics'");
    expect(work).toContain("'master-thesis'");
    expect(work).toContain("featuredOrder = ['ifs-design-system']");
    expect(work).toContain("'master-thesis',\n  'lidkoping-stenhuggeri'");
    expect(work).toContain('const ordered = [...featured, ...earlier]');
    expect(work).toContain('Earlier work');
    expect(work).toContain('Early Android work, 2013.');
    expect(work).toContain('Internal AI coding copilots for IFS engineering teams.');
    expect(work).toContain('Usage telemetry for IFS Cloud roadmap decisions.');
    expect(work).toContain("Chalmers master's thesis, 2017.");
    expect(work).not.toContain('multi-million');
    expect(work).not.toContain('Strategic Portfolio');
    expect(work).toContain('title="Work"');
    expect(work).toContain('The IFS Design System case, then earlier work.');
    expect(work).toContain('class="proof-card"');
    expect(work).toContain('From the first version to IFS Cloud.');
    expect(work).toContain('Up to 2x faster delivery');
    expect(work).toContain('Up to 30x ROI');
    expect(work).toContain('Zeroheight runner-up');
    expect(work).toContain('/work/ifs-design-system/');
    expect(work).not.toContain('PortfolioPreview');
    expect(work).not.toContain('mailto:');
  });

  it('drops the Strategic Portfolio consultant frame from nav', () => {
    const nav = readFileSync('src/components/Nav.astro', 'utf8');
    expect(nav).not.toContain('Strategic Portfolio');
    expect(nav).toContain("{ label: 'Work', href: '/work/' }");
  });

  it('uses honest Earlier work labels, not Platform or copilots-as-product', () => {
    const copilots = readFileSync('src/content/work/ai-coding-copilots.md', 'utf8');
    const analytics = readFileSync('src/content/work/user-behavior-analytics.md', 'utf8');
    const thesis = readFileSync('src/content/work/master-thesis.md', 'utf8');
    const lidkoping = readFileSync('src/content/work/lidkoping-stenhuggeri.md', 'utf8');
    expect(copilots).toContain('title: Internal AI coding copilots');
    expect(copilots).not.toContain('title: AI Coding Copilots');
    expect(analytics).toContain('title: User behavior analytics');
    expect(analytics).not.toContain('title: User Behavior Analytics Platform');
    expect(thesis).toContain("title: Chalmers master's thesis");
    expect(thesis).not.toContain('title: Business Model Innovation');
    expect(lidkoping).toContain('title: Lidköping Stenhuggeri');
    expect(lidkoping).not.toContain('title: Lidköping Stenhuggeri App');
    expect(copilots).toContain('Internal AI coding copilots for');
    expect(copilots).not.toContain('not a customer product');
    expect(copilots).not.toContain('customer product');
    expect(copilots).toContain('Product Manager, Developer Experience');
    expect(copilots).toContain('Greater Stockholm');
    expect(copilots).not.toContain('mailto:');
    expect(copilots).not.toContain('No new numbered');
    expect(copilots).not.toContain('multi-million');
    expect(analytics).toContain('Usage telemetry so');
    expect(analytics).not.toContain('not a standalone platform product');
    expect(analytics).not.toContain('User Behavior Analytics Platform');
    expect(analytics).not.toContain('Strategic Leadership');
    expect(analytics).toContain('Product Manager, Developer Experience');
    expect(analytics).not.toContain('mailto:');
    expect(analytics).not.toContain('No new numbered');
    expect(thesis).toContain("Chalmers</strong> master's thesis, 2017");
    expect(thesis).toContain('This is earlier work');
    expect(thesis).toContain('/work/ifs-design-system/');
    expect(thesis).not.toContain('Product Manager');
    expect(thesis).not.toContain('mailto:');
    expect(lidkoping).toContain('Early Android work, 2013');
    expect(lidkoping).not.toContain('management platform');
    expect(lidkoping).toContain('This is earlier work');
    expect(lidkoping).toContain('/work/ifs-design-system/');
    expect(lidkoping).not.toContain('Product Manager');
    expect(lidkoping).not.toContain('mailto:');
    for (const page of [copilots, analytics, thesis, lidkoping]) {
      expect(page).not.toContain('stock-1.jpg');
      expect(page).not.toContain('stock-3.jpg');
      expect(page).not.toContain('stock-4.jpg');
      expect(page).not.toMatch(/^img:/m);
    }
  });

  it('drops the /about/ duplicate in favor of /biography/', () => {
    const nav = readFileSync('src/components/Nav.astro', 'utf8');
    const astro = readFileSync('astro.config.mjs', 'utf8');
    expect(nav).not.toContain("href: '/about/'");
    expect(nav).toContain("href: '/biography/'");
    expect(astro).toContain("'/about': '/biography/'");
    expect(astro).not.toContain("'/about/': '/biography/'");
    expect(nav).not.toContain("'About'");
  });

  it('lets a work-case share read Product Manager, Developer Experience at IFS and LinkedIn', () => {
    const slug = readFileSync('src/pages/work/[...slug].astro', 'utf8');
    expect(slug).toContain('Product Manager, Developer Experience at IFS');
    expect(slug).toContain('Get in touch on LinkedIn.');
    expect(slug).toContain(
      'Product Manager, Developer Experience at IFS. ${entry.data.description.trim()} Get in touch on LinkedIn.'
    );
    expect(slug).toContain('ogTitle={shareTitle}');
    expect(slug).toContain("title={shareTitle ?? 'Not Found'}");
    expect(slug).not.toContain('mailto:');
    expect(slug).not.toContain('harenstam.com');
  });

  it('lets a work-case browser title read Product Manager, Developer Experience at IFS', () => {
    const slug = readFileSync('src/pages/work/[...slug].astro', 'utf8');
    expect(slug).toContain("title={shareTitle ?? 'Not Found'}");
    expect(slug).toContain('ogTitle={shareTitle}');
    expect(slug).toContain('<Hero title={entry.data.title}');
    expect(slug).not.toContain("title={entry ? entry.data.title : 'Not Found'}");
    expect(slug).not.toContain('mailto:');
    expect(slug).not.toContain('harenstam.com');
  });

  it('lets Work, Biography, and Contact shares read Product Manager, Developer Experience at IFS', () => {
    const work = readFileSync('src/pages/work.astro', 'utf8');
    const bio = readFileSync('src/pages/biography.astro', 'utf8');
    const contact = readFileSync('src/pages/contact.astro', 'utf8');
    expect(work).toContain('title="Work | Product Manager, Developer Experience at IFS"');
    expect(bio).toContain('title="Biography | Product Manager, Developer Experience at IFS"');
    expect(contact).toContain(
      'title="Get in touch | Product Manager, Developer Experience at IFS"'
    );
    expect(work).not.toContain('title="Work | Alexander Härenstam"');
    expect(bio).not.toContain('title="Biography | Alexander Härenstam"');
    expect(contact).not.toContain('title="Get in touch | Alexander Härenstam"');
    expect(bio).toContain('https://www.linkedin.com/in/alehar/');
    expect(contact).toContain('https://www.linkedin.com/in/alehar/');
    expect(work).not.toContain('mailto:');
    expect(bio).not.toContain('mailto:');
    expect(contact).not.toContain('mailto:');
  });

  it('lets a Work share read Product Manager, Developer Experience at IFS and LinkedIn', () => {
    const head = readFileSync('src/components/MainHead.astro', 'utf8');
    const work = readFileSync('src/pages/work.astro', 'utf8');
    const cta = readFileSync('src/components/ContactCTA.astro', 'utf8');
    const shareDescription =
      'Product Manager, Developer Experience at IFS. Get in touch on LinkedIn.';
    expect(work).toContain(`description="${shareDescription}"`);
    expect(work).toContain('title="Work | Product Manager, Developer Experience at IFS"');
    expect(work).toContain('Product Manager, Developer Experience at IFS');
    expect(work).toContain('Get in touch on LinkedIn.');
    expect(cta).toContain('https://www.linkedin.com/in/alehar/');
    expect(work).not.toContain('mailto:');
    expect(cta).not.toContain('mailto:');
    expect(head).toContain('name="description" property="og:description" content={description}');
    expect(head).toContain('name="twitter:description" content={description}');
  });

  it('lets a Biography share read Product Manager, Developer Experience at IFS and LinkedIn', () => {
    const head = readFileSync('src/components/MainHead.astro', 'utf8');
    const bio = readFileSync('src/pages/biography.astro', 'utf8');
    const shareDescription =
      'Product Manager, Developer Experience at IFS. Get in touch on LinkedIn.';
    expect(bio).toContain(`description="${shareDescription}"`);
    expect(bio).toContain('title="Biography | Product Manager, Developer Experience at IFS"');
    expect(bio).toContain('https://www.linkedin.com/in/alehar/');
    expect(bio).not.toContain('mailto:');
    expect(head).toContain('name="description" property="og:description" content={description}');
    expect(head).toContain('name="twitter:description" content={description}');
  });

  it('lets a Home share read Product Manager, Developer Experience at IFS and LinkedIn', () => {
    const head = readFileSync('src/components/MainHead.astro', 'utf8');
    const home = readFileSync('src/pages/index.astro', 'utf8');
    const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
    const contact = readFileSync('src/pages/contact.astro', 'utf8');
    const shareDescription =
      'Product Manager, Developer Experience at IFS. Get in touch on LinkedIn.';
    expect(home).toContain('ogTitle="Product Manager, Developer Experience at IFS"');
    expect(home).toContain(`description="${shareDescription}"`);
    expect(contact).toContain(`description="${shareDescription}"`);
    expect(home).toContain('Hero title="Product Manager, Developer Experience at IFS"');
    expect(home).toContain('https://www.linkedin.com/in/alehar/');
    expect(home).not.toContain('mailto:');
    expect(contact).toContain('https://www.linkedin.com/in/alehar/');
    expect(contact).not.toContain('mailto:');
    expect(layout).toContain('ogTitle={ogTitle}');
    expect(head).toContain('content={shareTitle}');
    expect(head).toContain('property="og:title"');
    expect(head).toContain('name="description" property="og:description" content={description}');
    expect(head).toContain('name="twitter:description" content={description}');
    expect(head).not.toContain('Design systems, DevEx, and Industrial AI.');
    expect(head).toContain("description = 'Product Manager, Developer Experience at IFS.'");
  });

  it('lets the Home browser title read Product Manager, Developer Experience at IFS', () => {
    const home = readFileSync('src/pages/index.astro', 'utf8');
    expect(home).toContain(
      'title="Alexander Härenstam | Product Manager, Developer Experience at IFS"'
    );
    expect(home).toContain('ogTitle="Product Manager, Developer Experience at IFS"');
    expect(home).toContain('https://www.linkedin.com/in/alehar/');
    expect(home).not.toContain('mailto:');
  });

  it('lets Person.jobTitle read Product Manager, Developer Experience at IFS', () => {
    const home = readFileSync('src/pages/index.astro', 'utf8');
    const bio = readFileSync('src/pages/biography.astro', 'utf8');
    expect(home).toContain("jobTitle: 'Product Manager, Developer Experience at IFS'");
    expect(bio).toContain("jobTitle: 'Product Manager, Developer Experience at IFS'");
    expect(home).toContain('https://www.linkedin.com/in/alehar/');
    expect(bio).toContain('https://www.linkedin.com/in/alehar/');
    expect(home).not.toContain('mailto:');
    expect(bio).not.toContain('mailto:');
  });

  it('lets WebSite.name read Product Manager, Developer Experience at IFS', () => {
    const home = readFileSync('src/pages/index.astro', 'utf8');
    expect(home).toContain("'@type': 'WebSite'");
    expect(home).toContain(
      "name: 'Alexander Härenstam | Product Manager, Developer Experience at IFS'"
    );
    expect(home).toContain("jobTitle: 'Product Manager, Developer Experience at IFS'");
    expect(home).toContain('https://www.linkedin.com/in/alehar/');
    expect(home).not.toContain('mailto:');
  });

  it('lets WebSite.description read Product Manager, Developer Experience at IFS and LinkedIn', () => {
    const home = readFileSync('src/pages/index.astro', 'utf8');
    const websiteDescription =
      'Product Manager, Developer Experience at IFS. Get in touch on LinkedIn.';
    expect(home).toContain("'@type': 'WebSite'");
    expect(home).toContain(
      `'@type': 'WebSite',
      '@id': 'https://me.alehar.workers.dev/#website',
      url: 'https://me.alehar.workers.dev/',
      name: 'Alexander Härenstam | Product Manager, Developer Experience at IFS',
      publisher: { '@id': 'https://me.alehar.workers.dev/#person' },
      description: '${websiteDescription}'`
    );
    expect(home).toContain("jobTitle: 'Product Manager, Developer Experience at IFS'");
    expect(home).toContain('https://www.linkedin.com/in/alehar/');
    expect(home).not.toContain('mailto:');
  });

  it('lets Home WebPage.name read Product Manager, Developer Experience at IFS', () => {
    const home = readFileSync('src/pages/index.astro', 'utf8');
    const rss = readFileSync('src/pages/rss.xml.ts', 'utf8');
    expect(home).toContain("'@type': 'WebPage'");
    expect(home).toContain("'@id': 'https://me.alehar.workers.dev/#webpage'");
    expect(home).toContain(
      `'@type': 'WebPage',
      '@id': 'https://me.alehar.workers.dev/#webpage',
      url: 'https://me.alehar.workers.dev/',
      name: 'Alexander Härenstam | Product Manager, Developer Experience at IFS'`
    );
    expect(home).toContain("jobTitle: 'Product Manager, Developer Experience at IFS'");
    expect(home).toContain('https://www.linkedin.com/in/alehar/');
    expect(home).not.toContain('mailto:');
    expect(rss).toContain(
      '<title>Alexander Härenstam | Product Manager, Developer Experience at IFS</title>'
    );
    expect(rss).toContain('https://www.linkedin.com/in/alehar/');
    expect(rss).not.toContain('mailto:');
  });

  it('lets Home and Biography WebPage.description read Product Manager, Developer Experience at IFS and LinkedIn', () => {
    const home = readFileSync('src/pages/index.astro', 'utf8');
    const bio = readFileSync('src/pages/biography.astro', 'utf8');
    const webpageDescription =
      'Product Manager, Developer Experience at IFS. Get in touch on LinkedIn.';
    expect(home).toContain("'@type': 'WebPage'");
    expect(home).toContain(
      `'@type': 'WebPage',
      '@id': 'https://me.alehar.workers.dev/#webpage',
      url: 'https://me.alehar.workers.dev/',
      name: 'Alexander Härenstam | Product Manager, Developer Experience at IFS',
      about: { '@id': 'https://me.alehar.workers.dev/#person' },
      description: '${webpageDescription}'`
    );
    expect(bio).toContain("'@type': 'WebPage'");
    expect(bio).toContain(
      `'@type': 'WebPage',
      '@id': 'https://me.alehar.workers.dev/biography/#webpage',
      url: 'https://me.alehar.workers.dev/biography/',
      name: 'Biography | Product Manager, Developer Experience at IFS',
      about: { '@id': 'https://me.alehar.workers.dev/#person' },
      description: '${webpageDescription}'`
    );
    expect(home).toContain("jobTitle: 'Product Manager, Developer Experience at IFS'");
    expect(bio).toContain("jobTitle: 'Product Manager, Developer Experience at IFS'");
    expect(home).toContain('https://www.linkedin.com/in/alehar/');
    expect(bio).toContain('https://www.linkedin.com/in/alehar/');
    expect(home).not.toContain('mailto:');
    expect(bio).not.toContain('mailto:');
  });

  it('lets the RSS title read Product Manager, Developer Experience at IFS', () => {
    const rss = readFileSync('src/pages/rss.xml.ts', 'utf8');
    expect(rss).toContain(
      '<title>Alexander Härenstam | Product Manager, Developer Experience at IFS</title>'
    );
    expect(rss).toContain('https://www.linkedin.com/in/alehar/');
    expect(rss).not.toContain('mailto:');
  });

  it('lets the RSS channel description read Product Manager, Developer Experience at IFS and LinkedIn', () => {
    const rss = readFileSync('src/pages/rss.xml.ts', 'utf8');
    const channelDescription =
      'Product Manager, Developer Experience at IFS. Get in touch on LinkedIn.';
    expect(rss).toContain(`<description>${channelDescription}</description>`);
    expect(rss).toContain(
      '<title>Alexander Härenstam | Product Manager, Developer Experience at IFS</title>'
    );
    expect(rss).toContain('https://www.linkedin.com/in/alehar/');
    expect(rss).not.toContain('mailto:');
  });

  it('lets the Home RSS alternate link title read Product Manager, Developer Experience at IFS', () => {
    const head = readFileSync('src/components/MainHead.astro', 'utf8');
    const home = readFileSync('src/pages/index.astro', 'utf8');
    const rss = readFileSync('src/pages/rss.xml.ts', 'utf8');
    expect(head).toContain('rel="alternate"');
    expect(head).toContain('type="application/rss+xml"');
    expect(head).toContain(
      'title="Alexander Härenstam | Product Manager, Developer Experience at IFS"'
    );
    expect(head).toContain('https://me.alehar.workers.dev/rss.xml');
    expect(home).toContain('https://www.linkedin.com/in/alehar/');
    expect(head).not.toContain('mailto:');
    expect(home).not.toContain('mailto:');
    expect(rss).toContain(
      '<title>Alexander Härenstam | Product Manager, Developer Experience at IFS</title>'
    );
    expect(rss).toContain('https://www.linkedin.com/in/alehar/');
    expect(rss).not.toContain('mailto:');
  });

  it('grounds llms.txt with Chalmers education and recruiter keywords', () => {
    const llms = sources.find((s) => s.path.endsWith('llms.txt'))!.text;
    expect(llms).toContain('Chalmers B.Sc. Software Engineering');
    expect(llms).toContain('Management and Economics of Innovation');
    expect(llms).toContain('Greater Stockholm');
    expect(llms).toContain('AI coding copilots');
    expect(llms).toContain('IFS Cloud');
  });

  it('ships a live sitemap at /sitemap.xml so search can find the pages', () => {
    expect(existsSync('src/pages/sitemap.xml.ts')).toBe(true);
    const sitemap = readFileSync('src/pages/sitemap.xml.ts', 'utf8');
    expect(sitemap).toContain('https://me.alehar.workers.dev');
    expect(sitemap).toContain("liveOrigin = 'https://me.alehar.workers.dev'");
    expect(sitemap).toContain("'/'");
    expect(sitemap).toContain("'/work/'");
    expect(sitemap).toContain("'/biography/'");
    expect(sitemap).toContain("'/contact/'");
    expect(sitemap).toContain('ifs-design-system');
    expect(sitemap).not.toContain('/experimental/manifesto');
    expect(sitemap).not.toContain('/experimental/now');
    expect(sitemap).not.toContain('/experimental/reading-list');
    expect(sitemap).not.toContain('/whats-new');
    expect(sitemap).not.toContain('localhost');
    expect(sitemap).not.toContain('harenstam.com');
    expect(sitemap).not.toContain('mailto:');
    expect(existsSync('src/pages/whats-new.astro')).toBe(true);
    const footer = readFileSync('src/components/Footer.astro', 'utf8');
    expect(footer).toContain('https://www.linkedin.com/in/alehar/');
    expect(footer).not.toContain('mailto:');
  });

  it('points robots.txt at the live sitemap so search can find it', () => {
    expect(existsSync('public/robots.txt')).toBe(true);
    const robots = readFileSync('public/robots.txt', 'utf8');
    expect(robots).toContain('Sitemap: https://me.alehar.workers.dev/sitemap.xml');
    expect(robots).not.toContain('localhost');
    expect(robots).not.toContain('harenstam.com');
    expect(robots).not.toContain('mailto:');
  });

  it('ships a web app manifest so the live origin has a real manifest.webmanifest', () => {
    const head = readFileSync('src/components/MainHead.astro', 'utf8');
    expect(head).toContain('rel="manifest"');
    expect(head).toContain('/manifest.webmanifest');
    expect(existsSync('public/manifest.webmanifest')).toBe(true);
    const manifest = readFileSync('public/manifest.webmanifest', 'utf8');
    expect(manifest).toContain('https://me.alehar.workers.dev');
    expect(manifest).toContain('Alexander Härenstam');
    expect(manifest).toContain('Product Manager, Developer Experience');
    expect(manifest).not.toContain('localhost');
    expect(manifest).not.toContain('harenstam.com');
    expect(manifest).not.toContain('mailto:');
    expect(manifest).not.toContain('portrait.png');
    expect(manifest).toContain('favicon.svg');
    expect(manifest).toContain('icon-192.png');
    expect(manifest).toContain('icon-512.png');
  });

  it('offers LinkedIn hire on the not-found page next to Return to Homepage', () => {
    const page = readFileSync('src/pages/404.astro', 'utf8');
    const content = readFileSync('src/components/NotFoundContent.astro', 'utf8');
    const notFound = `${page}\n${content}`;
    expect(page).toContain('NotFoundContent');
    expect(notFound).toContain('https://www.linkedin.com/in/alehar/');
    expect(notFound).toContain('Get in touch');
    expect(notFound).toContain('Return to Homepage');
    expect(notFound).toContain('LinkedIn · replies from me');
    expect(notFound).toContain('data-hire-event="hire_cta_click"');
    expect(notFound).toContain('data-hire-surface="404"');
    expect(content).toContain('title="Page not found"');
    expect(content).toContain('tagline="This page isn\'t here."');
    expect(notFound).not.toContain("Let's get you back on track.");
    expect(notFound).not.toContain('Lost in Orbit?');
    expect(page).toContain('title="Page not found | Product Manager, Developer Experience at IFS"');
    expect(page).toContain(
      'ogTitle="Page not found | Product Manager, Developer Experience at IFS"'
    );
    const head = readFileSync('src/components/MainHead.astro', 'utf8');
    expect(page).toContain('description="This page isn\'t here."');
    expect(page).not.toContain('404 Error — this page was not found');
    expect(head).toContain('name="description" property="og:description" content={description}');
    expect(head).toContain('name="twitter:description" content={description}');
    expect(notFound).toContain('Product Manager, Developer Experience at IFS');
    expect(notFound).not.toContain('mailto:');
    expect(notFound).not.toContain('this is not on the site');
    expect(notFound).not.toContain("this isn't on the site yet");
    expect(notFound.toLowerCase()).not.toContain('this page is missing');
    expect(notFound.toLowerCase()).not.toContain("we couldn't find");
  });

  it('points 404 og:url and twitter:url at live Home', () => {
    const page = readFileSync('src/pages/404.astro', 'utf8');
    const head = readFileSync('src/components/MainHead.astro', 'utf8');
    expect(page).toContain('shareUrl="https://me.alehar.workers.dev/"');
    expect(page).toContain('canonicalUrl="https://me.alehar.workers.dev/"');
    expect(head).toContain('property="og:url"');
    expect(head).toContain('content={shareUrl}');
    expect(head).toContain('name="twitter:url"');
    expect(head).toContain('rel="canonical"');
    expect(head).toContain('href={canonicalUrl}');
  });

  it('GET /404/ returns HTTP 404', async () => {
    const page = readFileSync('src/pages/404.astro', 'utf8');
    const content = readFileSync('src/components/NotFoundContent.astro', 'utf8');
    const wrangler = readFileSync('wrangler.jsonc', 'utf8');
    const worker = readFileSync('src/cloudflare-worker.ts', 'utf8');
    expect(page).toContain('Astro.response.status = 404');
    expect(page).toContain('title="Page not found | Product Manager, Developer Experience at IFS"');
    expect(page).toContain('description="This page isn\'t here."');
    expect(page).toContain('shareUrl="https://me.alehar.workers.dev/"');
    expect(page).toContain('canonicalUrl="https://me.alehar.workers.dev/"');
    expect(content).toContain('title="Page not found"');
    expect(content).toContain('tagline="This page isn\'t here."');
    expect(content).toContain('https://www.linkedin.com/in/alehar/');
    expect(content).not.toContain('mailto:');
    expect(wrangler).toContain('./src/cloudflare-worker.ts');
    expect(wrangler).toContain('run_worker_first');
    expect(wrangler).toContain('"/404/"');
    expect(wrangler).toContain('"/404"');
    expect(worker).toContain('fetchDirectNotFound');
    expect(isDirectNotFoundPath('/404/')).toBe(true);
    expect(isDirectNotFoundPath('/404')).toBe(true);
    expect(isDirectNotFoundPath('/')).toBe(false);
    const html = "<h1>Page not found</h1><p>This page isn't here.</p>";
    const response = await fetchDirectNotFound(new Request('https://me.alehar.workers.dev/404/'), {
      fetch: async () => new Response(html, { status: 200 }),
    });
    expect(response.status).toBe(404);
    expect(await response.text()).toContain('Page not found');
  });

  it('ships a live RSS feed at /rss.xml so visitors can follow new work', () => {
    expect(existsSync('src/pages/rss.xml.ts')).toBe(true);
    const rss = readFileSync('src/pages/rss.xml.ts', 'utf8');
    expect(rss).toContain('https://me.alehar.workers.dev');
    expect(rss).toContain(
      '<title>Alexander Härenstam | Product Manager, Developer Experience at IFS</title>'
    );
    expect(rss).toContain(
      '<description>Product Manager, Developer Experience at IFS. Get in touch on LinkedIn.</description>'
    );
    expect(rss).toContain('ifs-design-system');
    expect(rss).not.toContain('localhost');
    expect(rss).not.toContain('harenstam.com');
    expect(rss).not.toContain('mailto:');
    const head = readFileSync('src/components/MainHead.astro', 'utf8');
    expect(head).toContain('rel="alternate"');
    expect(head).toContain('type="application/rss+xml"');
    expect(head).toContain('https://me.alehar.workers.dev/rss.xml');
  });

  it('ships an apple-touch-icon so iOS home-screen requests do not 404', () => {
    const head = readFileSync('src/components/MainHead.astro', 'utf8');
    expect(head).toContain('rel="apple-touch-icon"');
    expect(head).toContain('/apple-touch-icon.png');
    expect(existsSync('public/apple-touch-icon.png')).toBe(true);
    expect(head).not.toContain('mailto:');
    expect(head).not.toContain('harenstam.com');
    expect(head).not.toContain('localhost');
  });

  it('rewrites /experimental/now/ for visitors, not a status note', () => {
    const now = readFileSync('src/pages/experimental/now.astro', 'utf8');
    expect(now).toContain('Product Manager, Developer Experience');
    expect(now).toContain('https://www.linkedin.com/in/alehar/');
    expect(now).toContain('Get in touch');
    expect(now).toContain('LinkedIn · replies from me');
    expect(now).toContain('Hero title="Product Manager, Developer Experience at IFS"');
    expect(now.replace(/\s+/g, ' ')).toContain('up to 2x faster delivery');
    expect(now).toContain('up to 30x ROI');
    expect(now).not.toContain('Strategic Pulse');
    expect(now).not.toContain('Driving enterprise AI');
    expect(now).not.toContain('mailto:');
    expect(now).not.toContain('this is not on the site');
    expect(now).not.toContain("this isn't on the site yet");
    expect(now).not.toContain('stay blank rather than invented');
    expect(now).not.toContain('only figures published here');
    expect(now).not.toContain('<strong>Status:</strong>');
    expect(now).not.toContain('high-impact');
  });

  it('rewrites /experimental/reading-list/ for visitors, not a bare book list', () => {
    const page = readFileSync('src/pages/experimental/reading-list.astro', 'utf8');
    expect(page).toContain('Product Manager, Developer Experience');
    expect(page).toContain('https://www.linkedin.com/in/alehar/');
    expect(page).toContain('Get in touch');
    expect(page).toContain('LinkedIn · replies from me');
    expect(page).toContain('High Output Management');
    expect(page).toContain('The Lean Startup');
    expect(page).toContain('Competing Against Luck');
    expect(page).toContain('Andrew Grove');
    expect(page).toContain('Eric Ries');
    expect(page).toContain('Clayton Christensen');
    const lede =
      page
        .match(/class="lede"[^>]*>([\s\S]*?)<\/p>/)?.[1]
        ?.replace(/\s+/g, ' ')
        .trim() ?? '';
    expect(lede).toContain('Product Manager, Developer Experience at IFS');
    expect(lede).toContain('Reading behind the work');
    expect(lede).not.toBe('Product Manager, Developer Experience at IFS.');
    expect(page).toContain('Grove on how managers multiply the output of a team.');
    expect(page).toContain('Ries on testing product ideas with real users before scaling.');
    expect(page).toContain('Christensen on jobs to be done');
    expect(page).toContain('building for the outcome someone is hiring a product to do');
    expect((page.match(/title: '/g) || []).length).toBe(3);
    expect(page).not.toContain('mailto:');
    expect(page).not.toContain('this is not a complete list');
    expect(page).not.toContain('more coming');
    expect(page).not.toContain('stay blank rather than invented');
    expect(page).not.toContain('this is not on the site');
    expect(page).not.toContain("this isn't on the site yet");
  });

  it('rewrites What’s New for visitors, not a project log', () => {
    const page = readFileSync('src/pages/whats-new.astro', 'utf8');
    const cta = readFileSync('src/components/ContactCTA.astro', 'utf8');
    expect(page).not.toContain('A real-time log of project milestones');
    expect(page).toContain('A public changelog of this site.');
    expect(page).toContain('title="What\'s New | Product Manager, Developer Experience at IFS"');
    expect(page).toContain('ogTitle="What\'s New | Product Manager, Developer Experience at IFS"');
    expect(page).toContain('Product Manager, Developer Experience');
    expect(page).toContain('toVisitorChangelogTitle');
    expect(page).toContain('toVisitorRelease');
    expect(page).toContain('ContactCTA');
    expect(page).not.toContain('mailto:');
    expect(page).not.toContain('this is not on the site');
    expect(page).not.toContain("this isn't on the site yet");
    expect(page).not.toContain('stay blank rather than invented');
    expect(cta).toContain('https://www.linkedin.com/in/alehar/');
    expect(cta).toContain('Get in touch');
    expect(cta).toContain('LinkedIn · replies from me');
    expect(cta).not.toContain('mailto:');
    expect(
      toVisitorChangelogTitle('41fe7ae feat: rewrite /experimental/now/ for visitors (#523)')
    ).toBe('Now page rewritten for visitors');
    expect(
      toVisitorChangelogTitle('41fe7ae feat: rewrite /experimental/now/ for visitors (#523)')
    ).not.toMatch(/41fe7ae|feat:|\(#523\)/);
    expect(
      toVisitorChangelogTitle('feat: rewrite /experimental/now/ for visitors (#523)')
    ).not.toContain('feat: rewrite /experimental/now/');
    expect(toVisitorChangelogTitle('feat: add a live RSS feed for the work (#520)')).toBe(
      'RSS feed of the work'
    );
    expect(toVisitorChangelogTitle('fix: drop sitemap URLs that 404 (#521)')).toBe(
      'Sitemap no longer lists pages that 404'
    );

    const api = readFileSync('src/pages/api/releases.ts', 'utf8');
    expect(api).toContain('toVisitorChangelogTitle');
    expect(api).toContain('toVisitorRelease');

    const rawNow = '- 41fe7ae feat: rewrite /experimental/now/ for visitors (#523)';
    const visitorNow = toVisitorRelease({
      body: rawNow,
      publishedAt: '2026-08-16T21:12:02Z',
      title: '2026.08.16.2111',
      url: 'https://github.com/alehar9320/astro-cloudflare-personal-website/releases/tag/2026.08.16.2111',
      version: '2026.08.16.2111',
    });
    expect(visitorNow.body).toBe('- Now page rewritten for visitors');
    expect(visitorNow.body).not.toMatch(/41fe7ae|feat:|\(#523\)/);
    expect(visitorNow.publishedAt).toBe('2026-08-16T21:12:02Z');
    expect(visitorNow.url).toContain('/releases/tag/2026.08.16.2111');

    const liveNames: Array<[string, string]> = [
      [
        '41fe7ae feat: rewrite /experimental/now/ for visitors (#523)',
        'Now page rewritten for visitors',
      ],
      [
        '8491e97 fix: drop experimental pages from the sitemap (#522)',
        'Experimental pages removed from the sitemap',
      ],
      ['62dd4d6 fix: drop sitemap URLs that 404 (#521)', 'Sitemap no longer lists pages that 404'],
      ['515bbf9 feat: add a live RSS feed for the work (#520)', 'RSS feed of the work'],
      [
        '8302a2a feat: offer LinkedIn hire on the not-found page (#519)',
        'Get in touch on LinkedIn from the not-found page',
      ],
      ['56c8462 feat: add a working web app manifest (#518)', 'Web app manifest'],
      ['75e03a6 feat: add a working apple-touch-icon (#517)', 'Home-screen icon'],
      [
        'e9ee7d1 feat: point robots.txt at the live sitemap (#516)',
        'robots.txt points at the sitemap',
      ],
      ['4b300bf feat: add a live sitemap for search (#515)', 'Sitemap of the live site'],
      [
        '7a10476 feat: add live rel=canonical for search and shares (#514)',
        'Canonical URL for the live site',
      ],
      ['467ba57 feat: make the twin the Home first-view (#513)', 'Chat is the first view on Home'],
      ['54d9a30 feat: put the Home headshot in the twin (#511)', 'Home headshot in the chat'],
      [
        '0bae8a2 fix: keep the docked chat FAB off footer GitHub at 1280 (#510)',
        'Chat button no longer covers the footer GitHub link',
      ],
      [
        'b3ff946 feat: conversational fold for the twin (#508)',
        'Conversational layout for the chat',
      ],
      [
        '80084aa feat: add PM/DevEx to work-case share description (#507)',
        'Work-case shares include Product Manager, Developer Experience',
      ],
      [
        'cd9c5a9 feat: work-case browser titles include PM/DevEx (#506)',
        'Work-case browser titles include Product Manager, Developer Experience',
      ],
      [
        'eacddb0 feat: work-case share preview includes PM/DevEx and LinkedIn (#505)',
        'Work-case share preview includes Product Manager, Developer Experience and LinkedIn',
      ],
      [
        'a2414f6 feat: point share URLs at the live site (#504)',
        'Share URLs point at the live site',
      ],
      [
        '54a4f7c feat: point structured data at the live site (#503)',
        'Structured data points at the live site',
      ],
      [
        '6b610e5 feat: put IFS Design System first and Lidköping last on /work (#496)',
        'IFS Design System first on Work, Lidköping last',
      ],
    ];
    expect(liveNames).toHaveLength(20);
    for (const [raw, visitor] of liveNames) {
      expect(toVisitorChangelogTitle(raw)).toBe(visitor);
      expect(toVisitorChangelogTitle(raw)).not.toMatch(/^[a-f0-9]{7}\s/i);
      expect(toVisitorChangelogTitle(raw)).not.toMatch(
        /^(feat|fix|chore|docs|refactor|test|style|perf|build|ci):/i
      );
      expect(toVisitorChangelogTitle(raw)).not.toMatch(/\(#\d+\)/);
    }
  });
});
