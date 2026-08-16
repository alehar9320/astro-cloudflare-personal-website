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
    expect(bio).toContain(
      'Explore the professional journey of Alexander Härenstam, Product Manager, Developer Experience at IFS.'
    );
    expect(twin).toContain('2x faster delivery');
    expect(twin).toContain('30x ROI');
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
    expect(cta).toContain('var(--chat-fab-clearance)');
    expect(cta).toContain('https://www.linkedin.com/in/alehar/');
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
    expect(copilots).toContain('not a customer product');
    expect(copilots).not.toContain('multi-million');
    expect(analytics).toContain('Usage telemetry so');
    expect(analytics).toContain('not a standalone platform product');
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
