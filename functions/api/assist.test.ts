/**
 * Tests for POST /api/assist. The Anthropic client is always a mock:
 * nothing here touches the network.
 */
import type Anthropic from '@anthropic-ai/sdk';
import {
  handleAssist,
  parseAssistRequest,
  cleanAction,
  toZonedIso,
  FALLBACK_REPLY,
  type AssistClient,
  type AssistRequest,
  type Env,
} from './assist';

const ORIGIN = 'https://sourdoughcalculator.uk';

function memoryKV() {
  const store = new Map<string, string>();
  const puts: { key: string; value: string; ttl?: number }[] = [];
  return {
    store,
    puts,
    get: async (k: string) => store.get(k) ?? null,
    put: async (k: string, v: string, o?: { expirationTtl?: number }) => {
      store.set(k, v);
      puts.push({ key: k, value: v, ttl: o?.expirationTtl });
    },
  };
}

function makeEnv(overrides: Partial<Env> = {}): Env & { ASSIST_KV: ReturnType<typeof memoryKV> } {
  return {
    ANTHROPIC_API_KEY: 'test-key',
    ASSIST_KV: memoryKV(),
    SITE_ORIGIN: ORIGIN,
    RATE_SALT: 'pepper',
    ...overrides,
  } as Env & { ASSIST_KV: ReturnType<typeof memoryKV> };
}

function validBody(over: Partial<AssistRequest['context']> = {}, messages?: AssistRequest['messages']): AssistRequest {
  return {
    context: {
      now: '2026-10-16T10:00:00+01:00',
      timeZone: 'Europe/London',
      unitSystem: 'metric',
      formula: { flourGrams: 500, waterPct: 75, starterPct: 20, saltPct: 2, starterHydration: 100 },
      roomTempC: 22,
      vessel: 'cocotte',
      mixedAt: null,
      bulkHours: 7,
      ...over,
    },
    messages: messages ?? [{ role: 'user', text: 'I want bread for Saturday lunch.' }],
  };
}

function req(body: unknown, init: { method?: string; origin?: string | null; ip?: string; raw?: string } = {}): Request {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', 'CF-Connecting-IP': init.ip ?? '203.0.113.7' };
  if (init.origin !== null) headers.Origin = init.origin ?? ORIGIN;
  const method = init.method ?? 'POST';
  return new Request('https://sourdoughcalculator.uk/api/assist', {
    method,
    headers,
    body: method === 'GET' ? undefined : init.raw ?? JSON.stringify(body),
  });
}

// ── Mock client ─────────────────────────────────────────────────────────

let blockId = 0;
function message(content: unknown[], stop_reason: string): Anthropic.Beta.BetaMessage {
  return { id: `msg_${blockId++}`, type: 'message', role: 'assistant', model: 'claude-opus-5-5', content, stop_reason } as unknown as Anthropic.Beta.BetaMessage;
}
const toolUse = (name: string, input: unknown) => ({ type: 'tool_use', id: `toolu_${blockId++}`, name, input });
const replyMsg = (reply: string, actions: unknown[] = []) => message([toolUse('reply', { reply, actions })], 'tool_use');

function mockClient(...responses: Anthropic.Beta.BetaMessage[]) {
  const create = jest.fn();
  responses.forEach((r) => create.mockResolvedValueOnce(r));
  const client: AssistClient = { beta: { messages: { create } } };
  return { client, create, deps: { createClient: () => client } };
}

async function call(body: unknown, env = makeEnv(), mock = mockClient(replyMsg('Mix tonight.')), init = {}) {
  const res = await handleAssist(req(body, init), env, mock.deps);
  return { res, data: await res.json(), env, mock };
}

// ── Guards ──────────────────────────────────────────────────────────────

