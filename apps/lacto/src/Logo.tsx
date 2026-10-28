/** The ferment jar with bubbles on the cream disc, the same drawing as the app icon. */
export function LactoLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" aria-hidden="true">
      <circle cx="256" cy="256" r="224" fill="#f3e0be" />
      <rect x="216" y="166" width="80" height="28" rx="8" fill="#2b1d12" />
      <path d="M208 204H304Q332 206 332 238V328Q332 348 312 348H200Q180 348 180 328V238Q180 206 208 204Z" fill="#2b1d12" />
      <circle cx="230" cy="298" r="15" fill="#f3e0be" />
      <circle cx="286" cy="262" r="11" fill="#f3e0be" />
      <circle cx="280" cy="314" r="19" fill="#f3e0be" />
    </svg>
  );
}
