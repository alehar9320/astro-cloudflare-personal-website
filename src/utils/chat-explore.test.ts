import { describe, expect, it } from 'vitest';

import { DESIGN_SYSTEM_CHIP } from './chat-logic';
import { EXPLORE_CARDS, exploreCardForQuestion } from './chat-explore';

describe('exploreCardForQuestion', () => {
  it('offers the IFS Design System card for the live design-system chip', () => {
    expect(exploreCardForQuestion(DESIGN_SYSTEM_CHIP)).toEqual(EXPLORE_CARDS.designSystem);
  });

  it('offers published work, biography, and case cards from existing titles and lines', () => {
    expect(exploreCardForQuestion('Tell me about your work')).toEqual(EXPLORE_CARDS.work);
    expect(exploreCardForQuestion('Tell me about you')).toEqual(EXPLORE_CARDS.biography);
    expect(exploreCardForQuestion("What's the Industrial AI bet?")).toEqual(EXPLORE_CARDS.work);
    expect(exploreCardForQuestion('How do you work as a PM?')).toEqual(EXPLORE_CARDS.biography);
    expect(exploreCardForQuestion('Can I read your biography?')).toEqual(EXPLORE_CARDS.biography);
    expect(exploreCardForQuestion('Tell me about a case')).toEqual(EXPLORE_CARDS.designSystem);
    expect(exploreCardForQuestion('What are internal AI coding copilots?')).toEqual(
      EXPLORE_CARDS.copilots
    );
    expect(exploreCardForQuestion('What is the user behavior analytics work?')).toEqual(
      EXPLORE_CARDS.analytics
    );
    expect(exploreCardForQuestion("What was the Chalmers master's thesis?")).toEqual(
      EXPLORE_CARDS.thesis
    );
  });

  it('keeps Open as a route on the card, not a hire path', () => {
    expect(EXPLORE_CARDS.designSystem.href).toBe('/work/ifs-design-system/');
    expect(EXPLORE_CARDS.copilots.href).toBe('/work/ai-coding-copilots/');
    expect(EXPLORE_CARDS.analytics.href).toBe('/work/user-behavior-analytics/');
    expect(EXPLORE_CARDS.thesis.href).toBe('/work/master-thesis/');
    expect(EXPLORE_CARDS.biography.href).toBe('/biography/');
    expect(EXPLORE_CARDS.work.href).toBe('/work/');
    expect(exploreCardForQuestion('How do I get in touch on LinkedIn?')).toBeNull();
    expect(exploreCardForQuestion('What is your email?')).toBeNull();
    expect(exploreCardForQuestion('Can I download a CV?')).toBeNull();
  });

  it('does not invent titles or lines', () => {
    expect(EXPLORE_CARDS.designSystem.title).toBe('IFS Design System');
    expect(EXPLORE_CARDS.designSystem.line).toBe('From the first version to IFS Cloud.');
    expect(EXPLORE_CARDS.copilots.title).toBe('Internal AI coding copilots');
    expect(EXPLORE_CARDS.copilots.line).toBe(
      'Internal AI coding copilots for IFS engineering teams.'
    );
    expect(EXPLORE_CARDS.analytics.title).toBe('User behavior analytics');
    expect(EXPLORE_CARDS.analytics.line).toBe('Usage telemetry for IFS Cloud roadmap decisions.');
    expect(EXPLORE_CARDS.thesis.title).toBe("Chalmers master's thesis");
    expect(EXPLORE_CARDS.thesis.line).toBe("Chalmers master's thesis, 2017.");
    expect(EXPLORE_CARDS.biography.title).toBe('Biography');
    expect(EXPLORE_CARDS.biography.line).toBe('Product Manager, Developer Experience at IFS.');
    expect(EXPLORE_CARDS.work.title).toBe('Work');
    expect(EXPLORE_CARDS.work.line).toBe('The IFS Design System case, then earlier work.');
  });
});
