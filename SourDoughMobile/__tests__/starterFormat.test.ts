import { hoursLabel, spanLabel } from '../src/lib/starterFormat';

describe('starter display helpers', () => {
  it('says how long in the units that read best', () => {
    expect(hoursLabel(0)).toBe('0 h');
    expect(hoursLabel(0.25)).toBe('15 min');
    expect(hoursLabel(0.001)).toBe('1 min');
    expect(hoursLabel(7.2)).toBe('7.2 h');
    expect(hoursLabel(47)).toBe('47 h');
    expect(hoursLabel(52)).toBe('2 days');
    expect(hoursLabel(-1)).toBe('—');
    expect(hoursLabel(NaN)).toBe('—');
  });

  it('measures a span between two instants', () => {
    expect(spanLabel('2026-10-19T07:55:00Z', '2026-10-19T15:27:00Z')).toBe('7 h 32 min');
    expect(spanLabel('2026-10-19T07:55:00Z', '2026-10-19T08:10:00Z')).toBe('15 min');
    expect(spanLabel('2026-10-19T08:00:00Z', '2026-10-19T07:00:00Z')).toBe('—');
    expect(spanLabel('nope', '2026-10-19T07:00:00Z')).toBe('—');
  });
});
