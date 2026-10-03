export type DismissalType = "straight-red" | "second-yellow";

export type Dismissal = {
  id: string;
  teamId: string;
  playerId?: string;
  playerName?: string;
  minute: number;
  addedTime?: number;
  type: DismissalType;
};

export type NewDismissalEvent = {
  matchId: string;
  dismissal: Dismissal;
  detectedAt: string;
};
