/// <reference types="node" />
/**
 * Tests for POST /api/assist. `fetch` is always a mock: nothing here touches
 * the network. Runs under SourDoughMobile's Jest setup (see its jest.config.js).
 */
import {
  handleAssist,
  parseAssistRequest,
  parseToolArguments,
  cleanAction,
  matchesSchema,
  toZonedIso,
  TOOLS,
  FALLBACK_REPLY,
  SYSTEM_PROMPT,
  type AssistRequest,
  type Env,
} from './assist';
import { LLM_TIMEOUT_MS } from './llm';

const ORIGIN = 'https://sourdoughcalculator.uk';
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';

// ── Fixtures ────────────────────────────────────────────────────────────

type MemoryKV = ReturnType<typeof memoryKV>;
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

function makeEnv(overrides: Partial<Env> = {}): Env & { ASSIST_KV: MemoryKV } {
  return {
    DEEPSEEK_API_KEY: 'test-key',
    ASSIST_KV: memoryKV(),
    SITE_ORIGIN: ORIGIN,
    RATE_SALT: 'pepper',
    ...overrides,
  } as Env & { ASSIST_KV: MemoryKV };
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

// ── DeepSeek mock ───────────────────────────────────────────────────────

let callId = 0;
const toolCall = (name: string, args: unknown) => ({
  id: `call_${callId++}`,
  type: 'function',
  function: { name, arguments: typeof args === 'string' ? args : JSON.stringify(args) },
});
const completion = (message: Record<string, unknown>) => ({ choices: [{ index: 0, message: { role: 'assistant', content: null, ...message }, finish_reason: 'stop' }] });
const toolsTurn = (...calls: ReturnType<typeof toolCall>[]) => completion({ tool_calls: calls });
const replyTurn = (reply: string, actions: unknown[] = []) => toolsTurn(toolCall('reply', { reply, actions }));
const textTurn = (content: string) => completion({ content });

const fetchMock = jest.fn();
const realFetch = globalThis.fetch;

function queue(...bodies: unknown[]) {
  for (const body of bodies) {
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  }
}

/** The JSON body of the n-th call to DeepSeek. */
function sent(n: number) {
  return JSON.parse(fetchMock.mock.calls[n][1].body);
}

beforeEach(() => {
  fetchMock.mockReset();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});
afterAll(() => {
  globalThis.fetch = realFetch;
});

async function call(body: unknown, env = makeEnv(), init = {}) {
  const res = await handleAssist(req(body, init), env);
  return { res, data: await res.json(), env };
}

// ── Guards ──────────────────────────────────────────────────────────────

describe('guards', () => {
  it('405 for anything but POST', async () => {
    const { res, data } = await call(null, makeEnv(), { method: 'GET' });
    expect(res.status).toBe(405);
    expect(data).toEqual({ error: 'method_not_allowed' });
  });

  it('403 for a missing or foreign origin', async () => {
    for (const origin of [null, 'https://evil.example', 'http://localhost:8081']) {
      const { res, data } = await call(validBody(), makeEnv(), { origin });
      expect(res.status).toBe(403);
      expect(data).toEqual({ error: 'bad_origin' });
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('allows localhost only when ALLOW_LOCALHOST is 1', async () => {
    queue(replyTurn('Hi.'));
    const { res } = await call(validBody(), makeEnv({ ALLOW_LOCALHOST: '1' }), { origin: 'http://localhost:8081' });
    expect(res.status).toBe(200);
  });

  it('403 when SITE_ORIGIN is not set', async () => {
    const { res } = await call(validBody(), makeEnv({ SITE_ORIGIN: undefined }));
    expect(res.status).toBe(403);
  });

  it('503 when the API key, KV or salt is missing', async () => {
    for (const missing of ['DEEPSEEK_API_KEY', 'ASSIST_KV', 'RATE_SALT'] as const) {
      const { res, data } = await call(validBody(), makeEnv({ [missing]: undefined }));
      expect(res.status).toBe(503);
      expect(data).toEqual({ error: 'not_configured' });
    }
    expect(fetchMock).not.toHaveBeenCalled();
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
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('400 for invalid JSON and bodies over 16 KB', async () => {
    expect((await handleAssist(req(null, { raw: '{nope' }), makeEnv())).status).toBe(400);
    const big = { ...validBody(), padding: 'x'.repeat(17 * 1024) };
    expect((await handleAssist(req(big), makeEnv())).status).toBe(400);
  });

  it('accepts six user turns', () => {
    const turns = Array.from({ length: 11 }, (_, i) => ({ role: i % 2 ? 'assistant' : 'user', text: `turn ${i}` } as const));
    expect(parseAssistRequest(validBody({}, turns))).not.toBeNull();
  });

  it('429 rate_limited once one client reaches its daily limit, without calling DeepSeek', async () => {
    const env = makeEnv({ ASSIST_PER_IP_DAILY: '2' });
    queue(replyTurn('one'), replyTurn('two'), replyTurn('other'));
    expect((await handleAssist(req(validBody()), env)).status).toBe(200);
    expect((await handleAssist(req(validBody()), env)).status).toBe(200);
    const third = await handleAssist(req(validBody()), env);
    expect(third.status).toBe(429);
    expect(await third.json()).toEqual({ error: 'rate_limited' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    // Another client is unaffected.
    expect((await handleAssist(req(validBody(), { ip: '198.51.100.9' }), env)).status).toBe(200);
  });

  it('429 daily_cap once the global limit is reached', async () => {
    const env = makeEnv({ ASSIST_GLOBAL_DAILY: '1' });
    queue(replyTurn('a'));
    expect((await handleAssist(req(validBody(), { ip: '1.1.1.1' }), env)).status).toBe(200);
    const res = await handleAssist(req(validBody(), { ip: '2.2.2.2' }), env);
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ error: 'daily_cap' });
  });

  it('stores only a salted hash of the IP, per UTC day, expiring after 48 h', async () => {
    const env = makeEnv();
    queue(replyTurn('ok'));
    await handleAssist(req(validBody(), { ip: '203.0.113.7' }), env, new Date('2026-10-16T23:30:00Z'));
    const keys = [...env.ASSIST_KV.store.keys()];
    expect(keys).toContain('global:2026-10-16');
    expect(keys.find((k) => k.startsWith('ip:'))).toMatch(/^ip:[0-9a-f]{64}:2026-10-16$/);
    expect(keys.join(' ')).not.toContain('203.0.113.7');
    expect(env.ASSIST_KV.puts.every((p) => p.ttl === 48 * 3600)).toBe(true);
  });
});

// ── The DeepSeek call ───────────────────────────────────────────────────

describe('chat request', () => {
  it('sends the spec request: deepseek-flash, temperature 0.3, 700 tokens, tools, thinking disabled, no response_format', async () => {
    queue(replyTurn('Mix tonight.'));
    const { data } = await call(validBody());
    expect(data).toEqual({ reply: 'Mix tonight.', actions: [] });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(DEEPSEEK_URL);
    expect(init.method).toBe('POST');
    expect(init.headers.Authorization).toBe('Bearer test-key');
    expect(init.signal).toBeInstanceOf(AbortSignal);
    const body = sent(0);
    expect(body).toMatchObject({ model: 'deepseek-flash', temperature: 0.3, max_tokens: 700, stream: false, tool_choice: 'auto' });
    expect(body).not.toHaveProperty('response_format');
    expect(body.thinking).toEqual({ type: 'disabled' });
    expect(body.tools.map((t: { type: string; function: { name: string } }) => `${t.type}:${t.function.name}`))
      .toEqual(['function:estimate_rise', 'function:plan_bake', 'function:elapsed_since_mix', 'function:reply']);
    // Volatile context goes in the first user message; the system prompt stays fixed.
    expect(body.messages[0].role).toBe('system');
    expect(body.messages[0].content).not.toContain('2026');
    expect(body.messages[1].role).toBe('user');
    expect(body.messages[1].content).toContain('"now": "2026-10-16T10:00:00+01:00"');
    expect(body.messages[1].content).toContain('I want bread for Saturday lunch.');
  });

  it('honours DEEPSEEK_MODEL and DEEPSEEK_BASE_URL', async () => {
    queue(replyTurn('ok'));
    await call(validBody(), makeEnv({ DEEPSEEK_MODEL: 'deepseek-other', DEEPSEEK_BASE_URL: 'https://proxy.example/v1/' }));
    expect(fetchMock.mock.calls[0][0]).toBe('https://proxy.example/v1/chat/completions');
    expect(sent(0).model).toBe('deepseek-other');
  });

  it('keeps the system prompt and tools byte-identical across requests', async () => {
    queue(replyTurn('a'), replyTurn('b'));
    await call(validBody());
    await call(validBody({ now: '2026-10-17T08:00:00+01:00', roomTempC: 18 }, [{ role: 'user', text: 'Other question' }]));
    expect(JSON.stringify(sent(1).tools)).toBe(JSON.stringify(sent(0).tools));
    expect(sent(1).messages[0]).toEqual(sent(0).messages[0]);
  });

  it('every tool schema forbids extra keys and lists required', () => {
    for (const t of TOOLS) {
      expect(t.parameters.additionalProperties).toBe(false);
      expect(Array.isArray(t.parameters.required)).toBe(true);
    }
  });
});

// ── Tool loop and output validation ─────────────────────────────────────

describe('answering', () => {
  it('runs engine tools, returns results as tool messages and attaches the engine plan to show_plan', async () => {
    const plan = toolCall('plan_bake', { readyAt: '2026-10-17T12:00:00+01:00', proofMode: 'counter' });
    queue(
      toolsTurn(plan),
      replyTurn('Mix tonight at 23:08.', [
        { type: 'show_plan', plan: { mixAt: 'made up by the model', steps: [] } },
        { type: 'set_room_temp', roomTempC: 21 },
      ]),
    );
    const { data } = await call(validBody());
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const msgs = sent(1).messages;
    expect(msgs.at(-2)).toEqual({ role: 'assistant', content: null, tool_calls: [plan] });
    expect(msgs.at(-1).role).toBe('tool');
    expect(msgs.at(-1).tool_call_id).toBe(plan.id);
    const result = JSON.parse(msgs.at(-1).content);
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

  it('never shows a plan whose mix time has already passed', async () => {
    // Now is 10:00; ready by 14:00 needs an 11 h process that should have started last night.
    const plan = toolCall('plan_bake', { readyAt: '2026-10-16T14:00:00+01:00', proofMode: 'counter' });
    queue(toolsTurn(plan), replyTurn('Too late for 14:00.', [{ type: 'show_plan', plan: { mixAt: 'x', steps: [] } }]));
    const { data } = await call(validBody());
    const result = JSON.parse(sent(1).messages.at(-1).content);
    expect(result.mixAtIsPast).toBe(true);
    expect(data.actions).toEqual([]);
  });

  it('refuses to plan a new mix time once the dough is mixed', async () => {
    const plan = toolCall('plan_bake', { readyAt: '2026-10-17T12:00:00+01:00', proofMode: 'counter' });
    queue(toolsTurn(plan), replyTurn('You mixed it already.', [{ type: 'show_plan', plan: { mixAt: 'x', steps: [] } }]));
    const { data } = await call(validBody({ mixedAt: '2026-10-16T07:00:00+01:00' }));
    expect(JSON.parse(sent(1).messages.at(-1).content).error).toMatch(/already mixed/);
    expect(data.actions).toEqual([]);
  });

  it('tells the model what to do about a past plan, a running clock and salt', () => {
    expect(SYSTEM_PROMPT).toContain('mixAtIsPast');
    expect(SYSTEM_PROMPT).toContain('mixedAt is');
    expect(SYSTEM_PROMPT).toContain('Salt does not change');
  });

  it('runs every call in a round: estimate_rise and elapsed_since_mix from the engine', async () => {
    queue(toolsTurn(toolCall('estimate_rise', { roomTempC: 16 }), toolCall('elapsed_since_mix', {})), replyTurn('Give it longer.'));
    await call(validBody({ mixedAt: '2026-10-15T22:00:00+01:00', roomTempC: 16 }));
    const [rise, elapsed] = sent(1).messages.slice(-2);
    expect(rise.role).toBe('tool');
    expect(JSON.parse(rise.content).bulkHours).toBeGreaterThan(7);
    expect(JSON.parse(elapsed.content)).toEqual({ mixedAt: '2026-10-15T22:00:00+01:00', hoursElapsed: 12, bulkHours: 7, hoursRemaining: 0 });
  });

  it('ignores malformed tool arguments and answers bad_arguments', async () => {
    queue(
      toolsTurn(
        toolCall('estimate_rise', '{not json'),
        toolCall('estimate_rise', { roomTempC: 'warm' }),
        toolCall('estimate_rise', { roomTempC: 20, hack: true }),
        toolCall('plan_bake', { proofMode: 'counter' }), // missing readyAt
      ),
      replyTurn('Look for a doubled, domed dough.'),
    );
    const { data } = await call(validBody());
    const results = sent(1).messages.slice(-4).map((m: { content: string }) => JSON.parse(m.content));
    expect(results).toEqual(Array(4).fill({ error: 'bad_arguments' }));
    expect(data.reply).toBe('Look for a doubled, domed dough.');
  });

  it('treats a malformed reply call as bad arguments and lets the model try again', async () => {
    queue(toolsTurn(toolCall('reply', '{"reply": ')), replyTurn('Fixed.'));
    const { data } = await call(validBody());
    expect(JSON.parse(sent(1).messages.at(-1).content)).toEqual({ error: 'bad_arguments' });
    expect(data).toEqual({ reply: 'Fixed.', actions: [] });
  });

  it('drops a show_plan action when no plan was computed', async () => {
    queue(replyTurn('Here.', [{ type: 'show_plan', plan: { mixAt: 'x', steps: [] } }]));
    const { data } = await call(validBody());
    expect(data.actions).toEqual([]);
  });

  it('validates and clamps actions, dropping invalid ones and keeping at most three', async () => {
    queue(replyTurn('Try this.', [
      { type: 'set_room_temp', roomTempC: 40 },              // out of range: dropped
      { type: 'set_formula', waterPct: 120, starterPct: 2, saltPct: 5 },
      { type: 'set_vessel', vessel: 'tin' },
      { type: 'reset_clock' },
      { type: 'set_room_temp', roomTempC: 20 },              // fourth valid: dropped
    ]));
    const { data } = await call(validBody());
    expect(data.actions).toEqual([
      { type: 'set_formula', waterPct: 100, starterPct: 5, saltPct: 3 },
      { type: 'set_vessel', vessel: 'tin' },
      { type: 'reset_clock' },
    ]);
  });

  it('rejects a reply whose actions do not match the schema', () => {
    expect(parseToolArguments('reply', JSON.stringify({ reply: 'x', actions: [{ type: 'launch_rockets' }] }))).toBeNull();
    expect(parseToolArguments('reply', JSON.stringify({ reply: 'x', actions: [{ type: 'set_vessel', vessel: 'wok' }] }))).toBeNull();
    expect(parseToolArguments('reply', JSON.stringify({ reply: 'x', actions: [] }))).toEqual({ reply: 'x', actions: [] });
    expect(parseToolArguments('nope', '{}')).toBeNull();
  });

  it('cleanAction keeps only the changed formula fields and drops an empty one', () => {
    expect(cleanAction({ type: 'set_formula', saltPct: 2 }, null)).toEqual({ type: 'set_formula', saltPct: 2 });
    expect(cleanAction({ type: 'set_formula', waterPct: 50 }, null)).toEqual({ type: 'set_formula', waterPct: 55 });
    expect(cleanAction({ type: 'set_formula' }, null)).toBeNull();
  });

  it('matchesSchema covers the subset the tools use', () => {
    const s = { type: 'object', properties: { a: { type: 'number' }, b: { type: 'string', enum: ['x'] } }, required: ['a'], additionalProperties: false };
    expect(matchesSchema(s, { a: 1 })).toBe(true);
    expect(matchesSchema(s, { a: 1, b: 'x' })).toBe(true);
    expect(matchesSchema(s, { a: 1, b: 'y' })).toBe(false);
    expect(matchesSchema(s, { b: 'x' })).toBe(false);
    expect(matchesSchema(s, { a: NaN })).toBe(false);
    expect(matchesSchema(s, { a: 1, c: 2 })).toBe(false);
    expect(matchesSchema(s, [1])).toBe(false);
  });

  it('strips headings, bold and emoji and caps the reply at 120 words', async () => {
    queue(replyTurn(`# Do this\n**Wait** 🍞 ${'word '.repeat(200)}`));
    const { data } = await call(validBody());
    expect(data.reply).toMatch(/^Do this\s+Wait/);
    expect(data.reply).not.toMatch(/[#*🍞]/u);
    expect(data.reply.split(/\s+/).length).toBeLessThanOrEqual(120);
  });

  it('wraps a plain-text answer as a reply with no actions', async () => {
    queue(textTurn('Leave it longer.'));
    const { data } = await call(validBody());
    expect(data).toEqual({ reply: 'Leave it longer.', actions: [] });
  });

  it('returns the generic reply after four rounds without a reply', async () => {
    const round = () => toolsTurn(toolCall('estimate_rise', { roomTempC: 20 }));
    queue(round(), round(), round(), round(), replyTurn('too late'));
    const { data } = await call(validBody());
    expect(data).toEqual(FALLBACK_REPLY);
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it('answers on the fourth round', async () => {
    const round = () => toolsTurn(toolCall('estimate_rise', { roomTempC: 20 }));
    queue(round(), round(), round(), replyTurn('Done.'));
    const { data } = await call(validBody());
    expect(data).toEqual({ reply: 'Done.', actions: [] });
  });
});

describe('provider failures return the generic reply with status 200', () => {
  let errorSpy: jest.SpyInstance;
  beforeEach(() => { errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); });
  afterEach(() => errorSpy.mockRestore());

  it('on an HTTP error', async () => {
    fetchMock.mockResolvedValueOnce(new Response('{"error":{"message":"Insufficient Balance"}}', { status: 402 }));
    const { res, data } = await call(validBody());
    expect(res.status).toBe(200);
    expect(data).toEqual(FALLBACK_REPLY);
    expect(JSON.stringify(errorSpy.mock.calls)).not.toContain('Saturday');
  });

  it('on a network failure', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
    expect((await call(validBody())).data).toEqual(FALLBACK_REPLY);
  });

  it('on a response without choices[0].message', async () => {
    queue({ choices: [] });
    expect((await call(validBody())).data).toEqual(FALLBACK_REPLY);
  });

  it('on a 20 s timeout', async () => {
    jest.useFakeTimers({ doNotFake: ['setImmediate', 'nextTick', 'queueMicrotask'] });
    try {
      fetchMock.mockImplementationOnce((_url: string, init: RequestInit) => new Promise((_resolve, reject) => {
        init.signal!.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
      }));
      const pending = handleAssist(req(validBody()), makeEnv());
      // The guards (hashing, KV) run on real async work before fetch is reached.
      while (fetchMock.mock.calls.length === 0) await new Promise((r) => setImmediate(r));
      await jest.advanceTimersByTimeAsync(LLM_TIMEOUT_MS - 1);
      expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(false);
      await jest.advanceTimersByTimeAsync(1);
      const res = await pending;
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(FALLBACK_REPLY);
    } finally {
      jest.useRealTimers();
    }
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
