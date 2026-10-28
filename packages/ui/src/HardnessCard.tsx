import { classifyHardness } from '@sourdough/calc/data/ukWaterHardness';
import { hardnessFor } from '@sourdough/calc/lib/hardnessFor';
import { normalizePostcode, type Settings } from '@sourdough/core/settings';
import type { Place } from '@sourdough/core/weather';
import { NumField } from './components';

/**
 * Water hardness: a number you type wins, then a UK postcode (looked up in a
 * table in the app, so it needs no network), then the town found from your
 * location. The card says which one is in use.
 */
export function HardnessCard({ settings, onChange, place, why }: { settings: Settings; onChange: (s: Settings) => void; place?: Place; why: string }) {
  const { hardness, source } = hardnessFor({ manualMgL: settings.waterHardnessMgL, postcode: settings.postcode, place });
  const mg = settings.waterHardnessMgL;
  const line =
    source === 'manual'
      ? `Using your ${mg} mg/L, which is ${classifyHardness(mg)}.`
      : source === 'postcode'
        ? `${hardness.mgL} mg/L, ${hardness.classification}, from your postcode. ${hardness.note}.`
        : source === 'location'
          ? `${hardness.mgL} mg/L, ${hardness.classification}, from your location${place?.city && place.city !== 'Unknown' ? ` (${place.city})` : ''}. ${hardness.note}.`
          : `Not set, so ${hardness.mgL} mg/L (${hardness.classification}) is assumed. Enter a UK postcode, or use your location on the calculator screen.`;
  return (
    <fieldset className="card">
      <legend>Water hardness</legend>
      <p className="hint" style={{ marginTop: 0 }}>
        {why}
      </p>
      <div className="field">
        <label htmlFor="pc">UK postcode</label>
        <input
          id="pc"
          type="text"
          autoComplete="postal-code"
          value={settings.postcode}
          placeholder="For example SW1A 1AA"
          onChange={(e) => onChange({ ...settings, postcode: normalizePostcode(e.target.value) })}
        />
        <p className="hint">Looked up in a table inside the app. Nothing is sent anywhere, and it is only used for this.</p>
      </div>
      <NumField
        label="Or type the hardness"
        value={mg === 0 ? '0' : String(mg)}
        suffix="mg/L"
        hint="mg/L CaCO₃, from your water company’s website or a test kit. Leave at 0 to use the postcode or location."
        onChange={(v) => {
          const n = parseFloat(v);
          onChange({ ...settings, waterHardnessMgL: Number.isFinite(n) && n > 0 && n <= 2000 ? n : 0 });
        }}
      />
      <div className="converted">
        <p>{line}</p>
      </div>
    </fieldset>
  );
}
