import { useState, useEffect, useCallback } from 'react';
import * as ExpoLocation from 'expo-location';
import { LocationData, detectAll } from '../lib/location';
import { geocodePostcode } from '../lib/api';
import { getErrorMessage } from '../lib/errors';

export function useLocation() {
  const [data, setData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postcode, setPostcode] = useState<string>('');

  const detect = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied. Enter temps manually.');
        setLoading(false);
        return;
      }

      const pos = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Low,
      });

      const result = await detectAll(
        pos.coords.latitude,
        pos.coords.longitude,
        postcode || undefined,
        null,
      );

      if (result) {
        setData(result);
      } else {
        setError('Could not resolve location. Enter temps manually.');
      }
    } catch (e: unknown) {
      setError(getErrorMessage(e) || 'Location detection failed.');
    } finally {
      setLoading(false);
    }
  }, [postcode]);

  const refineWithPostcode = useCallback(async (pc: string, countryCode: string = '') => {
    setLoading(true);
    setError(null);
    setPostcode(pc);
    try {
      const loc = await geocodePostcode(pc, countryCode);
      if (!loc) {
        setError('Could not geocode that postcode.');
        setLoading(false);
        return;
      }

      const result = await detectAll(loc.lat, loc.lon, pc, null);
      if (result) {
        setData(result);
      } else {
        setError('Could not fetch weather for that location.');
      }
    } catch (e: unknown) {
      setError(getErrorMessage(e) || 'Postcode lookup failed.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    detect();
  }, [detect]);

  return { data, loading, error, detect, refineWithPostcode, postcode };
}
