export function StatusHeader({ status, demo, light, onThemeChange }: { status: string; demo: boolean; light: boolean; onThemeChange: () => void }) {
  return <header className="site-header"><div className="header-inner">
    <a className="wordmark" href="/redcard-7c4f/" aria-label="RedCard.Live home"><span className="brand-card" aria-hidden="true" /><span>RedCard<span className="brand-live">.Live</span></span></a>
    <div className="header-actions">{demo && <span className="demo-tag">Demo</span>}<span className={`live-status ${status === "Connected" ? "connected" : ""}`} role="status"><span className="status-dot" />{status}</span><button type="button" className="theme-toggle" onClick={onThemeChange} aria-label={`Switch to ${light ? "dark" : "light"} mode`} title={`Switch to ${light ? "dark" : "light"} mode`}><span aria-hidden="true">{light ? "☾" : "☀"}</span></button></div>
  </div></header>;
}
