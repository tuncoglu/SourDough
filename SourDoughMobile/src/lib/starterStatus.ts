/**
 * Starter readiness model accounting for fridge storage.
 *
 * Real-world workflow:
 *   1. Feed starter → sits on counter, activates over 4–8h
 *   2. Into fridge → metabolism slows ~10× at 4°C (Q10 model)
 *   3. Out of fridge → needs ~3h warmup to reach full activity again
 *   4. At peak → use in recipe, then feed and repeat
 */
import { StarterFeeding, StarterStatus } from '../models/types';

/** Fridge temperature for the metabolic slowdown model. */
const FRIDGE_TEMP = 4;

/** Q10 coefficient — rate change per 10°C. */
const Q10 = 2.5;

/** Reference counter temperature. */
const COUNTER_TEMP = 22;

/** How much metabolic activity slows in the fridge vs counter. */
const FRIDGE_RATE = Math.pow(Q10, (FRIDGE_TEMP - COUNTER_TEMP) / 10); // ≈ 0.05

/** Hours after coming out of fridge before starter reaches full activity. */
const FRIDGE_WARMUP_HOURS = 3;

export function computeStarterStatus(lastFeeding: StarterFeeding | null): StarterStatus | null {
  if (!lastFeeding) return null;

  const now = Date.now();
  const fedAt = new Date(lastFeeding.timestamp).getTime();
  const hoursSinceFed = (now - fedAt) / 3600000;

  // Determine fridge state
  const fridgeAt = lastFeeding.fridgeAt ? new Date(lastFeeding.fridgeAt).getTime() : null;
  const outOfFridgeAt = lastFeeding.outOfFridgeAt ? new Date(lastFeeding.outOfFridgeAt).getTime() : null;

  // Is the starter currently in the fridge?
  // It's in the fridge if fridgeAt is set and outOfFridgeAt is either unset or earlier than fridgeAt
  const isInFridge = fridgeAt !== null && (outOfFridgeAt === null || outOfFridgeAt < fridgeAt);

  // Effective hours: counter time counts 1:1, fridge time counts FRIDGE_RATE
  let effectiveHours = 0;
  let hoursSinceFridgeOut = 0;

  if (fridgeAt && outOfFridgeAt) {
    // Fed → counter → fridge → out → now
    const counterBeforeFridge = Math.max(0, (fridgeAt - fedAt) / 3600000);
    const fridgeTime = Math.max(0, (outOfFridgeAt - fridgeAt) / 3600000);
    const counterAfterFridge = Math.max(0, (now - outOfFridgeAt) / 3600000);

    effectiveHours = counterBeforeFridge + fridgeTime * FRIDGE_RATE + counterAfterFridge;
    hoursSinceFridgeOut = counterAfterFridge;
  } else if (fridgeAt && !outOfFridgeAt) {
    // Fed → counter → fridge (still there)
    const counterBeforeFridge = Math.max(0, (fridgeAt - fedAt) / 3600000);
    const fridgeTime = Math.max(0, (now - fridgeAt) / 3600000);

    effectiveHours = counterBeforeFridge + fridgeTime * FRIDGE_RATE;
    hoursSinceFridgeOut = 0;
  } else {
    // Fed → counter (never fridged)
    effectiveHours = hoursSinceFed;
    hoursSinceFridgeOut = 0;
  }

  // Determine zone based on effective hours
  const zone = getZone(effectiveHours, isInFridge, hoursSinceFridgeOut);
  const { emoji, label, color } = ZONE_INFO[zone];

  return {
    hoursSinceFed: Math.round(hoursSinceFed * 10) / 10,
    effectiveHours: Math.round(effectiveHours * 10) / 10,
    isInFridge,
    hoursSinceFridgeOut: Math.round(hoursSinceFridgeOut * 10) / 10,
    zone,
    emoji,
    label,
    color,
  };
}

type Zone = StarterStatus['zone'];

function getZone(effectiveHours: number, isInFridge: boolean, hoursSinceFridgeOut: number): Zone {
  if (isInFridge) return 'dormant';

  // Just came out of fridge — still warming up
  if (hoursSinceFridgeOut > 0 && hoursSinceFridgeOut < FRIDGE_WARMUP_HOURS) {
    return 'building';
  }

  // Standard counter-based zones
  if (effectiveHours <= 4) return 'just-fed';
  if (effectiveHours <= 8) return 'peak';
  if (effectiveHours <= 14) return 'past-peak';
  if (effectiveHours <= 24) return 'hungry';
  return 'hungry';
}

const ZONE_INFO: Record<Zone, { emoji: string; label: string; color?: string }> = {
  'just-fed': { emoji: '🌱', label: 'Just fed — building strength' },
  'building': { emoji: '🌤️', label: 'Warming up from fridge — nearly ready' },
  'peak': { emoji: '🟢', label: 'At peak activity — great time to bake!', color: '#4A672F' },
  'past-peak': { emoji: '🟡', label: 'Still active but past peak' },
  'hungry': { emoji: '🔴', label: 'Hungry — time to feed!', color: '#9E3528' },
  'dormant': { emoji: '❄️', label: 'Dormant in fridge — preserved', color: '#356EAD' },
};
