import type { Dismissal } from "./dismissal";

export type MatchTeam = {
  id: string;
  name: string;
  logo?: string;
  score: number | null;
  redCards: number;
};

export type LiveMatch = {
  id: string;
  competition: { id: string; name: string; country?: string; logo?: string };
  status: string;
  minute?: number;
  addedTime?: number;
  home: MatchTeam;
  away: MatchTeam;
  dismissals: Dismissal[];
  updatedAt: string;
};

export type LiveSnapshot = {
  matches: LiveMatch[];
  provider: string;
  lastSuccessfulPoll: string | null;
  lastAttemptAt: string | null;
  error: string | null;
  staleAfterMs: number;
  pollIntervalMs: number;
  nextPollAt: string;
};

export function hasDismissals(match: LiveMatch): boolean {
  return match.dismissals.length > 0;
}
