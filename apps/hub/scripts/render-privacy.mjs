// Builds privacy.html from privacy.template.html and the app's own policy,
// ../../SourDoughMobile/PRIVACY.md, so the page can never drift from the
// document the Play Store listing relies on. Run before the build and the tests.
import { readFileSync, writeFileSync } from 'node:fs';
import { marked } from 'marked';

const here = (p) => new URL(p, import.meta.url);
const template = readFileSync(here('../privacy.template.html'), 'utf8');
const md = readFileSync(here('../../../SourDoughMobile/PRIVACY.md'), 'utf8');

// The document's own title becomes the section heading (an h2 on this page), and the rest steps down a level.
const body = md.replace(/^# (.+)$/m, '## $1').replace(/^## (?!Privacy Policy)/gm, '### ');
const html = marked.parse(body, { gfm: true });

if (!template.includes('<!--APP_POLICY-->')) throw new Error('privacy.template.html lost its <!--APP_POLICY--> marker');
writeFileSync(here('../privacy.html'), template.replace('<!--APP_POLICY-->', html));
console.log('privacy.html rendered from PRIVACY.md');
