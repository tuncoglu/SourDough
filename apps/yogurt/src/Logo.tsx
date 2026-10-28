/** The yogurt jar on the cream disc, the same drawing as the app icon. */
export function YogurtLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" aria-hidden="true">
      <circle cx="256" cy="256" r="224" fill="#f3e0be" />
      <rect x="196" y="176" width="120" height="28" rx="10" fill="#2b1d12" />
      <path d="M204 216H308L320 326Q322 346 302 346H210Q190 346 192 326Z" fill="#2b1d12" />
      <path d="M214 274C234 258 246 258 256 274S278 290 298 274" stroke="#f3e0be" strokeWidth="13" strokeLinecap="round" fill="none" />
    </svg>
  );
}
