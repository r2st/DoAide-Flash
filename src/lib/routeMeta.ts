import type { Page } from './types';

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  h1: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageWidth: string;
  ogImageHeight: string;
  jsonLd: Record<string, unknown>;
}

const BASE = 'https://flash.doaide.com';
const OG_IMAGE = `${BASE}/og-image.png`;
const OG_IMAGE_WIDTH = '1200';
const OG_IMAGE_HEIGHT = '630';

const routes: Record<Page, RouteMeta> = {
  home: {
    path: '/',
    title: 'DoAide Flash — Free Online Flashcard Study Tool',
    description:
      'Create, study, and share flashcards for free. Spaced repetition, quiz mode, and 10+ pre-made decks for Indian students.',
    h1: 'Your Flashcards',
    canonical: `${BASE}/`,
    ogTitle: 'DoAide Flash — Free Online Flashcard Study Tool',
    ogDescription:
      'Create, study, and share flashcards for free. Spaced repetition, quiz mode, and 10+ pre-made decks.',
    ogImage: OG_IMAGE,
    ogImageWidth: OG_IMAGE_WIDTH,
    ogImageHeight: OG_IMAGE_HEIGHT,
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
  stats: {
    path: '/stats',
    title: 'Study Stats — DoAide Flash',
    description:
      'Track your flashcard study progress — cards studied, accuracy, streaks, and quiz scores.',
    h1: 'Your Stats',
    canonical: `${BASE}/stats`,
    ogTitle: 'Study Stats — DoAide Flash',
    ogDescription:
      'Track your flashcard study progress — cards studied, accuracy, streaks, and quiz scores.',
    ogImage: OG_IMAGE,
    ogImageWidth: OG_IMAGE_WIDTH,
    ogImageHeight: OG_IMAGE_HEIGHT,
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
  import: {
    path: '/import',
    title: 'Import & Export Flashcards — DoAide Flash',
    description:
      'Import flashcard decks from JSON or CSV files, or export your decks to share with others.',
    h1: 'Import & Export',
    canonical: `${BASE}/import`,
    ogTitle: 'Import & Export Flashcards — DoAide Flash',
    ogDescription:
      'Import flashcard decks from JSON or CSV files, or export your decks to share with others.',
    ogImage: OG_IMAGE,
    ogImageWidth: OG_IMAGE_WIDTH,
    ogImageHeight: OG_IMAGE_HEIGHT,
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
  deck: {
    path: '/deck',
    title: 'View Deck — DoAide Flash',
    description: 'Browse, add, edit, and share flashcards in your deck.',
    h1: 'Deck',
    canonical: `${BASE}/`,
    ogTitle: 'View Deck — DoAide Flash',
    ogDescription: 'Browse, add, edit, and share flashcards in your deck.',
    ogImage: OG_IMAGE,
    ogImageWidth: OG_IMAGE_WIDTH,
    ogImageHeight: OG_IMAGE_HEIGHT,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'View Deck — DoAide Flash',
      url: BASE,
      isPartOf: { '@type': 'WebApplication', name: 'DoAide Flash', url: BASE },
    },
  },
  study: {
    path: '/study',
    title: 'Study Mode — DoAide Flash',
    description:
      'Study flashcards with spaced repetition. Mark cards as known or unknown to optimise your learning.',
    h1: 'Study Mode',
    canonical: `${BASE}/`,
    ogTitle: 'Study Mode — DoAide Flash',
    ogDescription:
      'Study flashcards with spaced repetition. Mark cards as known or unknown to optimise your learning.',
    ogImage: OG_IMAGE,
    ogImageWidth: OG_IMAGE_WIDTH,
    ogImageHeight: OG_IMAGE_HEIGHT,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Study Mode — DoAide Flash',
      url: BASE,
      isPartOf: { '@type': 'WebApplication', name: 'DoAide Flash', url: BASE },
    },
  },
  quiz: {
    path: '/quiz',
    title: 'Quiz Mode — DoAide Flash',
    description:
      'Test your knowledge with multiple-choice quizzes generated from your flashcard decks.',
    h1: 'Quiz Mode',
    canonical: `${BASE}/`,
    ogTitle: 'Quiz Mode — DoAide Flash',
    ogDescription:
      'Test your knowledge with multiple-choice quizzes generated from your flashcard decks.',
    ogImage: OG_IMAGE,
    ogImageWidth: OG_IMAGE_WIDTH,
    ogImageHeight: OG_IMAGE_HEIGHT,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Quiz Mode — DoAide Flash',
      url: BASE,
      isPartOf: { '@type': 'WebApplication', name: 'DoAide Flash', url: BASE },
    },
  },
};

export function getRouteMeta(page: Page): RouteMeta {
  return routes[page];
}

/** All indexable routes (those with their own canonical). */
export function getIndexableRoutes(): RouteMeta[] {
  const seen = new Set<string>();
  return Object.values(routes).filter(r => {
    if (seen.has(r.canonical)) return false;
    seen.add(r.canonical);
    return true;
  });
}

/** Update the document <head> for the current route. */
export function applyRouteMeta(page: Page): void {
  const meta = getRouteMeta(page);

  document.title = meta.title;

  setMeta('name', 'description', meta.description);
  setLink('canonical', meta.canonical);

  setMeta('property', 'og:title', meta.ogTitle);
  setMeta('property', 'og:description', meta.ogDescription);
  setMeta('property', 'og:url', meta.canonical);
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:image', meta.ogImage);
  setMeta('property', 'og:image:width', meta.ogImageWidth);
  setMeta('property', 'og:image:height', meta.ogImageHeight);

  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', meta.ogTitle);
  setMeta('name', 'twitter:description', meta.ogDescription);
  setMeta('name', 'twitter:image', meta.ogImage);

  // Update JSON-LD
  let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(meta.jsonLd);
}

/* ---- helpers ---- */

function setMeta(attr: 'name' | 'property', key: string, value: string): void {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}

function setLink(rel: string, href: string): void {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}
