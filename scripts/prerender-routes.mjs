#!/usr/bin/env node
/**
 * prerender-routes.mjs
 *
 * Generates static HTML shells for each indexable route so that search-engine
 * crawlers that don't execute JavaScript still see unique <title>, <meta>,
 * <link rel="canonical">, Open Graph tags, and JSON-LD per page.
 *
 * Run after `vite build`:
 *   node scripts/prerender-routes.mjs
 *
 * It reads dist/index.html (the SPA shell), swaps in route-specific meta, and
 * writes e.g. dist/stats/index.html, dist/import/index.html.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

const BASE = 'https://flash.doaide.com';
const OG_IMAGE = `${BASE}/og-image.png`;

/** Route definitions — must stay in sync with src/lib/routeMeta.ts. */
const routes = [
  {
    path: '/',
    title: 'DoAide Flash — Free Online Flashcard Study Tool',
    description:
      'Create, study, and share flashcards for free. Spaced repetition, quiz mode, and 10+ pre-made decks for Indian students.',
    canonical: `${BASE}/`,
    ogTitle: 'DoAide Flash — Free Online Flashcard Study Tool',
    ogDescription:
      'Create, study, and share flashcards for free. Spaced repetition, quiz mode, and 10+ pre-made decks.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'DoAide Flash',
      url: BASE,
      description:
        'Create, study, and share flashcards for free. Spaced repetition, quiz mode, and 10+ pre-made decks.',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      author: { '@type': 'Organization', name: 'DoAide', url: 'https://doaide.com' },
    },
  },
  {
    path: '/stats',
    title: 'Study Stats — DoAide Flash',
    description:
      'Track your flashcard study progress — cards studied, accuracy, streaks, and quiz scores.',
    canonical: `${BASE}/stats`,
    ogTitle: 'Study Stats — DoAide Flash',
    ogDescription:
      'Track your flashcard study progress — cards studied, accuracy, streaks, and quiz scores.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Study Stats — DoAide Flash',
      url: `${BASE}/stats`,
      description:
        'Track your flashcard study progress — cards studied, accuracy, streaks, and quiz scores.',
      isPartOf: { '@type': 'WebApplication', name: 'DoAide Flash', url: BASE },
    },
  },
  {
    path: '/import',
    title: 'Import & Export Flashcards — DoAide Flash',
    description:
      'Import flashcard decks from JSON or CSV files, or export your decks to share with others.',
    canonical: `${BASE}/import`,
    ogTitle: 'Import & Export Flashcards — DoAide Flash',
    ogDescription:
      'Import flashcard decks from JSON or CSV files, or export your decks to share with others.',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Import & Export Flashcards — DoAide Flash',
      url: `${BASE}/import`,
      description:
        'Import flashcard decks from JSON or CSV files, or export your decks to share with others.',
      isPartOf: { '@type': 'WebApplication', name: 'DoAide Flash', url: BASE },
    },
  },
];

function run() {
  const shellPath = join(DIST, 'index.html');
  if (!existsSync(shellPath)) {
    console.error('dist/index.html not found — run `vite build` first.');
    process.exit(1);
  }
  const shell = readFileSync(shellPath, 'utf-8');

  for (const route of routes) {
    let html = shell;

    // Replace <title>
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`);

    // Replace meta description
    html = html.replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${route.description}"`,
    );

    // Replace canonical
    html = html.replace(
      /<link rel="canonical" href="[^"]*"/,
      `<link rel="canonical" href="${route.canonical}"`,
    );

    // Replace og:title
    html = html.replace(
      /<meta property="og:title" content="[^"]*"/,
      `<meta property="og:title" content="${route.ogTitle}"`,
    );

    // Replace og:description
    html = html.replace(
      /<meta property="og:description" content="[^"]*"/,
      `<meta property="og:description" content="${route.ogDescription}"`,
    );

    // Replace og:url
    html = html.replace(
      /<meta property="og:url" content="[^"]*"/,
      `<meta property="og:url" content="${route.canonical}"`,
    );

    // Replace twitter:title
    html = html.replace(
      /<meta name="twitter:title" content="[^"]*"/,
      `<meta name="twitter:title" content="${route.ogTitle}"`,
    );

    // Replace twitter:description
    html = html.replace(
      /<meta name="twitter:description" content="[^"]*"/,
      `<meta name="twitter:description" content="${route.ogDescription}"`,
    );

    // Replace JSON-LD
    html = html.replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script type="application/ld+json">\n    ${JSON.stringify(route.jsonLd, null, 2).replace(/\n/g, '\n    ')}\n    </script>`,
    );

    // Write
    if (route.path === '/') {
      writeFileSync(shellPath, html, 'utf-8');
      console.log(`  ✓ / → dist/index.html`);
    } else {
      const dir = join(DIST, route.path);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'index.html'), html, 'utf-8');
      console.log(`  ✓ ${route.path} → dist${route.path}/index.html`);
    }
  }

  console.log(`\nPrerendered ${routes.length} routes.`);
}

run();
