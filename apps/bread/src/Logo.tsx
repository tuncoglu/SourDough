/** The scored loaf on the cream disc, the same drawing as the app icon. */
export function BreadLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" aria-hidden="true">
      <circle cx="256" cy="256" r="224" fill="#f3e0be" />
      <path d="M150 318V272C150 220 196 186 256 186C316 186 362 220 362 272V318Z" fill="#2b1d12" />
      <path d="M208 264L228 232M250 264L270 232M292 264L312 232" stroke="#f3e0be" strokeWidth="14" strokeLinecap="round" fill="none" />
    </svg>
  );
}
