import { useEffect, useState } from "react";
import { hasDismissals, type LiveSnapshot } from "@/domain/match";
import { LiveMatchList } from "./live-match-list";
import { StatusHeader } from "./status-header";

type Connection = "connecting" | "live" | "reconnecting" | "offline";

export function LiveMonitor() {
  const [snapshot, setSnapshot] = useState<LiveSnapshot | null>(null);
  const [redOnly, setRedOnly] = useState(true);
  const [connection, setConnection] = useState<Connection>("connecting");
  const [failed, setFailed] = useState(false);
  const [now, setNow] = useState(0);
  const [light, setLight] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem("redcard-theme"); } catch { /* Storage may be disabled. */ }
    const isLight = saved ? saved === "light" : window.matchMedia("(prefers-color-scheme: light)").matches;
    setLight(isLight);
    document.documentElement.dataset.theme = isLight ? "light" : "dark";
    if ("serviceWorker" in navigator && import.meta.env.PROD) {
      void navigator.serviceWorker.register("/redcard-7c4f/sw.js", { scope: "/redcard-7c4f/" }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const abort = new AbortController();
    let busy = false;
    async function refresh() {
      if (busy || abort.signal.aborted) return;
      if (!navigator.onLine) { setConnection("offline"); return; }
      busy = true;
      try {
        const response = await fetch("/redcard-7c4f/api/live", { cache: "no-store", signal: abort.signal });
        if (!response.ok) throw new Error("Live state unavailable");
        const next = await response.json() as LiveSnapshot;
        if (!Array.isArray(next.matches)) throw new Error("Invalid live state");
        if (abort.signal.aborted) return;
        setSnapshot(next);
        setFailed(false);
        setNow(Date.now());
        setConnection("live");
      } catch {
        if (!abort.signal.aborted) { setFailed(true); setConnection(navigator.onLine ? "reconnecting" : "offline"); }
      } finally { busy = false; }
    }
    const offline = () => setConnection("offline");
    const online = () => { setConnection("reconnecting"); void refresh(); };
    window.addEventListener("offline", offline);
    window.addEventListener("online", online);
    setNow(Date.now());
    const clock = window.setInterval(() => setNow(Date.now()), 5000);
    // Cached state only: browser requests never bypass the shared upstream budget.
    const poll = window.setInterval(() => { if (!document.hidden) void refresh(); }, 10_000);
    const visible = () => { if (!document.hidden) void refresh(); };
    document.addEventListener("visibilitychange", visible);
    void refresh();
    return () => {
      abort.abort(); window.clearInterval(clock); window.clearInterval(poll);
      window.removeEventListener("offline", offline); window.removeEventListener("online", online);
      document.removeEventListener("visibilitychange", visible);
    };
  }, []);

  function toggleTheme() {
    const next = !light;
    setLight(next);
    document.documentElement.dataset.theme = next ? "light" : "dark";
    try { localStorage.setItem("redcard-theme", next ? "light" : "dark"); } catch { /* Optional preference only. */ }
  }

  const matches = snapshot?.matches ?? [];
  const redMatches = matches.filter(hasDismissals);
  const dismissals = redMatches.reduce((total, match) => total + match.dismissals.length, 0);
  const stale = Boolean(snapshot?.lastSuccessfulPoll && now - Date.parse(snapshot.lastSuccessfulPoll) > snapshot.staleAfterMs);
  const providerFailed = Boolean(snapshot?.error) || (snapshot !== null && !snapshot.lastSuccessfulPoll);
  const status = connection === "offline" ? "Offline" : failed || providerFailed || stale ? "Delayed" : connection === "live" ? "Connected" : connection === "reconnecting" ? "Reconnecting" : "Connecting";
  const elapsed = snapshot?.lastSuccessfulPoll ? Math.max(0, Math.floor((now - Date.parse(snapshot.lastSuccessfulPoll)) / 1000)) : null;
  const updated = elapsed === null ? "Waiting for live data" : elapsed < 5 ? "Updated just now" : elapsed < 60 ? `Updated ${elapsed}s ago` : `Updated ${Math.floor(elapsed / 60)}m ago`;

  return <>
    <StatusHeader status={status} demo={snapshot?.provider === "mock"} light={light} onThemeChange={toggleTheme} />
    <main id="main-content" className="monitor">
      <div className="page-intro"><div><p className="eyebrow">FOOTBALL · IN PLAY</p><h1>Live dismissals.</h1><p className="intro-description">Men’s and women’s football. Live matches with a player sent off.</p></div><div className="summary" aria-label={`${redMatches.length} matches with ${dismissals} dismissals`}><div><b>{snapshot ? redMatches.length : "–"}</b><span>matches</span></div><span className="summary-divider" /><div><b className="red-number">{snapshot ? dismissals : "–"}</b><span>dismissals</span></div></div></div>
      <div className="view-bar"><div className="view-toggle" aria-label="Match view"><button className={redOnly ? "active" : ""} onClick={() => setRedOnly(true)} aria-pressed={redOnly}>Red cards<span className="tab-count">{redMatches.length}</span></button><button className={!redOnly ? "active" : ""} onClick={() => setRedOnly(false)} aria-pressed={!redOnly}>All live</button></div><span className="updated-at">{updated}</span></div>
      <p className="demo-notice">{snapshot?.pollIntervalMs ? `Provider updates every ${snapshot.pollIntervalMs >= 60_000 ? `${Math.round(snapshot.pollIntervalMs / 60_000)} minutes` : `${Math.round(snapshot.pollIntervalMs / 1000)} seconds`}. Matches may have changed since the last update.` : "Checking the football provider…"}</p>
      {snapshot?.provider === "mock" && <p className="demo-notice"><span className="demo-notice-icon" aria-hidden="true">◈</span> Demo matches · Scores and dismissals are simulated.</p>}
      {(providerFailed || stale || failed || connection === "offline" || connection === "reconnecting") && <p className="data-notice" role="status">{connection === "offline" ? "You’re offline." : providerFailed ? "The football provider is temporarily unavailable." : stale ? "Match data is delayed." : "Reconnecting to match data."} {snapshot?.lastSuccessfulPoll ? "Showing the last successful update; these matches may have finished." : "We’ll try again automatically."}</p>}
      <LiveMatchList matches={redOnly ? redMatches : matches} redOnly={redOnly} loading={!snapshot && !failed} unavailable={failed || providerFailed} />
      <footer className="monitor-footer"><span><span className="footer-card" aria-hidden="true">🟥</span> Straight red<span className="footer-second" aria-hidden="true">🟨🟥</span> Second yellow</span><span>Live matches. Red cards only.</span></footer>
    </main>
  </>;
}
