/**
 * App-wide shared location state.
 *
 * All three calculator tabs (bread, yogurt, lacto-fermentation) need the
 * same location slice, and expo-router keeps every tab mounted — so a
 * per-hook `useLocation` ran the full detection pipeline (GPS fix, reverse
 * geocode, weather fetch, water-hardness lookup) three times in parallel at
 * app launch. The provider sits above the tab navigator in `_layout.tsx`
 * and runs detection once; every consumer subscribes to the same state.
 *
 * Postcode refinement is shared too: submitting a postcode on any tab
 * updates the location for the whole app.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as ExpoLocation from 'expo-location';
import { LocationData, detectAll } from '../lib/location';
import { geocodePostcode } from '../lib/api';
import { getErrorMessage } from '../lib/errors';
import { useAppTheme } from '../theme';

export interface LocationState {
  locationData: LocationData | null;
  locLoading: boolean;
  locError: string | null;
  onRefreshLocation: () => void;
  onPostcodeSubmit: (postcode: string) => void;
}

const LocationContext = createContext<LocationState | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const { unitSystem } = useAppTheme();
  const [data, setData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [postcode, setPostcode] = useState<string>('');

  // Refs to avoid rebuilding detect() when postcode or unitSystem change
  const postcodeRef = useRef(postcode);
  postcodeRef.current = postcode;
  const unitSystemRef = useRef(unitSystem);
  unitSystemRef.current = unitSystem;

  // Monotonic request id — a slow GPS/weather response must not clobber a
  // newer postcode refinement (or vice versa).
  const requestIdRef = useRef(0);

  const detect = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        if (requestId === requestIdRef.current) {
          setError('Location permission denied. Enter temps manually.');
          setLoading(false);
        }
        return;
      }

      const pos = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Low,
      });

      const result = await detectAll(
        pos.coords.latitude,
        pos.coords.longitude,
        postcodeRef.current || undefined,
        null,
        unitSystemRef.current,
      );

      if (requestId !== requestIdRef.current) return; // stale — ignore

      if (result) {
        setData(result);
      } else {
        setError('Could not resolve location. Enter temps manually.');
      }
    } catch (e: unknown) {
      if (requestId === requestIdRef.current) {
        setError(getErrorMessage(e) || 'Location detection failed.');
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const refineWithPostcode = useCallback(async (pc: string, countryCode: string = '') => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    setPostcode(pc);
    try {
      const loc = await geocodePostcode(pc, countryCode);
      if (requestId !== requestIdRef.current) return;
      if (!loc) {
        setError('Could not geocode that postcode.');
        setLoading(false);
        return;
      }

      const result = await detectAll(loc.lat, loc.lon, pc, null, unitSystemRef.current);
      if (requestId !== requestIdRef.current) return;

      if (result) {
        setData(result);
      } else {
        setError('Could not fetch weather for that location.');
      }
    } catch (e: unknown) {
      if (requestId === requestIdRef.current) {
        setError(getErrorMessage(e) || 'Postcode lookup failed.');
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Detect once on mount — shared by every consumer below the provider.
  useEffect(() => {
    detect();
  }, [detect]);

  const value = useMemo<LocationState>(
    () => ({
      locationData: data,
      locLoading: loading,
      locError: error,
      onRefreshLocation: detect,
      onPostcodeSubmit: refineWithPostcode,
    }),
    [data, loading, error, detect, refineWithPostcode],
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation(): LocationState {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
}
