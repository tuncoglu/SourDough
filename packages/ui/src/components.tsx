import { useId, type ReactNode } from 'react';

/** The glyph in the page header: a cream disc with a dark mark, as in the app icon. */
export function Logo({ children }: { children: ReactNode }) {
  return (
    <span className="logo" aria-hidden="true">
      {children}
    </span>
  );
}

export function Header({ title, subtitle, logo }: { title: string; subtitle: string; logo?: ReactNode }) {
  return (
    <header className="top">
      <h1>
        {logo}
        {title}
      </h1>
      <p className="subtitle">{subtitle}</p>
      <p className="tagline">Guidance, not guarantee.</p>
    </header>
  );
}

export interface TabDef<T extends string> {
  id: T;
  label: string;
}

export function TabBar<T extends string>({ tabs, active, onChange }: { tabs: TabDef<T>[]; active: T; onChange: (id: T) => void }) {
  return (
    <nav className="tabs" aria-label="Screens">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          className={t.id === active ? 'on' : ''}
          aria-current={t.id === active ? 'page' : undefined}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}

export interface ChipOption<T extends string> {
  id: T;
  label: string;
}

/** A row of toggle chips where exactly one is on. */
export function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: ChipOption<T>[];
  value: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="chips" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          className={o.id === value ? 'chip chip-on' : 'chip'}
          aria-pressed={o.id === value}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/**
 * A number typed as text. The draft stays a string so "1." and an empty field
 * survive while typing; the caller decides what an empty or odd value means.
 */
export function NumField({
  label,
  value,
  onChange,
  suffix,
  hint,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  hint?: string;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="input-row">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            const t = e.target.value;
            if (/^\d*[.,]?\d*$/.test(t)) onChange(t.replace(',', '.'));
          }}
        />
        {suffix && <span className="suffix">{suffix}</span>}
      </div>
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

/** A slider with its value shown beside the label. */
export function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '%',
  onChange,
  hint,
}: {
  label: string;
  value: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  const id = useId();
  const n = parseFloat(value);
  return (
    <div className="slider">
      <div className="slider-head">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>
          {Number.isFinite(n) ? n : '—'} {unit}
        </output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min} onChange={(e) => onChange(e.target.value)} />
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

export function Check({
  checked,
  onChange,
  title,
  detail,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  detail?: string;
}) {
  return (
    <label className="check">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        {title}
        {detail && <small>{detail}</small>}
      </span>
    </label>
  );
}

export type NoteKind = 'plain' | 'warn' | 'danger' | 'care';

export function Note({ kind = 'plain', children }: { kind?: NoteKind; children: ReactNode }) {
  return <div className={kind === 'plain' ? 'note' : `note note-${kind}`}>{children}</div>;
}

/** Marks a number as an estimate: it comes from a model, not a measurement. */
export function EstimateBadge({ label = 'estimate' }: { label?: string }) {
  return <span className="badge badge-warn">{label}</span>;
}

export function KV({ rows }: { rows: Array<[string, ReactNode]> }) {
  return (
    <dl className="kv">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export type AppId = 'bread' | 'yogurt' | 'lacto' | 'pasta';

export interface OtherApp {
  id: AppId;
  name: string;
  host: string;
}

export const SIBLING_APPS: OtherApp[] = [
  { id: 'bread', name: 'Bread', host: 'bread.sourdoughcalculator.uk' },
  { id: 'yogurt', name: 'Yogurt', host: 'yogurt.sourdoughcalculator.uk' },
  { id: 'lacto', name: 'Lacto-ferment', host: 'lactoferment.sourdoughcalculator.uk' },
  { id: 'pasta', name: 'Pasta & noodles', host: 'pasta.sourdoughcalculator.uk' },
];

const SITE = 'https://sourdoughcalculator.uk';
const SOURCE = 'https://github.com/tuncoglu/SourDough';

/** Every calculator, with the current one marked and the rest linking out. Each keeps its own settings. */
export function OtherCalculators({ current }: { current: AppId }) {
  return (
    <nav className="card other" aria-label="Sourdough Calculators">
      <p className="lg">Sourdough Calculators</p>
      {SIBLING_APPS.map((a) =>
        a.id === current ? (
          <div key={a.id} className="olink here" aria-current="page">
            {a.name}
            <span>This one</span>
          </div>
        ) : (
          <a key={a.id} className="olink" href={`https://${a.host}`}>
            {a.name}
            <span>{a.host}</span>
          </a>
        ),
      )}
      <p className="hint">Each calculator is its own app and keeps its own settings.</p>
    </nav>
  );
}

/** The last tab of every web app: Settings, the other calculators, and the About, Privacy and Source links. */
export function MorePage({ current, onSettings }: { current: AppId; onSettings: () => void }) {
  return (
    <div className="stack">
      <section className="card other" aria-label="Settings">
        <button type="button" className="olink row" onClick={onSettings}>
          <span>
            Settings
            <small>Units, kitchen temperature, location. Kept on this device, for this calculator only.</small>
          </span>
          <b aria-hidden="true">›</b>
        </button>
      </section>
      <OtherCalculators current={current} />
      <nav className="links" aria-label="About">
        <a href={`${SITE}/about`}>About</a>
        <a href={`${SITE}/privacy`}>Privacy</a>
        <a href={SOURCE} rel="noreferrer">
          Source on GitHub
        </a>
      </nav>
    </div>
  );
}
