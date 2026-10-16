import {
  actionLabel,
  askBaker,
  interpretAssistResult,
  isoWithOffset,
  planStepTitle,
  type AssistContext,
} from '../src/lib/assist';

const CONTEXT: AssistContext = {
  now: '2026-10-16T10:00:00+01:00',
  timeZone: 'Europe/London',
  unitSystem: 'metric',
  formula: { flourGrams: 500, waterPct: 75, starterPct: 20, saltPct: 2, starterHydration: 100 },
  roomTempC: 22,
  vessel: 'cocotte',
  mixedAt: null,
  bulkHours: 7,
};

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('assist client', () => {
  it('maps server results to what the card does', () => {
    expect(interpretAssistResult(429, { error: 'rate_limited' })).toEqual({ kind: 'busy' });
    expect(interpretAssistResult(429, { error: 'daily_cap' })).toEqual({ kind: 'busy' });
    expect(interpretAssistResult(503, { error: 'not_configured' })).toEqual({ kind: 'hide' });
    expect(interpretAssistResult(403, { error: 'bad_origin' })).toEqual({ kind: 'error' });
    expect(interpretAssistResult(400, { error: 'bad_request' })).toEqual({ kind: 'error' });
    expect(interpretAssistResult(200, { reply: '' , actions: [] })).toEqual({ kind: 'error' });
    expect(interpretAssistResult(200, null)).toEqual({ kind: 'error' });
    expect(interpretAssistResult(200, {
      reply: 'Mix at 23:08.',
      actions: [{ type: 'reset_clock' }, { type: 'bogus' }, { type: 'set_vessel', vessel: 'tin' }],
    })).toEqual({
      kind: 'answer',
      response: { reply: 'Mix at 23:08.', actions: [{ type: 'reset_clock' }, { type: 'set_vessel', vessel: 'tin' }] },
    });
  });

  it('posts only the context and messages, and hides on a network failure', async () => {
    const fetchImpl = jest.fn().mockResolvedValue(jsonResponse(200, { reply: 'ok', actions: [] }));
    const out = await askBaker('/api/assist', CONTEXT, [{ role: 'user', text: 'Hi' }], fetchImpl);
    expect(out).toEqual({ kind: 'answer', response: { reply: 'ok', actions: [] } });
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('/api/assist');
    expect(init.method).toBe('POST');
    expect(Object.keys(JSON.parse(init.body))).toEqual(['context', 'messages']);

    const offline = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    expect(await askBaker('/api/assist', CONTEXT, [{ role: 'user', text: 'Hi' }], offline)).toEqual({ kind: 'hide' });

    const html = jest.fn().mockResolvedValue(new Response('<html>', { status: 502 }));
    expect(await askBaker('/api/assist', CONTEXT, [{ role: 'user', text: 'Hi' }], html)).toEqual({ kind: 'error' });
  });

  it('labels actions in the baker’s units', () => {
    expect(actionLabel({ type: 'set_room_temp', roomTempC: 24 }, 'metric')).toBe('Use 24°C');
    expect(actionLabel({ type: 'set_room_temp', roomTempC: 24 }, 'imperial')).toBe('Use 75°F');
    expect(actionLabel({ type: 'set_formula', waterPct: 70, saltPct: 2.5 }, 'metric')).toBe('Use water 70% · salt 2.5%');
    expect(actionLabel({ type: 'set_formula', starterPct: 10 }, 'metric')).toBe('Use starter 10%');
    expect(actionLabel({ type: 'set_vessel', vessel: 'tin' }, 'metric')).toBe('Switch to Loaf tin');
    expect(actionLabel({ type: 'set_vessel', vessel: 'cocotte' }, 'metric')).toBe('Switch to Cocotte');
    expect(actionLabel({ type: 'reset_clock' }, 'metric')).toBe('Reset the clock');
    expect(actionLabel({ type: 'show_plan', plan: { mixAt: '', steps: [] } }, 'metric')).toBeNull();
    expect(planStepTitle('proof')).toBe('Proof');
  });

  it('formats the device time with its offset', () => {
    const iso = isoWithOffset(new Date('2026-10-16T09:00:00Z'));
    expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
    expect(Date.parse(iso)).toBe(Date.parse('2026-10-16T09:00:00Z'));
  });
});
