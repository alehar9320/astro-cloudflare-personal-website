import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

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

  it('keeps the chat FAB off Get in touch and the home portrait on a phone', () => {
    const home = readFileSync('src/pages/index.astro', 'utf8');
    const chat = readFileSync('src/components/Chat.astro', 'utf8');
    const cta = readFileSync('src/components/ContactCTA.astro', 'utf8');
    const global = readFileSync('src/styles/global.css', 'utf8');
    expect(global).toContain('--chat-fab-clearance');
    expect(chat).toContain('bottom: var(--chat-fab-offset)');
    expect(chat).toContain('width: var(--chat-fab-size)');
    expect(home).toContain('padding-block: 1rem var(--chat-fab-clearance)');
    expect(home).toContain('justify-content: flex-start');
    expect(home).toContain('max-height: calc(100svh - var(--chat-fab-clearance) - 24rem)');
    expect(home).toContain('max-width: min(10.5rem, calc(100% - 2.5rem))');
    expect(home).toContain('margin-bottom: var(--chat-fab-clearance)');
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

  it('shows a Live / Not live signal on the chat header', () => {
    const chat = readFileSync('src/components/Chat.astro', 'utf8');
    expect(chat).toContain('chat-live-label');
    expect(chat).toContain('class="status-dot"');
    expect(chat).toContain("idle: 'Live'");
    expect(chat).toContain("error: 'Not live'");
    expect(chat).not.toContain("idle: 'Available'");
    expect(chat).not.toContain('.chat-toggle .status-dot');
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
    expect(work).toContain('!demoted.has(project.id)');
    expect(work).toContain('Earlier work');
    expect(work).toContain('Early Android work, 2013.');
    expect(work).toContain('Internal AI coding copilots for IFS engineering teams.');
    expect(work).toContain('Usage telemetry for IFS Cloud roadmap decisions.');
    expect(work).toContain("Chalmers master's thesis, 2017.");
    expect(work).not.toContain('multi-million');
    expect(work).not.toContain('Strategic Portfolio');
    expect(work).toContain('title="Work"');
    expect(work).toContain('The IFS Design System case, then earlier work.');
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
    expect(thesis).toContain("Chalmers</strong> master's thesis, 2017");
    expect(lidkoping).toContain('Early Android work, 2013');
    expect(lidkoping).not.toContain('management platform');
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
  it('lets a Home share read Product Manager, Developer Experience at IFS', () => {
    const head = readFileSync('src/components/MainHead.astro', 'utf8');
    const home = readFileSync('src/pages/index.astro', 'utf8');
    const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
    expect(home).toContain('ogTitle="Product Manager, Developer Experience at IFS"');
    expect(home).toContain('description="Product Manager, Developer Experience at IFS."');
    expect(home).toContain('Hero title="Product Manager, Developer Experience at IFS"');
    expect(home).toContain('https://www.linkedin.com/in/alehar/');
    expect(home).not.toContain('mailto:');
    expect(layout).toContain('ogTitle={ogTitle}');
    expect(head).toContain('content={shareTitle}');
    expect(head).toContain('property="og:title"');
    expect(head).not.toContain('Design systems, DevEx, and Industrial AI.');
    expect(head).toContain("description = 'Product Manager, Developer Experience at IFS.'");
  });

  it('grounds llms.txt with Chalmers education and recruiter keywords', () => {
    const llms = sources.find((s) => s.path.endsWith('llms.txt'))!.text;
    expect(llms).toContain('Chalmers B.Sc. Software Engineering');
    expect(llms).toContain('Management and Economics of Innovation');
    expect(llms).toContain('Greater Stockholm');
    expect(llms).toContain('AI coding copilots');
    expect(llms).toContain('IFS Cloud');
  });
});
