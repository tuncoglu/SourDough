import { useEffect, useMemo, useState } from 'react';
import type { StarterFeeding } from '@sourdough/calc/models/types';
import { computeVitalityFactor } from '@sourdough/calc/lib/calculations';
import { formatHours } from '@sourdough/calc/lib/lazyMethod';
import { estimateLazyLoaf, LAZY_STARTER_TEMP_C } from '@sourdough/calc/lib/lazyPlan';
import { findFlour } from '@sourdough/calc/lib/flourSearch';
import { resolveHardness } from '@sourdough/calc/lib/hardnessUtils';
import { DEFAULT_PEAK_EFFECTIVE_HOURS, PEAKS_NEEDED_TO_LEARN, feedDilution, starterPace, starterTimeToPeakHours } from '@sourdough/calc/lib/starterStatus';
import { DEFAULT_KEPT_GRAMS, FEED_RATIOS, amountsForRatio, buildFeeding, ratioLabel, type StarterState } from '@sourdough/calc/lib/starterLog';
import { clockTime, dayAndTime, hoursLabel, spanLabel } from '@sourdough/calc/lib/starterFormat';
import { formatTemp, formatWeight } from '@sourdough/calc/lib/unitConversion';
import { whenLabel, type BreadPlan } from '@sourdough/calc/lib/breadPlan';
import type { Settings } from '@sourdough/core/settings';
import { ChipGroup, KV, Note, NumField } from '@sourdough/ui/components';
import { FlourSelect } from './Cards';

interface Props {
  starter: StarterState;
  plan: BreadPlan;
  now: Date;
  roomTempC: number;
  settings: Settings;
  hydration: number;
  onFeed: (f: StarterFeeding) => void;
  onMarkPeaked: (id: string) => void;
  onFridge: (id: string, state: 'in' | 'out') => void;
  onDelete: (id: string) => void;
  goCalc: () => void;
}

const ZONE_NOTE: Record<string, [string, string]> = {
  dormant: ['Dormant in the fridge: preserved.', 'It is asleep, not dead. For a loaf, either mix straight from the fridge, or take it out and feed it a few hours before you mix.'],
  building: ['Waking up.', 'Out of the fridge and warming. Give it a few hours on the counter before you rely on it.'],
  'just-fed': ['Just fed: building strength.', 'It has not reached its peak yet. Check back as the window gets closer.'],
  peak: ['At its peak.', 'This is the best time to mix: domed, bubbly, and just starting to fall.'],
  'past-peak': ['Past its peak.', 'Still fine to bake with, but it is slowing. Feed it again if you want it at its best.'],
  hungry: ['Hungry.', 'It has run out of food. It will still work, but slowly. Feed it, and bake once it has peaked.'],
};

const PACE_TEMPS = [18, 20, 24, 27];
const STATES: Array<{ label: string; hours: number | null; fridge?: boolean }> = [
  { label: 'Just fed (2 h)', hours: 2 },
  { label: 'At peak (6 h)', hours: 6 },
  { label: 'Past peak (12 h)', hours: 12 },
  { label: 'Hungry (24 h)', hours: 24 },
  { label: 'Hungry (30 h)', hours: 30 },
  { label: 'From the fridge (4 °C)', hours: null, fridge: true },
];

