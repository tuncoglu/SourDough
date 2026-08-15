import Head from 'expo-router/head';
import { SITE_URL, SITE_NAME } from '../lib/site';

interface SeoProps {
  title: string;
  description: string;
  /** URL path for the canonical/og:url tags, e.g. "/bread". */
  path?: string;
}

/**
 * Per-route <head> metadata for web and static export (no-op on native).
 * Renders title, description, canonical, Open Graph and Twitter card tags
 * so links shared on social media show a proper preview card.
 */
export function Seo({ title, description, path = '' }: SeoProps) {
  const url = SITE_URL + path;
  const image = SITE_URL + '/og.png';
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
}
