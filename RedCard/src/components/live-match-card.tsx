import type { LiveMatch, MatchTeam } from "@/domain/match";

export function formatMinute(minute?: number, addedTime?: number): string {
  return minute === undefined ? "" : `${minute}${addedTime ? `+${addedTime}` : ""}′`;
}

function TeamRow({ team }: { team: MatchTeam }) {
  return <div className="team-row">
    <span className="team-initial" aria-hidden="true">{team.name.slice(0, 3).toUpperCase()}</span>
    <span className="team-name">{team.name}</span>
    {team.redCards > 0 && <span className="team-cards" aria-label={`${team.redCards} ${team.redCards === 1 ? "dismissal" : "dismissals"}`}><span aria-hidden="true">🟥</span>{team.redCards > 1 && <b>×{team.redCards}</b>}</span>}
    <span className="score" aria-label={team.score === null ? "Score unavailable" : `${team.score} goals`}>{team.score ?? "–"}</span>
  </div>;
}

export function LiveMatchCard({ match }: { match: LiveMatch }) {
  return <article className={`match-card ${match.dismissals.length ? "has-red" : ""}`} aria-label={`${match.home.name} versus ${match.away.name}`}>
    <div className="match-meta"><div className="competition"><span>{match.competition.name}</span>{match.competition.country && <span className="country">{match.competition.country}</span>}</div><span className="match-time">{["First half", "Second half", "Extra time", "Live"].includes(match.status) ? formatMinute(match.minute, match.addedTime) || match.status : match.status}</span></div>
    <div className="teams"><TeamRow team={match.home} /><TeamRow team={match.away} /></div>
    <div className="dismissals">
      {match.dismissals.map(dismissal => <div className="dismissal" key={dismissal.id}>
        <span className="card-symbol" aria-label={dismissal.type === "straight-red" ? "Straight red" : "Second yellow"}>{dismissal.type === "straight-red" ? "🟥" : "🟨🟥"}</span>
        <span className="dismissal-minute">{formatMinute(dismissal.minute, dismissal.addedTime)}</span>
        <div className="dismissal-detail"><span className="player-name">{dismissal.playerName || "Unknown player"}</span><span className="dismissal-type">{dismissal.type === "straight-red" ? "Straight red" : "Second yellow"}<span className="detail-separator"> · </span>{dismissal.teamId === match.home.id ? match.home.name : match.away.name}</span></div>
      </div>)}
      {!match.dismissals.length && <p className="no-dismissals">No dismissals</p>}
    </div>
    {match.minute !== undefined && <span className="sr-only">{match.status}</span>}
  </article>;
}