export function StarterPage(p: Props) {
  const { starter, plan, now, roomTempC, settings, hydration } = p;
  const units = settings.units;
  const w = (g: number) => formatWeight(g, units, units === 'imperial' ? 1 : 0);
  const status = starter.status;
  const f = starter.feeding;
  const pace = starterPace(roomTempC);
  const inFridge = !!status?.isInFridge;

  // ── The feed form ──
  const [ratio, setRatio] = useState(1);
  const [kept, setKept] = useState(String(DEFAULT_KEPT_GRAMS));
  const [flours, setFlours] = useState<Array<{ label: string; grams: string }>>([{ label: starter.flourBlend?.[0]?.label ?? 'Generic: Bread Flour', grams: '50' }]);
  const [waterG, setWaterG] = useState('50');
  const [notes, setNotes] = useState('');
  const [typed, setTyped] = useState(false);
  const keptN = parseFloat(kept) || 0;
  useEffect(() => {
    if (typed) return;
    const a = amountsForRatio({ keptGrams: keptN, ratio, hydration });
    setFlours((rows) => {
      const each = Math.floor(a.flourGrams / rows.length);
      return rows.map((r, i) => ({ ...r, grams: String(i === 0 ? a.flourGrams - each * (rows.length - 1) : each) }));
    });
    setWaterG(String(a.waterGrams));
  }, [ratio, keptN, hydration, typed, flours.length]);
  const flourTotal = flours.reduce((s, r) => s + (parseFloat(r.grams) || 0), 0);
  const waterN = parseFloat(waterG) || 0;
  const dilution = feedDilution({ starterKeptGrams: keptN, flourGrams: flourTotal, waterGrams: waterN });
  const toPeak = starterTimeToPeakHours({ roomTempC, dilution, peakEffectiveHours: starter.peakEffectiveHours });
  const needed = plan.starterGrams;
  const total = keptN + flourTotal + waterN;
  const record = () => {
    const rec = buildFeeding({
      id: `feed_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      now: new Date(),
      flours,
      waterGrams: waterG,
      keptGrams: kept,
      roomTempC,
      notes,
    });
    if (rec) {
      p.onFeed(rec);
      setNotes('');
    }
  };

  // ── What its state does to the rise: the same loaf each time ──
  const effect = useMemo(() => {
    const base = { flourGrams: 500, waterPct: 75, starterPct: 20, saltPct: 2, starterHydration: 100, roomTempC };
    return STATES.map((s) => {
      const est = estimateLazyLoaf(
        { ...base, starterTempC: s.fridge ? LAZY_STARTER_TEMP_C : roomTempC, starterHoursSinceFed: s.hours ?? undefined, flour: findFlour('Generic: Bread Flour') },
        null,
        resolveHardness(0),
        units,
      );
      return { label: s.label, activity: s.hours === null ? 100 : Math.round(computeVitalityFactor(s.hours) * 100), rise: est ? formatHours(est.bulkHours) : '—' };
    });
  }, [roomTempC, units]);

  const marked = starter.feedings.filter((x) => x.peakedAt);
  const sch = plan.schedule;
  const dilutionOf = (r: number) => feedDilution({ starterKeptGrams: 50, flourGrams: 50 * r, waterGrams: 50 * r });

  return (
    <div className="stack">
      <section className="card" aria-labelledby="st-h">
        <h2 id="st-h">Your starter</h2>
        {status && f ? (
          <>
            <p className="zone">
              {status.emoji} {status.label}
            </p>
            <div className="big">
              <span className="big-num">{hoursLabel(status.hoursSinceFed)}</span>
              <span className="big-label">since last fed</span>
            </div>
            <KV
              rows={[
                ['Last fed', dayAndTime(f.timestamp)],
                ['Into the fridge', f.fridgeAt ? `${dayAndTime(f.fridgeAt)}${f.outOfFridgeAt ? `, out ${clockTime(new Date(f.outOfFridgeAt))}` : ''}` : 'Not in the fridge'],
                ['Effective age', hoursLabel(status.effectiveHours)],
                [`Your kitchen, ${formatTemp(roomTempC, units, 0)}`, `${Math.round(pace * 100)} % of the 22 °C pace`],
                ['Activity (heuristic)', `${Math.round(computeVitalityFactor(status.effectiveHours) * 100)} % of peak`],
              ]}
            />
            <Note kind="care">
              <p>
                <strong>{(ZONE_NOTE[status.zone] ?? ZONE_NOTE['just-fed']!)[0]}</strong>
              </p>
              <p className="hint">{(ZONE_NOTE[status.zone] ?? ZONE_NOTE['just-fed']!)[1]}</p>
            </Note>
            <div className="row">
              {inFridge ? (
                <button type="button" className="btn btn-primary" onClick={() => p.onFridge(f.id, 'out')}>
                  I’ve taken it out of the fridge
                </button>
              ) : (
                <>
                  {!f.peakedAt && (
                    <button type="button" className="btn btn-primary" onClick={() => p.onMarkPeaked(f.id)}>
                      Mark as peaked
                    </button>
                  )}
                  <button type="button" className="btn btn-small" onClick={() => p.onFridge(f.id, 'in')}>
                    Into the fridge
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="zone">No feeding logged yet</p>
            <p className="hint">
              Log a feeding below and the app follows your starter from there: how strong it is, when it peaks, and how that changes the rise. Until then the bread page assumes a fridge-cold starter at full strength.
            </p>
          </>
        )}
      </section>

      {sch?.plan && !sch.tooEarly && (
        <section className="card" aria-labelledby="pl-h">
          <h2 id="pl-h">Your next bake</h2>
          <KV
            rows={[
              ...(sch.plan.steps.find((s) => s.key === 'cool')
                ? ([['Ready to slice', whenLabel(new Date(sch.plan.steps.find((s) => s.key === 'cool')!.at.getTime() + 3_600_000), now)]] as Array<[string, string]>)
                : []),
              ...(sch.plan.feedAt ? ([['Feed', whenLabel(sch.plan.feedAt, now)]] as Array<[string, string]>) : []),
              ['Mix', whenLabel(sch.plan.mixAt, now)],
              ...(sch.plan.mixWindow ? ([['Peak window', `${clockTime(sch.plan.mixWindow.from)} to ${clockTime(sch.plan.mixWindow.to)}`]] as Array<[string, string]>) : []),
            ]}
          />
          <button type="button" className="btn btn-small" onClick={p.goCalc}>
            Open the plan
          </button>
        </section>
      )}

      <section className="card" aria-labelledby="kit-h">
        <h2 id="kit-h">How fast it runs in your kitchen</h2>
        <p className="hint" style={{ marginTop: 0 }}>
          A starter works faster when it is warm, and a bigger feed takes longer to peak. Hours to peak after a feed, by feed ratio and kitchen temperature: <span className="badge badge-warn">heuristic</span>
        </p>
        <table className="bakers">
          <thead>
            <tr>
              <th>Ratio</th>
              {PACE_TEMPS.map((t) => (
                <th key={t}>{formatTemp(t, units, 0)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEED_RATIOS.map((r) => (
              <tr key={r}>
                <td>
                  1 : {r} : {r}
                </td>
                {PACE_TEMPS.map((t) => (
                  <td key={t}>{(Math.round(starterTimeToPeakHours({ roomTempC: t, dilution: dilutionOf(r), peakEffectiveHours: starter.peakEffectiveHours }) * 10) / 10).toFixed(1)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="hint">The ratio is starter : flour : water. Your kitchen is at {formatTemp(roomTempC, units, 0)}.</p>
        <h3>The zones</h3>
        <table className="bakers">
          <thead>
            <tr>
              <th>Zone</th>
              <th>Effective</th>
              <th>On the clock</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Just fed', 0, 4],
              ['At peak', 4, 8],
              ['Past peak', 8, 14],
            ].map(([name, a, b]) => (
              <tr key={name as string}>
                <td>{name}</td>
                <td>
                  {a} to {b} h
                </td>
                <td>
                  {(Math.round(((a as number) / pace) * 10) / 10).toFixed(1)} to {(Math.round(((b as number) / pace) * 10) / 10).toFixed(1)} h
                </td>
              </tr>
            ))}
            <tr>
              <td>Hungry</td>
              <td>over 14 h</td>
              <td>over {(Math.round((14 / pace) * 10) / 10).toFixed(1)} h</td>
            </tr>
          </tbody>
        </table>
        <p className="hint">
          Effective hours are warm-equivalent time at 22 °C for a 1 : 1 : 1 feed. The clock column is for your kitchen and a 1 : 1 : 1 feed. Waking up (the first hours out of the fridge) and dormant (in the fridge) are separate zones.
        </p>
      </section>

      <section className="card" aria-labelledby="own-h">
        <h2 id="own-h">
          Your starter’s own peak <span className="badge badge-warn">{starter.learnedFromPeaks ? 'learned' : 'default'}</span>
        </h2>
        <p style={{ marginTop: 0 }}>
          {starter.learnedFromPeaks ? (
            <>
              The app uses <strong>{starter.peakEffectiveHours} effective hours</strong> to peak, the median of your last {starter.learnedFromPeaks} marked peaks.
            </>
          ) : (
            <>
              The app uses <strong>{DEFAULT_PEAK_EFFECTIVE_HOURS} effective hours</strong> to peak for a 1 : 1 : 1 feed at 22 °C. After <strong>{PEAKS_NEEDED_TO_LEARN} peaks</strong> at similar ratios, it uses the median of yours instead.
            </>
          )}
        </p>
        <KV
          rows={[
            ['Peaks logged', `${marked.length}${starter.learnedFromPeaks ? '' : ` of ${PEAKS_NEEDED_TO_LEARN}`}`],
            ...marked.slice(0, 5).map((m) => {
              const t = m.roomTempC;
              return [`${dayAndTime(m.timestamp)}${t !== undefined ? ` · ${formatTemp(t, units, 1)}` : ''}`, spanLabel(m.timestamp, m.peakedAt!)] as [string, string];
            }),
          ]}
        />
        <p className="hint">
          Tap “Mark as peaked” when the starter is domed and just starting to fall. The app turns the clock time into effective hours for that day’s kitchen temperature, so a warm day and a cool day count the same.
        </p>
      </section>

      <section className="card" aria-labelledby="eff-h">
        <h2 id="eff-h">What its state does to the rise</h2>
        <p className="hint" style={{ marginTop: 0 }}>
          The same loaf each time: 500 g flour, 75 % water, 20 % starter, in a {formatTemp(roomTempC, units, 0)} kitchen.
        </p>
        <table className="bakers">
          <thead>
            <tr>
              <th>Starter state</th>
              <th>Activity</th>
              <th>Rise</th>
            </tr>
          </thead>
          <tbody>
            {effect.map((e) => (
              <tr key={e.label}>
                <td>{e.label}</td>
                <td>{e.activity} %</td>
                <td>{e.rise}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="hint">
          Hours are effective hours. Counter time is scaled to your kitchen’s pace, and fridge time counts at about 6 %. <span className="badge badge-warn">heuristic</span> Your own starter may differ, and the log below helps you learn how.
        </p>
      </section>

      <details className="card plain">
        <summary style={{ fontWeight: 700, minHeight: 44, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>About these numbers</summary>
        <p className="hint">
          The 6 effective hours to peak, and the zones, are the app’s own figures. Baker guides give 6 to 8 hours for a 1 : 1 : 1 feed, about 4 to 6 hours near 24 to 26 °C and 8 to 12 hours near 18 to 21 °C. The ×2.5 per 10 °C matches one baker’s log of 9 hours at 21 °C and 6.5 hours at 24 °C.
        </p>
        <p className="hint">
          No controlled study of this was found. The effect of the feed ratio (a bigger feed needs more doublings, so it peaks later) and the warm-kitchen advice are reasoned estimates. That is why the app learns from your own peaks.
        </p>
        <p className="hint">Warm kitchen, 27 °C or more? A 1 : 1 : 1 feed peaks in a few hours and is soon past its window. Feed a bigger ratio, or keep the jar somewhere cooler. This is baker guidance, not measured data.</p>
      </details>

      <fieldset className="card">
        <legend>Feed now</legend>
        <p className="hint" style={{ marginTop: 0 }}>
          Keep some starter in the jar, then add flour and water. For a loaf that mixes at peak, the feed time comes from your plan.
        </p>
        <ChipGroup
          label="Feed ratio"
          options={FEED_RATIOS.map((r) => ({ id: String(r), label: `1 : ${r} : ${r}` }))}
          value={String(ratio)}
          onChange={(v) => {
            setTyped(false);
            setRatio(Number(v));
          }}
        />
        {flours.map((r, i) => (
          <div key={i}>
            <FlourSelect id={`sf-${i}`} label={flours.length > 1 ? `Flour ${i + 1}` : 'Flour'} value={r.label} onChange={(v) => setFlours(flours.map((x, j) => (j === i ? { ...x, label: v } : x)))} />
            {flours.length > 1 && (
              <div className="grid2">
                <NumField
                  label={`Flour ${i + 1} grams`}
                  value={r.grams}
                  suffix="g"
                  onChange={(v) => {
                    setTyped(true);
                    setFlours(flours.map((x, j) => (j === i ? { ...x, grams: v } : x)));
                  }}
                />
                <button type="button" className="link" onClick={() => setFlours(flours.filter((_, j) => j !== i))}>
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}
        {flours.length < 3 && (
          <button type="button" className="link" onClick={() => { setTyped(false); setFlours([...flours, { label: 'Generic: Bread Flour', grams: '0' }]); }}>
            Feed with another flour
          </button>
        )}
        <NumField
          label="Starter kept in the jar"
          value={kept}
          suffix="g"
          onChange={(v) => {
            setTyped(false);
            setKept(v);
          }}
        />
        <div className="grid2">
          {flours.length === 1 && (
            <NumField
              label="Flour"
              value={flours[0]!.grams}
              suffix="g"
              onChange={(v) => {
                setTyped(true);
                setFlours([{ ...flours[0]!, grams: v }]);
              }}
            />
          )}
          <NumField
            label="Water"
            value={waterG}
            suffix="g"
            onChange={(v) => {
              setTyped(true);
              setWaterG(v);
            }}
          />
        </div>
        <div className="converted">
          <p>
            <strong>{w(total)} in all.</strong> Peaks in about {hoursLabel(toPeak)} at {formatTemp(roomTempC, units, 0)}, between{' '}
            {hoursLabel((toPeak * 4) / DEFAULT_PEAK_EFFECTIVE_HOURS)} and {hoursLabel((toPeak * 8) / DEFAULT_PEAK_EFFECTIVE_HOURS)}.
          </p>
          <p className="hint" style={{ margin: 0 }}>
            {total - keptN >= 0 && keptN + flourTotal + waterN - Math.max(0, keptN) >= needed
              ? `Enough for the ${w(needed)} loaf${total - needed > 0 ? `, with ${w(total - needed)} left to stay in the jar` : ''}.`
              : `Not enough for the ${w(needed)} loaf: use more flour and water, or a bigger ratio.`}
          </p>
        </div>
        <div className="field">
          <label htmlFor="nt">Notes</label>
          <input id="nt" type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" autoComplete="off" />
        </div>
        <button type="button" className="btn btn-primary" onClick={record} disabled={flourTotal <= 0 || waterN <= 0}>
          I’ve fed it
        </button>
        <p className="hint">Sizes are rounded for the scale. The feeding goes in the log below, with the kitchen temperature right now.</p>
      </fieldset>

      <section aria-labelledby="log-h" style={{ display: 'grid', gap: 12 }}>
        <h2 id="log-h" style={{ margin: '4px 0 0' }}>
          Feeding log
        </h2>
        {starter.feedings.length === 0 && <p className="hint">Nothing logged yet.</p>}
        {starter.feedings.map((e, i) => (
          <article key={e.id} className={i === 0 ? 'card entry active' : 'card entry'}>
            <div className="entry-head">
              <strong>{dayAndTime(e.timestamp)}</strong>
              <span className={i === 0 ? 'tag tag-active' : 'tag'}>{i === 0 ? 'Latest' : ratioLabel(e)}</span>
            </div>
            <p className="muted" style={{ margin: '4px 0' }}>
              {ratioLabel(e)} · {w(e.flourGrams)} {e.flourUsed}, {w(e.waterGrams)} water{e.starterKeptGrams ? `, ${w(e.starterKeptGrams)} kept` : ''}
            </p>
            {e.fridgeAt && (
              <p className="muted" style={{ margin: '4px 0' }}>
                In the fridge {dayAndTime(e.fridgeAt)}
                {e.outOfFridgeAt ? `, out ${dayAndTime(e.outOfFridgeAt)}` : ''}
              </p>
            )}
            {e.peakedAt && (
              <p style={{ margin: '4px 0' }}>
                Peaked after {spanLabel(e.timestamp, e.peakedAt)}
                {e.roomTempC !== undefined ? ` at ${formatTemp(e.roomTempC, units, 1)}` : ''}.
              </p>
            )}
            {e.notes && <p style={{ margin: '4px 0' }}>{e.notes}</p>}
            <div className="row">
              {!e.peakedAt && !e.fridgeAt && (
                <button type="button" className="btn btn-small" onClick={() => p.onMarkPeaked(e.id)}>
                  Mark as peaked
                </button>
              )}
              {e.fridgeAt && !e.outOfFridgeAt ? (
                <button type="button" className="btn btn-small" onClick={() => p.onFridge(e.id, 'out')}>
                  Out of the fridge
                </button>
              ) : (
                !e.fridgeAt && (
                  <button type="button" className="btn btn-small" onClick={() => p.onFridge(e.id, 'in')}>
                    Into the fridge
                  </button>
                )
              )}
              <button type="button" className="btn btn-small" aria-label={`Delete the feeding from ${dayAndTime(e.timestamp)}`} onClick={() => p.onDelete(e.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
