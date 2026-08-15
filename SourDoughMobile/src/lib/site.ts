/**
 * Site identity used by SEO/OG metadata and the PWA manifest.
 *
 * SITE_URL defaults to the Cloudflare Pages project URL. Set
 * EXPO_PUBLIC_SITE_URL in the deploy environment (e.g. GitHub Actions
 * repository variable) if the app is served from a custom domain.
 */
export const SITE_URL = process.env.EXPO_PUBLIC_SITE_URL || 'https://sourdough-19o.pages.dev';
export const SITE_NAME = 'Just Dough It';
export const SITE_DESCRIPTION =
  'Location-aware sourdough, yogurt and lacto-fermentation calculators — private by design, no accounts, no tracking.';
