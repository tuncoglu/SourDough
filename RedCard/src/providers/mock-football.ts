import type { Dismissal } from "@/domain/dismissal";
import type { LiveMatch } from "@/domain/match";
import type { FootballProvider } from "./football-provider";

const card = (id: string, teamId: string, playerName: string, minute: number, type: Dismissal["type"] = "straight-red"): Dismissal =>
  ({ id, teamId, playerId: id, playerName, minute, type });

export function mockMatches(tick = 0, now = new Date()): LiveMatch[] {
  const match = (id: string, competition: string, country: string, home: string, away: string, score: [number | null, number | null], minute: number, dismissals: Dismissal[]): LiveMatch => ({
    id, competition: { id: competition, name: competition, country },
    status: "Second half", minute: Math.min(90, minute + tick),
    home: { id: `${id}-h`, name: home, score: score[0], redCards: dismissals.filter(d => d.teamId === `${id}-h`).length },
    away: { id: `${id}-a`, name: away, score: score[1], redCards: dismissals.filter(d => d.teamId === `${id}-a`).length },
    dismissals, updatedAt: now.toISOString(),
  });
  return [
    match("demo-1", "Premier League", "England", "Arsenal", "Chelsea", [1, 0], 72, [card("d1", "demo-1-h", "William Saliba", 68)]),
    match("demo-2", "La Liga", "Spain", "Sevilla", "Villarreal", [0, 1], 54, [card("d2", "demo-2-a", "Juan Foyth", 51, "second-yellow")]),
    match("demo-3", "Serie A", "Italy", "Roma", "Lazio", [2, 2], 83, [card("d3", "demo-3-a", "Alessio Romagnoli", 37), card("d4", "demo-3-a", "Mattéo Guendouzi", 79, "second-yellow")]),
    match("demo-4", "Bundesliga", "Germany", "Dortmund", "Leipzig", [1, 1], 65, [card("d5", "demo-4-h", "Emre Can", 42, "second-yellow"), card("d6", "demo-4-a", "Willi Orbán", 61)]),
    match("demo-5", "Ligue 1", "France", "Lyon", "Marseille", [0, 0], 48, tick >= 2 ? [card("d7", "demo-5-h", "Nicolás Tagliafico", 50)] : []),
    match("demo-6", "Women's Super League", "England", "Arsenal Women", "Chelsea Women", [0, 1], 61, [card("d8", "demo-6-h", "Demo player", 58, "second-yellow")]),
    match("demo-7", "NWSL Women", "USA", "Portland Thorns", "Orlando Pride", [1, 0], 78, [card("d9", "demo-7-a", "Demo player", 74)]),
  ];
}

/** A new dismissal appears on poll three. Later polls retain the same event IDs. */
export class MockFootballProvider implements FootballProvider {
  readonly name = "mock";
  private tick = 0;
  async getLiveMatches(): Promise<LiveMatch[]> {
    return mockMatches(this.tick++);
  }
}
