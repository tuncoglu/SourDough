import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * Custom root HTML for web/static export.
 *
 * Adds: PWA manifest, apple-touch icon, theme-color (light + dark),
 * Open Graph defaults, and — when EXPO_PUBLIC_CF_BEACON_TOKEN is set at
 * build time — the cookieless Cloudflare Web Analytics beacon.
 *
 * To enable analytics: add the token as a GitHub Actions repository
 * variable EXPO_PUBLIC_CF_BEACON_TOKEN (Cloudflare dashboard → Web
 * Analytics → your site → "JavaScript snippet").
 */
const beaconToken = process.env.EXPO_PUBLIC_CF_BEACON_TOKEN;

const responsiveBackground = `
body {
  background-color: #fff5ed;
}
@media (prefers-color-scheme: dark) {
  body { background-color: #1a1412; }
}`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />

        <meta name="theme-color" content="#954D28" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1A1412" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" type="image/png" href="/favicon.png" />

        {beaconToken ? (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: beaconToken })}
          />
        ) : null}
      </head>
      <body>{children}</body>
    </html>
  );
}
