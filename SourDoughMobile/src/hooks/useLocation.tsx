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
import { PermissionsAndroid, Platform } from 'react-native';
import { requireOptionalNativeModule } from 'expo-modules-core';
import type * as ExpoLocationType from 'expo-location';
import { LocationData, detectAll } from '../lib/location';
import { geocodePostcode } from '../lib/api';
import { getErrorMessage } from '../lib/errors';
import { useAppTheme } from '../theme';

interface GeoPosition {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number | null;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

// Expo modules are not exposed through RN's `NativeModules` proxy on the new
// architecture — resolve through the Expo module registry instead.
const SourdoughLocation = requireOptionalNativeModule<{
  getCurrentPositionAsync: () => Promise<GeoPosition>;
}>('SourdoughLocation');

function getExpoLocation(): typeof ExpoLocationType | null {
  if (Platform.OS === 'android') {
    // expo-location is intentionally excluded from the Android build for F-Droid.
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('expo-location') as typeof ExpoLocationType;
}

/** Good enough for weather & water-hardness lookups (street/neighbourhood level). */
const GOOD_ACCURACY_M = 5_000;
/** Max time to keep watching for a better fix before settling for the best one seen. */
const MAX_WAIT_MS = 10_000;

/**
 * Web geolocation via the browser API.
 *
 * Desktop browsers (no GPS) typically answer instantly with a coarse
 * IP-based fix — e.g. "Greater London" for anywhere in the capital — and
 * only refine to WiFi triangulation a few seconds later. A single
 * `getCurrentPosition` call (what expo-location does on web, with
 * `enableHighAccuracy` off at `Accuracy.Low`) therefore never sees the good
 * fix. `watchPosition` with high accuracy keeps receiving updates, so we
 * take the best fix inside a short window, or bail out early on a good one.
 */
function getWebPosition(): Promise<GeoPosition> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    let best: GeoPosition | null = null;
    let settled = false;
    let watchId = -1;

    const finish = (pos: GeoPosition) => {
      if (settled) return;
      settled = true;
      navigator.geolocation.clearWatch(watchId);
      resolve(pos);
    };

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const accuracy = pos.coords.accuracy ?? Number.POSITIVE_INFINITY;
        if (!best || accuracy < (best.coords.accuracy ?? Number.POSITIVE_INFINITY)) {
          best = {
            coords: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy,
              altitude: pos.coords.altitude ?? null,
              altitudeAccuracy: pos.coords.altitudeAccuracy ?? null,
              heading: pos.coords.heading ?? null,
              speed: pos.coords.speed ?? null,
            },
            timestamp: pos.timestamp,
          };
        }
        if (accuracy <= GOOD_ACCURACY_M) finish(best as GeoPosition);
      },
      (err) => {
        if (best) {
          finish(best); // we have something usable — prefer it over the error
          return;
        }
        settled = true;
        reject(err);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: MAX_WAIT_MS },
    );

    // Safety net: settle with the best fix seen even if none hit the
    // accuracy target (or fail outright if nothing arrived at all).
    setTimeout(() => {
      if (best) {
        finish(best);
      } else if (!settled) {
        settled = true;
        navigator.geolocation.clearWatch(watchId);
        reject(new Error('Location request timed out.'));
      }
    }, MAX_WAIT_MS + 500);
  });
}

function getCurrentPosition(): Promise<GeoPosition> {
  if (Platform.OS === 'web') {
    return getWebPosition();
  }

  if (Platform.OS === 'android') {
    if (!SourdoughLocation?.getCurrentPositionAsync) {
      return Promise.reject(new Error('Degoogled location module is not available.'));
    }
    return SourdoughLocation.getCurrentPositionAsync() as Promise<GeoPosition>;
  }

  const ExpoLocation = getExpoLocation();
  if (!ExpoLocation) {
    return Promise.reject(new Error('Location module is not available.'));
  }

  return ExpoLocation.getCurrentPositionAsync({
    accuracy: ExpoLocation.Accuracy.Low,
  });
}

async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') {
    // The browser will show its own permission prompt when getCurrentPosition is called.
    return true;
  }

  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location access',
          message:
            'Just Dough It uses your location to detect local temperature and water hardness for accurate baking guidance.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  }

  const ExpoLocation = getExpoLocation();
  if (!ExpoLocation) {
    return false;
  }

  const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
  return status === 'granted';
}

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
      const granted = await requestLocationPermission();
      if (!granted) {
        if (requestId === requestIdRef.current) {
          setError('Location permission denied. Enter temps manually.');
          setLoading(false);
        }
        return;
      }

      const pos = await getCurrentPosition();

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
