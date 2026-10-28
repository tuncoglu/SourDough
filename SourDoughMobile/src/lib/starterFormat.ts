/** Small display helpers for the starter screens. Pure; locale-aware where it matters. */

export const clockTime = (d: Date): string =>
  d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const shortDay = (d: Date): string =>
  d.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });

/** "Mon 26 Oct, 08:10" */
export const dayAndTime = (iso: string): string => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '—' : `${shortDay(d)}, ${clockTime(d)}`;
};

/** "52 h", "7.2 h", "20 min", "3 days" — how long, in the units that read best. */
export function hoursLabel(hours: number): string {
  if (!Number.isFinite(hours) || hours < 0) return '—';
  if (hours === 0) return '0 h';
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} min`;
  if (hours < 48) return `${Math.round(hours * 10) / 10} h`;
  return `${Math.round(hours / 24)} days`;
}

/** "7 h 32 min" for a span between two instants. */
export function spanLabel(fromIso: string, toIso: string): string {
  const ms = new Date(toIso).getTime() - new Date(fromIso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return '—';
  const minutes = Math.round(ms / 60000);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h} h ${m} min` : `${m} min`;
}
