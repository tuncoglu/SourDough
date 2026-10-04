import type { LiveMatch } from "@/domain/match";
import { LiveMatchCard } from "./live-match-card";

export function LiveMatchList({ matches, redOnly, loading = false, unavailable = false, fixtureFiltered = false, catalogueUnavailable = false }: { matches: LiveMatch[]; redOnly: boolean; loading?: boolean; unavailable?: boolean; fixtureFiltered?: boolean; catalogueUnavailable?: boolean }) {
  if (loading) return <div className="empty-state" role="status"><span className="empty-card" aria-hidden="true">🟥</span><p>Checking live matches…</p></div>;
  if (catalogueUnavailable) return <div className="empty-state" role="status"><span className="empty-card" aria-hidden="true">🟥</span><p>Waiting for İddaa fixture listings.</p><span>The full match view is still available.</span></div>;
  if (unavailable && matches.length === 0) return <div className="empty-state" role="status"><span className="empty-card" aria-hidden="true">🟥</span><p>Live matches are temporarily unavailable.</p><span>We’ll reconnect automatically.</span></div>;
  if (!matches.length) return <div className="empty-state" role="status"><span className="empty-card" aria-hidden="true">🟥</span><p>{fixtureFiltered ? redOnly ? "No red cards in matched İddaa fixtures right now." : "No live matches matched to İddaa right now." : redOnly ? "No red cards in live matches right now." : "No football matches are live right now."}</p><span>{fixtureFiltered ? "Listings may differ between football feeds." : "We’re keeping an eye on the pitch."}</span></div>;
  return <div className="match-grid">{matches.map(match => <LiveMatchCard match={match} key={match.id} />)}</div>;
}
