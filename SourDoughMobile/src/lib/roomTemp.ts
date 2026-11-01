import type { UnitSystem } from '@sourdough/calc/models/types';
import { formatTemp } from '@sourdough/calc/lib/unitConversion';

/**
 * Which temperature the app treats as the kitchen's, and where it came from.
 *
 * One rule for every screen that needs "the room": the kitchen temperature set in
 * Settings, otherwise today's outdoor reading from the location (a kitchen is usually
 * warmer, and the screen says so), otherwise 22 °C. The source is returned with the
 * value so nothing has to present an outdoor reading or a default as a measurement of
 * the kitchen. Pure; the hooks and screens call it.
 */

/** Used only when there is neither a Settings value nor an outdoor reading. */
export const DEFAULT_ROOM_TEMP_C = 22;

export type RoomTempSource = 'settings' | 'outdoor' | 'default';

export interface RoomTempChoice {
  tempC: number;
  source: RoomTempSource;
}

const isNumber = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);

export function chooseRoomTemp(
  settingsTempC: number | null | undefined,
  outdoorTempC: number | null | undefined,
): RoomTempChoice {
  if (isNumber(settingsTempC) && settingsTempC > 0) return { tempC: settingsTempC, source: 'settings' };
  if (isNumber(outdoorTempC)) return { tempC: outdoorTempC, source: 'outdoor' };
  return { tempC: DEFAULT_ROOM_TEMP_C, source: 'default' };
}

export interface RoomTempDescription {
  /** Short tag beside the field, or null for none. Never "auto". */
  badge: string | null;
  /** A line under the field, or null for none. */
  note: string | null;
}

/** What to tell the user about a room temperature. `typed` is a value the user entered. */
export function describeRoomTemp(
  source: RoomTempSource | 'typed',
  unitSystem: UnitSystem = 'metric',
): RoomTempDescription {
  switch (source) {
    case 'settings':
      return { badge: 'from Settings', note: null };
    case 'outdoor':
      return {
        badge: 'outdoor',
        note: 'This is the outdoor temperature. Type your kitchen temperature, or set it in Settings, if it differs.',
      };
    case 'default':
      return {
        badge: null,
        note: `No outdoor temperature available, so ${formatTemp(DEFAULT_ROOM_TEMP_C, unitSystem, 0)} is assumed. Type your kitchen temperature, or set it in Settings.`,
      };
    case 'typed':
      return { badge: null, note: null };
  }
}
