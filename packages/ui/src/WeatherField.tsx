import { useEffect, useRef, useState } from 'react';
import { detectWeather, failureMessage, type Weather } from '@sourdough/core/weather';
import { Check } from './components';

interface Props {
  /** The fresh reading, or null. */
  weather: Weather | null;
  onWeather: (w: Weather) => void;
  autoDetect: boolean;
  onAutoDetect: (on: boolean) => void;
  /** What the reading is used for, e.g. "the room temperature". */
  purpose: string;
  /** Also find your town, for water hardness (one more request, to OpenStreetMap's Nominatim). */
  place?: boolean;
  /** Also estimate the tap-water temperature (Open-Meteo's archive). */
  tapTemp?: boolean;
}

// One automatic lookup per page load, however many times this field mounts.
let autoRan = false;

/**
 * Reads the outdoor temperature and forecast from the person's location, but
 * only when they ask (or have turned on auto-detect). It never runs on its own
 * otherwise, and says plainly what is sent.
 */
export function WeatherField({ weather, onWeather, autoDetect, onAutoDetect, purpose, place, tapTemp }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onWeatherRef = useRef(onWeather);
  onWeatherRef.current = onWeather;

  const detect = async () => {
    setBusy(true);
    setError(null);
    const r = await detectWeather({}, { place, tapTemp });
    setBusy(false);
    if (r.ok) onWeatherRef.current({ tempC: r.tempC, hourly: r.hourly, at: r.at, place: r.place, tapTempC: r.tapTempC });
    else setError(failureMessage(r.reason));
  };

  useEffect(() => {
    if (autoDetect && !autoRan && weather == null) {
      autoRan = true;
      void detect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoDetect]);

  const time = weather ? new Date(weather.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="ambient">
      <div className="row">
        <button type="button" className="btn btn-small" onClick={() => void detect()} disabled={busy}>
          {busy ? 'Finding the forecast…' : weather ? 'Refresh from my location' : 'Use my location for the forecast'}
        </button>
      </div>
      {weather && (
        <p className="hint">
          Outdoor forecast near you, read at {time} from Open-Meteo. Your kitchen may be warmer or cooler: set your room
          temperature in Settings if you know it, and it will be used for {purpose} instead.
        </p>
      )}
      {error && (
        <p className="error" role="status">
          {error}
        </p>
      )}
      <Check checked={autoDetect} onChange={onAutoDetect} title="Detect automatically when I open the app" />
      <p className="hint">
        Sends your approximate location (rounded to about 1 km) to open-meteo.com to read the forecast
        {place ? ', and to nominatim.openstreetmap.org (OpenStreetMap) to find your town for the water hardness' : ''}
        {tapTemp ? ', and asks Open-Meteo for the last three weeks of temperatures to estimate your tap water' : ''}.
        Nothing is stored on a server, and nothing is sent unless you tap the button or turn this on.
      </p>
    </div>
  );
}