describe('guards', () => {
  it('405 for anything but POST', async () => {
    const res = await handleAssist(req(null, { method: 'GET' }), makeEnv(), mockClient().deps);
    expect(res.status).toBe(405);
    expect(await res.json()).toEqual({ error: 'method_not_allowed' });
  });

  it('403 for a missing or foreign origin', async () => {
    for (const origin of [null, 'https://evil.example', 'http://localhost:8081']) {
      const { res, data } = await call(validBody(), makeEnv(), undefined, { origin });
      expect(res.status).toBe(403);
      expect(data).toEqual({ error: 'bad_origin' });
    }
  });

  it('allows localhost only when ALLOW_LOCALHOST is 1', async () => {
    const { res } = await call(validBody(), makeEnv({ ALLOW_LOCALHOST: '1' }), undefined, { origin: 'http://localhost:8081' });
    expect(res.status).toBe(200);
  });

  it('403 when SITE_ORIGIN is not set', async () => {
    const { res } = await call(validBody(), makeEnv({ SITE_ORIGIN: undefined }));
    expect(res.status).toBe(403);
  });

  it('503 when the API key, KV or salt is missing', async () => {
    for (const missing of ['ANTHROPIC_API_KEY', 'ASSIST_KV', 'RATE_SALT'] as const) {
      const { res, data, mock } = await call(validBody(), makeEnv({ [missing]: undefined }));
      expect(res.status).toBe(503);
      expect(data).toEqual({ error: 'not_configured' });
      expect(mock.create).not.toHaveBeenCalled();
    }
  });

  it('400 for bad bodies', async () => {
    const bads: unknown[] = [
      { ...validBody(), extra: 1 },
      { ...validBody(), context: { ...validBody().context, postcode: 'KT1' } },
      { ...validBody(), context: { ...validBody().context, formula: { ...validBody().context.formula, hardness: 120 } } },
      validBody({ now: 'yesterday' }),
      validBody({ now: '2026-10-16T10:00:00' }), // no offset
      validBody({ timeZone: 'Mars/Olympus' }),
      validBody({ vessel: 'banneton' as never }),
      validBody({ roomTempC: '22' as never }),
      validBody({}, []),
      validBody({}, [{ role: 'assistant', text: 'Hi' }]),
      validBody({}, [{ role: 'user', text: 'x'.repeat(501) }]),
      validBody({}, [{ role: 'user', text: 'a' }, { role: 'assistant', text: 'b' }]), // must end with the user
      validBody({}, [{ role: 'user', text: 'a', id: 1 } as never]),
      validBody({}, Array.from({ length: 13 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', text: 'q' } as const))),
    ];
    for (const body of bads) {
      const { res, data } = await call(body);
      expect(res.status).toBe(400);
      expect(data).toEqual({ error: 'bad_request' });
    }
  });

  it('400 for invalid JSON and bodies over 16 KB', async () => {
    let r = await handleAssist(req(null, { raw: '{nope' }), makeEnv(), mockClient().deps);
    expect(r.status).toBe(400);
    const big = { ...validBody(), padding: 'x'.repeat(17 * 1024) };
    r = await handleAssist(req(big), makeEnv(), mockClient().deps);
    expect(r.status).toBe(400);
  });

  it('accepts six user turns', async () => {
    const turns = Array.from({ length: 11 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', text: `turn ${i}` } as const));
    expect(parseAssistRequest(validBody({}, turns))).not.toBeNull();
  });

  it('429 rate_limited once one client reaches its daily limit, without spending a model call', async () => {
    const env = makeEnv({ ASSIST_PER_IP_DAILY: '2' });
    const mock = mockClient(replyMsg('one'), replyMsg('two'));
    expect((await handleAssist(req(validBody()), env, mock.deps)).status).toBe(200);
    expect((await handleAssist(req(validBody()), env, mock.deps)).status).toBe(200);
    const third = await handleAssist(req(validBody()), env, mock.deps);
    expect(third.status).toBe(429);
    expect(await third.json()).toEqual({ error: 'rate_limited' });
    expect(mock.create).toHaveBeenCalledTimes(2);
    // Another client is unaffected.
    const other = await handleAssist(req(validBody(), { ip: '198.51.100.9' }), env, mockClient(replyMsg('ok')).deps);
    expect(other.status).toBe(200);
  });

  it('429 daily_cap once the global limit is reached', async () => {
    const env = makeEnv({ ASSIST_GLOBAL_DAILY: '1' });
    expect((await handleAssist(req(validBody(), { ip: '1.1.1.1' }), env, mockClient(replyMsg('a')).deps)).status).toBe(200);
    const res = await handleAssist(req(validBody(), { ip: '2.2.2.2' }), env, mockClient(replyMsg('b')).deps);
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ error: 'daily_cap' });
  });

  it('stores only a salted hash of the IP, per UTC day, expiring after 48 h', async () => {
    const env = makeEnv();
    await handleAssist(req(validBody(), { ip: '203.0.113.7' }), env, mockClient(replyMsg('ok')).deps, new Date('2026-10-16T23:30:00Z'));
    const keys = [...env.ASSIST_KV.store.keys()];
    expect(keys).toContain('global:2026-10-16');
    const ipKey = keys.find((k) => k.startsWith('ip:'))!;
    expect(ipKey).toMatch(/^ip:[0-9a-f]{64}:2026-10-16$/);
    expect(keys.join(' ')).not.toContain('203.0.113.7');
    expect(env.ASSIST_KV.puts.every((p) => p.ttl === 48 * 3600)).toBe(true);
  });
});

// ── Model loop and output validation ────────────────────────────────────

describe('answering', () => {
  it('sends the spec request shape: model, adaptive thinking, low effort, fallbacks, cached system and tools', async () => {
    const { data, mock } = await call(validBody());
    expect(data).toEqual({ reply: 'Mix tonight.', actions: [] });
    const params = mock.create.mock.calls[0][0];
    expect(params.model).toBe('claude-opus-5-5');
    expect(params.max_tokens).toBe(4000);
    expect(params.thinking).toEqual({ type: 'adaptive' });
    expect(params.output_config).toEqual({ effort: 'low' });
    expect(params.fallbacks).toBe('default');
    expect(params.betas).toEqual(['server-side-fallback-2026-07-01']);
    expect(params.tool_choice).toEqual({ type: 'auto' });
    expect(params.system[0].cache_control).toEqual({ type: 'ephemeral' });
    expect(params.tools.map((t: { name: string }) => t.name)).toEqual(['estimate_rise', 'plan_bake', 'elapsed_since_mix', 'reply']);
    expect(params.tools.every((t: { strict?: boolean }) => t.strict === true)).toBe(true);
    expect(params.tools.at(-1).cache_control).toEqual({ type: 'ephemeral' });
    // Volatile context goes in the first user message, not the system prompt.
    expect(params.system[0].text).not.toContain('2026');
    expect(params.messages[0].content).toContain('"now": "2026-10-16T10:00:00+01:00"');
    expect(params.messages[0].content).toContain('I want bread for Saturday lunch.');
  });

  it('runs engine tools and attaches the engine plan to show_plan', async () => {
    const mock = mockClient(
      message([toolUse('plan_bake', { readyAt: '2026-10-17T12:00:00+01:00', proofMode: 'counter' })], 'tool_use'),
      replyMsg('Mix tonight at 23:08.', [
        { type: 'show_plan' },
        { type: 'set_room_temp', roomTempC: 21 },
      ]),
    );
    const { data } = await call(validBody(), makeEnv(), mock);
    expect(mock.create).toHaveBeenCalledTimes(2);
    const toolResultMsg = mock.create.mock.calls[1][0].messages.at(-1);
    const result = JSON.parse(toolResultMsg.content[0].content);
    expect(result.mixAt).toBe('2026-10-16T23:08:00+01:00'); // 7 h rise, 4 h proof, BST
    expect(result.mixAtIsPast).toBe(false);
    expect(data.actions[0]).toEqual({
      type: 'show_plan',
      plan: {
        mixAt: '2026-10-16T23:08:00+01:00',
        steps: [
          { key: 'mix', at: '2026-10-16T23:08:00+01:00' },
          { key: 'rise', at: '2026-10-16T23:13:00+01:00' },
          { key: 'shape', at: '2026-10-17T06:13:00+01:00' },
          { key: 'proof', at: '2026-10-17T06:15:00+01:00' },
          { key: 'bake', at: '2026-10-17T10:15:00+01:00' },
          { key: 'cool', at: '2026-10-17T11:00:00+01:00' },
        ],
      },
    });
    expect(data.actions[1]).toEqual({ type: 'set_room_temp', roomTempC: 21 });
  });

  it('answers estimate_rise and elapsed_since_mix from the engine', async () => {
    const mock = mockClient(
      message([toolUse('estimate_rise', { roomTempC: 16 }), toolUse('elapsed_since_mix', {})], 'tool_use'),
      replyMsg('Give it longer.'),
    );
    await call(validBody({ mixedAt: '2026-10-15T22:00:00+01:00', roomTempC: 16 }), makeEnv(), mock);
    const results = mock.create.mock.calls[1][0].messages.at(-1).content;
    expect(results).toHaveLength(2); // both results in one user message
    const rise = JSON.parse(results[0].content);
    expect(rise.bulkHours).toBeGreaterThan(7);
    expect(rise.proofHours).toBeGreaterThan(0);
    expect(JSON.parse(results[1].content)).toEqual({
      mixedAt: '2026-10-15T22:00:00+01:00', hoursElapsed: 12, bulkHours: 7, hoursRemaining: 0,
    });
  });

  it('drops a show_plan action when no plan was computed', async () => {
    const { data } = await call(validBody(), makeEnv(), mockClient(replyMsg('Here.', [{ type: 'show_plan', plan: { mixAt: 'made up', steps: [] } }])));
    expect(data.actions).toEqual([]);
  });

  it('validates and clamps actions, dropping invalid ones and keeping at most three', async () => {
    const { data } = await call(validBody(), makeEnv(), mockClient(replyMsg('Try this.', [
      { type: 'set_room_temp', roomTempC: 40 },            // out of range: dropped
      { type: 'launch_rockets' },                           // unknown: dropped
      { type: 'set_formula', waterPct: 120, starterPct: 2, saltPct: 5 },
      { type: 'set_vessel', vessel: 'wok' },               // invalid: dropped
      { type: 'set_vessel', vessel: 'tin' },
      { type: 'reset_clock' },
      { type: 'set_room_temp', roomTempC: 20 },            // fourth valid: dropped
    ])));
    expect(data.actions).toEqual([
      { type: 'set_formula', waterPct: 100, starterPct: 5, saltPct: 3 },
      { type: 'set_vessel', vessel: 'tin' },
      { type: 'reset_clock' },
    ]);
  });

  it('cleanAction keeps only the changed formula fields and drops an empty one', () => {
    expect(cleanAction({ type: 'set_formula', saltPct: 2 }, null)).toEqual({ type: 'set_formula', saltPct: 2 });
    expect(cleanAction({ type: 'set_formula', waterPct: 50 }, null)).toEqual({ type: 'set_formula', waterPct: 55 });
    expect(cleanAction({ type: 'set_formula' }, null)).toBeNull();
    expect(cleanAction({ type: 'set_room_temp', roomTempC: '20' }, null)).toBeNull();
  });

  it('falls back when the reply is malformed', async () => {
    const { data } = await call(validBody(), makeEnv(), mockClient(message([toolUse('reply', { reply: 42, actions: [] })], 'tool_use')));
    expect(data).toEqual(FALLBACK_REPLY);
  });

  it('strips headings, bold and emoji and caps the reply at 120 words', async () => {
    const long = `# Do this\n**Wait** 🍞 ${'word '.repeat(200)}`;
    const { data } = await call(validBody(), makeEnv(), mockClient(replyMsg(long)));
    expect(data.reply).toMatch(/^Do this\s+Wait/);
    expect(data.reply).not.toMatch(/[#*🍞]/u);
    expect(data.reply.split(/\s+/).length).toBeLessThanOrEqual(120);
  });

  it('uses plain text when the model answers without the reply tool', async () => {
    const { data } = await call(validBody(), makeEnv(), mockClient(message([{ type: 'text', text: 'Leave it longer.' }], 'end_turn')));
    expect(data).toEqual({ reply: 'Leave it longer.', actions: [] });
  });

  it('returns the generic reply on refusal, before reading content', async () => {
    const { res, data } = await call(validBody(), makeEnv(), mockClient(message([toolUse('reply', { reply: 'leaked', actions: [] })], 'refusal')));
    expect(res.status).toBe(200);
    expect(data).toEqual(FALLBACK_REPLY);
  });

  it('returns the generic reply when the API call throws', async () => {
    const create = jest.fn().mockRejectedValue(new Error('boom'));
    const client: AssistClient = { beta: { messages: { create } } };
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const res = await handleAssist(req(validBody()), makeEnv(), { createClient: () => client });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(FALLBACK_REPLY);
    expect(JSON.stringify(spy.mock.calls)).not.toContain('Saturday');
    spy.mockRestore();
  });

  it('stops running tools after four rounds and asks for the reply', async () => {
    const round = () => message([toolUse('estimate_rise', { roomTempC: 20 })], 'tool_use');
    const mock = mockClient(round(), round(), round(), round(), round(), replyMsg('Done.'));
    const { data } = await call(validBody(), makeEnv(), mock);
    expect(data).toEqual({ reply: 'Done.', actions: [] });
    expect(mock.create).toHaveBeenCalledTimes(6);
    const lastResults = mock.create.mock.calls[5][0].messages.at(-1).content;
    expect(lastResults[0].is_error).toBe(true);
    expect(lastResults[0].content).toMatch(/limit/i);
    const fourthResults = mock.create.mock.calls[4][0].messages.at(-1).content;
    expect(fourthResults[0].is_error).toBeUndefined();
  });

  it('gives up with the generic reply if the model never answers', async () => {
    const round = () => message([toolUse('estimate_rise', { roomTempC: 20 })], 'tool_use');
    const mock = mockClient(round(), round(), round(), round(), round(), round());
    const { data } = await call(validBody(), makeEnv(), mock);
    expect(data).toEqual(FALLBACK_REPLY);
    expect(mock.create).toHaveBeenCalledTimes(6);
  });
});

describe('toZonedIso', () => {
  it('formats with the zone offset either side of a DST change', () => {
    expect(toZonedIso(new Date('2026-10-24T18:08:00Z'), 'Europe/London')).toBe('2026-10-24T19:08:00+01:00');
    expect(toZonedIso(new Date('2026-10-25T12:00:00Z'), 'Europe/London')).toBe('2026-10-25T12:00:00+00:00');
    expect(toZonedIso(new Date('2026-10-25T12:00:00Z'), 'America/New_York')).toBe('2026-10-25T08:00:00-04:00');
    expect(toZonedIso(new Date('2026-10-25T12:00:00Z'), 'Asia/Kolkata')).toBe('2026-10-25T17:30:00+05:30');
  });
});
