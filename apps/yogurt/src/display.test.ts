import { describe, expect, it } from 'vitest';
import { hoursLabel, splitAdvice, splitCultureTips, stepTitle, stripEmoji } from './display';

describe('step titles', () => {
  it('turns the engine labels into plain sentences', () => {
    expect(stepTitle({ hour: null, label: 'Pre-heat — Denature Proteins', description: '' })).toBe('Pre-heat: denature proteins');
    expect(stepTitle({ hour: 4, label: 'Hour 4 — Halfway', description: '' })).toBe('Hour 4: halfway');
    expect(stepTitle({ hour: 6, label: 'Hour 6 — Nearly Ready', description: '' })).toBe('Hour 6: nearly ready');
    expect(stepTitle({ hour: 8, label: 'Complete — Chill', description: '' })).toBe('Hour 8: complete, chill');
  });
});

describe('advice', () => {
  it('strips the emoji and separates the contamination warning', () => {
    expect(stripEmoji('🌡️ Room is cool')).toBe('Room is cool');
    const a = splitAdvice(['✅ Fine.', '🛡️ Signs of contamination: pink, or green. Discard.']);
    expect(a.tips).toEqual(['Fine.']);
    expect(a.contamination).toBe('Pink, or green. Discard.');
  });

  it('keeps science-only culture tips out of the practical list', () => {
    const t = splitCultureTips(['Chill 4h.', '🔬 L. bulgaricus makes peptides.']);
    expect(t.practical).toEqual(['Chill 4h.']);
    expect(t.science).toEqual(['L. bulgaricus makes peptides.']);
  });
});

it('rounds hours to something a person can plan around', () => {
  expect(hoursLabel(8)).toBe('8 h');
  expect(hoursLabel(7.74)).toBe('7.5 h');
  expect(hoursLabel(18.4)).toBe('18 h');
});
