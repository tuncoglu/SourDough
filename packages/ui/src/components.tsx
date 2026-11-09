import { useId, useRef, type ReactNode } from 'react';

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

/** The Android app for bread, yogurt and lacto-ferments. `referrer` shows up in the Play Console as the traffic source. */
export const PLAY_URL =
  'https://play.google.com/store/apps/details?id=com.sourdough.optimizer&referrer=utm_source%3Dsourdoughcalculator.uk%26utm_medium%3Dwebsite';

/**
 * Where to get the app: a Google Play link, and an App Store button for the iPhone app that is not out
 * yet. That one opens an explanation with the Safari "Add to Home Screen" route to use in the meantime.
 * Nothing is counted or sent anywhere: these sites have no analytics.
 */
export function GetTheApp({ current }: { current: AppId }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const host = SIBLING_APPS.find((a) => a.id === current)?.host ?? 'sourdoughcalculator.uk';
  return (
    <section className="card store-links" aria-label="Get the app">
      <p className="store-label">Get the app</p>
      <p className="store-name-line">Dough &amp; Ferment Calculators</p>
      <p className="hint">Bread, yogurt and lacto-ferments in one Android app. Works offline.</p>
      <div className="store-buttons">
        <a className="store-button" href={PLAY_URL}>
          <span className="store-small">Get it on</span>
          <span className="store-big">Google Play</span>
        </a>
        <button type="button" className="store-button" onClick={() => dialog.current?.showModal()}>
          <span className="store-small">Download on the</span>
          <span className="store-big">App Store</span>
        </button>
      </div>
      <dialog
        ref={dialog}
        className="store-dialog"
        aria-labelledby="store-dialog-title"
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
      >
        <h2 id="store-dialog-title">The iPhone app is coming soon</h2>
        <p>Until it is in the App Store, you can put this calculator on your Home Screen from Safari. It opens full screen like an app and works offline.</p>
        <h3>Add it to your Home Screen</h3>
        <ol>
          <li>{`Open ${host} in Safari on your iPhone or iPad.`}</li>
          <li>Tap the Share button, the square with an arrow pointing up.</li>
          <li>Scroll down and choose “Add to Home Screen”, then tap Add.</li>
          <li>Open it from the new icon on your Home Screen.</li>
        </ol>
        <form method="dialog">
          <button className="store-close" autoFocus>
            Got it
          </button>
        </form>
      </dialog>
    </section>
  );
}

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
      <GetTheApp current={current} />
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
