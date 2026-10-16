/**
 * The one place that knows which LLM provider "Ask the baker" uses.
 *
 * Today that is DeepSeek's OpenAI-compatible Chat Completions API, called with
 * the runtime's fetch (no SDK, no npm dependencies). Swapping providers later
 * should touch only this file. Spec: ASSISTANT_SPEC.md §3.
 *
 * Thinking is explicitly disabled: DeepSeek's docs say it is on by default, and
 * a thinking reply spends the whole token budget on reasoning_content, leaving
 * content empty. Disabling it also means reasoning_content never has to be
 * passed back on tool-call continuations.
 */

export interface LlmEnv {
  DEEPSEEK_API_KEY?: string;
  DEEPSEEK_MODEL?: string;
  DEEPSEEK_BASE_URL?: string;
}

export interface LlmToolCall { id: string; name: string; arguments: string } // arguments: JSON text
export interface LlmMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: LlmToolCall[];
  tool_call_id?: string;
}
export interface LlmTurn { content: string | null; toolCalls: LlmToolCall[] }

/** A function the model may call. `parameters` is a JSON Schema object. */
export interface ToolDef {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export const LLM_TIMEOUT_MS = 20_000;
const DEFAULT_BASE_URL = 'https://api.deepseek.com';
const DEFAULT_MODEL = 'deepseek-flash';

/** Thrown on timeout, HTTP errors and malformed responses; the caller shows the generic reply. */
export class LlmError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LlmError';
  }
}

function toWire(m: LlmMessage): Record<string, unknown> {
  const out: Record<string, unknown> = { role: m.role, content: m.content };
  if (m.tool_calls?.length) {
    out.tool_calls = m.tool_calls.map((c) => ({ id: c.id, type: 'function', function: { name: c.name, arguments: c.arguments } }));
  }
  if (m.tool_call_id) out.tool_call_id = m.tool_call_id;
  return out;
}

export async function chat(env: LlmEnv, messages: LlmMessage[], tools: ToolDef[]): Promise<LlmTurn> {
  const base = (env.DEEPSEEK_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);
  let data: unknown;
  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.DEEPSEEK_API_KEY}` },
      body: JSON.stringify({
        model: env.DEEPSEEK_MODEL ?? DEFAULT_MODEL,
        thinking: { type: 'disabled' },
        messages: messages.map(toWire),
        tools: tools.map((t) => ({ type: 'function', function: { name: t.name, description: t.description, parameters: t.parameters } })),
        tool_choice: 'auto',
        temperature: 0.3,
        max_tokens: 700,
        stream: false,
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw new LlmError(`HTTP ${res.status}`);
    data = await res.json();
  } catch (err) {
    if (err instanceof LlmError) throw err;
    throw new LlmError(controller.signal.aborted ? 'timeout' : 'network');
  } finally {
    clearTimeout(timer);
  }

  const message = (data as { choices?: { message?: unknown }[] } | null)?.choices?.[0]?.message;
  if (typeof message !== 'object' || message === null) throw new LlmError('no message');
  const { content, tool_calls } = message as { content?: unknown; tool_calls?: unknown };
  const toolCalls: LlmToolCall[] = [];
  if (Array.isArray(tool_calls)) {
    for (const c of tool_calls) {
      const fn = (c as { function?: { name?: unknown; arguments?: unknown } })?.function;
      const id = (c as { id?: unknown })?.id;
      if (typeof id === 'string' && typeof fn?.name === 'string') {
        toolCalls.push({ id, name: fn.name, arguments: typeof fn.arguments === 'string' ? fn.arguments : '' });
      }
    }
  }
  return { content: typeof content === 'string' ? content : null, toolCalls };
}
