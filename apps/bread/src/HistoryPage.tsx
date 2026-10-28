import { useState } from 'react';
import { formatHours } from '@sourdough/calc/lib/lazyMethod';
import { formatWeight } from '@sourdough/calc/lib/unitConversion';
import type { Units } from '@sourdough/core/settings';
import type { SavedLoaf } from './state';

interface Props {
  loaves: SavedLoaf[];
  units: Units;
  onOpen: (l: SavedLoaf) => void;
  onDelete: (id: string) => void;
}

const when = (iso: string) => new Date(iso).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });

/** The loaves you saved. They stay on this device. */
export function HistoryPage({ loaves, units, onOpen, onDelete }: Props) {
  const [q, setQ] = useState('');
  if (loaves.length === 0) {
    return (
      <div className="stack">
        <section className="card">
          <h2>No saved loaves yet</h2>
          <p className="hint">Tap “Save loaf” on the calculator to keep a formula here, then open it again later.</p>
        </section>
      </div>
    );
  }
  const shown = loaves.filter((l) => `${l.summary.flours}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="stack">
      <div className="field" style={{ margin: 0 }}>
        <label htmlFor="hq">Search</label>
        <input id="hq" type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Flour" autoComplete="off" />
      </div>
      {shown.map((l) => (
        <section className="card" key={l.id} aria-label={`Loaf saved ${when(l.createdAt)}`}>
          <h2 style={{ marginBottom: 2 }}>{formatWeight(l.summary.flourGrams, units, 0)} flour</h2>
          <p className="hint" style={{ marginTop: 0 }}>
            {when(l.createdAt)} · {l.summary.flours}
          </p>
          <dl className="kv">
            <div>
              <dt>Water · starter</dt>
              <dd>
                {l.summary.waterPct} % · {l.summary.starterPct} %
              </dd>
            </div>
            <div>
              <dt>Rise</dt>
              <dd>{l.summary.riseHours != null ? `about ${formatHours(l.summary.riseHours)}` : '—'}</dd>
            </div>
          </dl>
          <div className="row">
            <button type="button" className="btn btn-small" onClick={() => onOpen(l)}>
              Open in the calculator
            </button>
            <button type="button" className="btn btn-small" aria-label={`Delete the loaf saved ${when(l.createdAt)}`} onClick={() => onDelete(l.id)}>
              Delete
            </button>
          </div>
        </section>
      ))}
      {shown.length === 0 && <p className="hint center">Nothing matches “{q}”.</p>}
    </div>
  );
}
