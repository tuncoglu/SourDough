import { useState } from 'react';
import type { FermentHistoryEntry } from '@sourdough/calc/models/types';
import { fermentSummary } from '@sourdough/calc/lib/fermentHistory';
import { formatTemp } from '@sourdough/calc/lib/unitConversion';
import type { Units } from '@sourdough/core/settings';

interface Props {
  history: FermentHistoryEntry[];
  units: Units;
  onAgain: (e: FermentHistoryEntry) => void;
  onDelete: (id: string) => void;
}

const when = (iso: string) => new Date(iso).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });

/** Every ferment you worked out is here. Nothing was saved by hand, and nothing leaves this device. */
export function HistoryPage({ history, units, onAgain, onDelete }: Props) {
  const [q, setQ] = useState('');
  const shown = history.filter((e) => `${e.presetName} ${e.vegName}`.toLowerCase().includes(q.trim().toLowerCase()));
  if (history.length === 0) {
    return (
      <div className="stack">
        <section className="card">
          <h2>No ferments yet</h2>
          <p className="hint">Work one out on the calculator and it appears here by itself. There is no save button.</p>
        </section>
      </div>
    );
  }
  return (
    <div className="stack">
      <div className="field" style={{ margin: 0 }}>
        <label htmlFor="hq">Search</label>
        <input id="hq" type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Style or vegetable" autoComplete="off" />
      </div>
      {shown.map((e) => (
        <section className="card" key={e.id} aria-label={`${e.presetName}, ${when(e.createdAt)}`}>
          <h2 style={{ marginBottom: 2 }}>
            {e.presetEmoji} {e.presetName}
          </h2>
          <p className="hint" style={{ marginTop: 0 }}>
            {when(e.createdAt)} · {fermentSummary(e)}
          </p>
          <dl className="kv">
            <div>
              <dt>Salt</dt>
              <dd>{e.results.saltGrams} g</dd>
            </div>
            <div>
              <dt>Ready in about</dt>
              <dd>
                {e.results.estimatedDays} days at {formatTemp(e.results.tempC, units, 0)}
              </dd>
            </div>
          </dl>
          <div className="row">
            <button type="button" className="btn btn-small" onClick={() => onAgain(e)}>
              Calculate again
            </button>
            <button type="button" className="btn btn-small" onClick={() => onDelete(e.id)} aria-label={`Delete ${e.presetName} from ${when(e.createdAt)}`}>
              Delete
            </button>
          </div>
        </section>
      ))}
      {shown.length === 0 && <p className="hint center">Nothing matches “{q}”.</p>}
      <p className="hint center">Kept on this device for a year, then rotated out.</p>
    </div>
  );
}
