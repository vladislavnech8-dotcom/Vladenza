import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, getStaticBlogSlugs, supabase, blogPostsUk, casesUk } from '../dist-ssr/entry-server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');

// ─── Indexable route allowlist ───────────────────────────────────
// Only these routes appear in the sitemap and get hreflang.
const INDEXABLE_STATIC_ROUTES = [
  '/',
  '/services/guest-posting',
  '/services/niche-edits',
  '/services/crowd-links',
  '/services/white-label',
  '/placements',
  '/pricing',
  '/case-studies',
  '/blog',
];

// Retained blog articles (indexable)
const RETAINED_BLOG_SLUGS = [
  '5-facts-about-backlinks',
  'crowd-marketing-website-promotion',
  'geo-get-cited-by-chatgpt-2025',
  'igaming-seo-link-building-2025',
  'link-building-2026',
  'link-building-german-websites',
  'link-building-services-guide',
  'saas-link-building',
  'white-label-seo',
  'how-long-does-link-building-take',
  'niche-edits-vs-guest-posts',
  'how-to-analyze-competitor-backlinks',
];

// Blog articles that are noindex (accessible but excluded from sitemap)
const NOINDEX_BLOG_SLUGS = [
  'seo-redirects-guide',
  'backlink-quality-guide',
  'dofollow-vs-nofollow-links',
  'organic-seo-inbound-clients',
];

// Case studies with GSC signals (indexable)
const INDEXABLE_CASE_SLUGS = [
  'dating-5x-traffic',
  'saas-non-brand-traffic',
  'igaming-domain-authority',
  'crypto-page1-ranking',
  'health-google-update-recovery',
  'igaming-20k-traffic',
  'crypto-forum-x10-traffic',
];

// Case studies that need editorial verification (accessible but noindex)
const UNVERIFIED_CASE_SLUGS = [
  'automotive-keyword-rankings',
  'fintech-lead-generation',
  'health-organic-growth',
  'software-263-traffic',
];

// Crowd Marketing language pages to keep accessible (noindex for now — check uniqueness)
const CROWD_LINKS_LANGUAGES = ['german', 'french', 'spanish'];

// Routes that are accessible but noindex,follow (not in sitemap)
const NOINDEX_STATIC_ROUTES = [
  '/services/seo-audit',
  '/services/ai-llm',
  '/services/linkedin-personal',
  '/services/linkedin-company',
  '/services/local-seo-links',
  '/seo-audit-sample',
  '/sitemap',
  '/checkout',
  '/privacy-policy',
  '/terms',
  '/refund-policy',
  '/cookie-policy',
];

// Niche package pages (301 redirect in netlify.toml, not prerendered)
const RETIRED_NICHE_SLUGS = ['igaming', 'saas', 'auto', 'health', 'proxy', 'renovations'];

// Case study slugs that are redirected (reviews → case-studies)
const REDIRECTED_ROUTES = ['/reviews'];

const HOME_META = {
  title: 'Vladenza — Manual Link Building Services | Guest Posts, Link Insertions & Crowd Marketing',
  description: 'Manual link building with website approval, transparent reporting and ongoing link monitoring. Guest posts, link insertions and crowd marketing for brands and agencies.',
  canonical: 'https://vladenza.com/',
};

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function injectMeta(html, meta) {
  const title = escapeHtml(meta.title);
  const rawDesc = meta.description || '';
  const description = rawDesc.length > 158
    ? rawDesc.slice(0, 158).replace(/[\s,;.:.\u2013\u2014-]+$/, '')
    : rawDesc;
  const descriptionEscaped = escapeHtml(description);
  const canonical = meta.canonical || '';

  html = html.replace(/<title>.*?<\/title>/s, `<title>${title}</title>`);
  html = html.replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${descriptionEscaped}$2`);
  html = html.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${title}$2`);
  html = html.replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${descriptionEscaped}$2`);
  html = html.replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${canonical}$2`);
  html = html.replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${title}$2`);
  html = html.replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${descriptionEscaped}$2`);

  if (/<link rel="canonical"/.test(html)) {
    html = html.replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${canonical}$2`);
  } else if (canonical) {
    html = html.replace('</head>', `  <link rel="canonical" href="${canonical}">\n</head>`);
  }
  return html;
}

function injectFaqSchema(html, faqs) {
  if (!faqs || faqs.length === 0) return html;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const scriptTag = `<script id="faq-schema" type="application/ld+json">${JSON.stringify(schema)}</script>`;
  return html.replace('</head>', `  ${scriptTag}\n</head>`);
}

// Only inject hreflang if BOTH en and uk versions are indexable
function shouldHaveHreflang(route, locale) {
  // Check if this route is in the indexable allowlist
  const isIndexable = (route) => {
    if (INDEXABLE_STATIC_ROUTES.includes(route)) return true;
    const caseMatch = route.match(/^\/case-studies\/(.+)$/);
    if (caseMatch) return INDEXABLE_CASE_SLUGS.includes(caseMatch[1]);
    const blogMatch = route.match(/^\/blog\/(.+)$/);
    if (blogMatch) return RETAINED_BLOG_SLUGS.includes(blogMatch[1]);
    return false;
  };
  return isIndexable(route);
}

function injectHreflang(html, enPath, ukPath) {
  const enUrl = `https://vladenza.com${enPath === '/' ? '/' : enPath + '/'}`;
  const ukUrl = `https://vladenza.com${ukPath === '/' ? '/' : ukPath + '/'}`;
  const tags = [
    `<link rel="alternate" hreflang="en" href="${enUrl}">`,
    `<link rel="alternate" hreflang="uk" href="${ukUrl}">`,
    `<link rel="alternate" hreflang="x-default" href="${enUrl}">`,
  ].join('\n  ');
  return html.replace('</head>', `  ${tags}\n</head>`);
}

function injectNoindex(html) {
  html = html.replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/g, '');
  html = html.replace('</head>', '  <meta name="robots" content="noindex,follow">\n</head>');
  return html;
}

// Merge Ukrainian blog post translation into a DB record
function mergeUkPost(dbPost, uk) {
  if (!uk) return dbPost;
  return {
    ...dbPost,
    title: uk.title ?? dbPost.title,
    excerpt: uk.excerpt ?? dbPost.excerpt,
    category: uk.category ?? dbPost.category,
    read_time: uk.readTime ?? dbPost.read_time,
    tags: uk.tags ?? dbPost.tags,
    content_json: uk.content ?? dbPost.content_json,
  };
}

function mergeUkCase(dbCase, uk) {
  if (!uk) return dbCase;
  return {
    ...dbCase,
    title: uk.title ?? dbCase.title,
    niche: uk.niche ?? dbCase.niche,
    service: uk.service ?? dbCase.service,
    challenge: uk.challenge ?? dbCase.challenge,
    solution: uk.solution ?? dbCase.solution,
    result: uk.result ?? dbCase.result,
    period: uk.period ?? dbCase.period,
    metric_sub: uk.metricSub ?? dbCase.metric_sub,
    tags: uk.tags ?? dbCase.tags,
    stats: uk.stats ?? dbCase.stats,
    body: uk.body ?? dbCase.body,
  };
}

async function getDynamicData() {
  let dbPosts = [];
  let dbCases = [];
  try {
    const [{ data: posts, error: postsErr }, { data: cases, error: casesErr }] = await Promise.all([
      supabase.from('blog_posts').select('*').eq('published', true),
      supabase.from('case_studies').select('*').eq('published', true),
    ]);
    if (postsErr) console.warn('⚠ blog_posts fetch error:', postsErr.message);
    if (casesErr) console.warn('⚠ case_studies fetch error:', casesErr.message);
    dbPosts = posts ?? [];
    dbCases = cases ?? [];
  } catch (err) {
    console.warn('⚠ Database fetch failed:', err.message);
  }

  const staticBlogSlugs = getStaticBlogSlugs();
  const dbPostsBySlug = new Map(dbPosts.map((p) => [p.slug, p]));
  const dbCasesBySlug = new Map(dbCases.map((c) => [c.slug, c]));

  // All blog slugs = DB + static, but only retained ones are indexable
  const allBlogSlugs = Array.from(new Set([...dbPostsBySlug.keys(), ...staticBlogSlugs]));
  const allCaseSlugs = Array.from(dbCasesBySlug.keys());

  const nicheEditsCases = dbCases
    .filter((c) => c.service && c.service.toLowerCase().includes('niche edit'))
    .slice(0, 3)
    .map((c) => ({
      slug: c.slug,
      title: c.title,
      niche: c.niche,
      service: c.service,
      period: c.period,
      metric: c.metric,
      metric_sub: c.metric_sub,
      color: c.color,
      challenge: c.challenge,
    }));

  return { allBlogSlugs, allCaseSlugs, dbPostsBySlug, dbCasesBySlug, nicheEditsCases };
}

let caseSlugs_global = [];
let blogSlugs_global = [];

async function main() {
  const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
  fs.writeFileSync(path.join(distDir, 'spa-fallback.html'), template);

  const { allBlogSlugs, allCaseSlugs, dbPostsBySlug, dbCasesBySlug, nicheEditsCases } = await getDynamicData();
  caseSlugs_global = allCaseSlugs;
  blogSlugs_global = allBlogSlugs;

  // ─── Build the complete route list for prerendering ─────────
  // Indexable routes (EN + UK)
  const indexableCaseRoutes = INDEXABLE_CASE_SLUGS
    .filter((s) => dbCasesBySlug.has(s))
    .map((s) => `/case-studies/${s}`);
  const unverifiedCaseRoutes = UNVERIFIED_CASE_SLUGS
    .filter((s) => dbCasesBySlug.has(s))
    .map((s) => `/case-studies/${s}`);
  const retainedBlogRoutes = RETAINED_BLOG_SLUGS
    .filter((s) => dbPostsBySlug.has(s) || allBlogSlugs.includes(s))
    .map((s) => `/blog/${s}`);
  const noindexBlogRoutes = NOINDEX_BLOG_SLUGS
    .filter((s) => dbPostsBySlug.has(s) || allBlogSlugs.includes(s))
    .map((s) => `/blog/${s}`);
  const crowdLangRoutes = CROWD_LINKS_LANGUAGES.map((l) => `/services/crowd-links/${l}`);

  // All routes to prerender (EN)
  const enRoutes = [
    ...INDEXABLE_STATIC_ROUTES,
    ...NOINDEX_STATIC_ROUTES,
    ...indexableCaseRoutes,
    ...unverifiedCaseRoutes,
    ...retainedBlogRoutes,
    ...noindexBlogRoutes,
    ...crowdLangRoutes,
    // Redirected routes (still prerender for SPA fallback, but will be redirected by netlify)
    '/reviews',
  ];

  // UK routes: only core pages (no full blog/case-study mirror)
  const ukIndexableRoutes = [
    '/', // becomes /uk/
    '/services/guest-posting',
    '/services/niche-edits',
    '/services/crowd-links',
    '/services/white-label',
    '/placements',
    '/pricing',
    '/case-studies',
    '/blog',
  ];
  const ukNoindexRoutes = [
    '/services/seo-audit',
    '/services/ai-llm',
    '/services/linkedin-personal',
    '/services/linkedin-company',
    '/services/local-seo-links',
    '/seo-audit-sample',
    '/sitemap',
    '/checkout',
    '/privacy-policy',
    '/terms',
    '/refund-policy',
    '/cookie-policy',
  ];
  // UK blog: only retained blog slugs that have UK translations
  const ukRetainedBlogRoutes = RETAINED_BLOG_SLUGS
    .filter((s) => blogPostsUk[s] && (dbPostsBySlug.has(s) || allBlogSlugs.includes(s)))
    .map((s) => `/blog/${s}`);
  // UK case studies: only indexable ones with UK translations
  const ukIndexableCaseRoutes = INDEXABLE_CASE_SLUGS
    .filter((s) => casesUk[s] && dbCasesBySlug.has(s))
    .map((s) => `/case-studies/${s}`);
  const ukUnverifiedCaseRoutes = UNVERIFIED_CASE_SLUGS
    .filter((s) => casesUk[s] && dbCasesBySlug.has(s))
    .map((s) => `/case-studies/${s}`);
  // UK crowd language pages
  const ukCrowdLangRoutes = CROWD_LINKS_LANGUAGES.map((l) => `/services/crowd-links/${l}`);

  const ukRoutes = [
    ...ukIndexableRoutes,
    ...ukNoindexRoutes,
    ...ukIndexableCaseRoutes,
    ...ukUnverifiedCaseRoutes,
    ...ukRetainedBlogRoutes,
    ...ukCrowdLangRoutes,
    '/reviews',
  ];

  // Combine all routes
  const allRoutes = [
    ...enRoutes.map((r) => ({ route: r, locale: 'en' })),
    ...ukRoutes.map((r) => ({ route: r === '/' ? '/uk' : '/uk' + r, locale: 'uk', enRoute: r })),
  ];

  let successCount = 0;

  for (const { route, locale, enRoute } of allRoutes) {
    try {
      const renderRoute = route;
      const contentRoute = enRoute || route;
      let preload;
      const caseMatch = contentRoute.match(/^\/case-studies\/(.+)$/);
      const blogMatch = contentRoute.match(/^\/blog\/(.+)$/);
      if (caseMatch && dbCasesBySlug.has(caseMatch[1])) {
        const dbCase = dbCasesBySlug.get(caseMatch[1]);
        if (locale === 'uk') {
          const uk = casesUk[caseMatch[1]];
          if (!uk) {
            console.warn(`⚠ Missing UK translation for case study: ${caseMatch[1]} — skipping`);
            continue;
          }
          preload = { caseData: mergeUkCase(dbCase, uk) };
        } else {
          preload = { caseData: dbCase };
        }
      } else if (blogMatch && dbPostsBySlug.has(blogMatch[1])) {
        const dbPost = dbPostsBySlug.get(blogMatch[1]);
        if (locale === 'uk') {
          const uk = blogPostsUk[blogMatch[1]];
          if (!uk) {
            console.warn(`⚠ Missing UK translation for blog post: ${blogMatch[1]} — skipping`);
            continue;
          }
          preload = { postData: mergeUkPost(dbPost, uk) };
        } else {
          preload = { postData: dbPost };
        }
      } else if (contentRoute === '/services/niche-edits') {
        preload = { relatedCases: nicheEditsCases };
      }

      const { html: appHtml, seo, faqSchema } = await render(renderRoute, preload);
      const meta = seo || (renderRoute === '/' ? HOME_META : null);
      let html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

      // Set lang attribute
      html = html.replace(/<html\s+lang="[^"]*"/, `<html lang="${locale}"`);

      // Localize Organization schema for UK pages
      if (locale === 'uk') {
        html = html.replace('"name": "SEO & Link Building Services"', '"name": "Послуги SEO та лінкбілдингу"');
        html = html.replace('"name": "Guest Posting"', '"name": "Гостьові публікації"');
        html = html.replace('"name": "Link Insertions"', '"name": "Розміщення посилань"');
        html = html.replace('"name": "Crowd Marketing"', '"name": "Крауд-маркетинг"');
        html = html.replace('"name": "SEO Audit"', '"name": "SEO-аудит"');
        html = html.replace('"name": "AI & LLM Visibility"', '"name": "Видимість в AI та LLM"');
        html = html.replace('"availableLanguage": ["English"]', '"availableLanguage": ["English", "Ukrainian"]');
        html = html.replace('"description": "Vladenza is a results-driven SEO agency specializing in high-authority link building, guest posting, link insertions, and AI/LLM visibility."', '"description": "Vladenza — агенція SEO, що спеціалізується на лінкбілдингу з високим авторитетом, гостьових публікаціях, розміщенні посилань та видимості в AI/LLM."');
      }

      // Set canonical with trailing slash
      if (meta) {
        if (locale === 'uk') {
          meta.canonical = `https://vladenza.com${route === '/uk' ? '/uk/' : route + '/'}`;
        } else {
          // Ensure trailing slash for all non-root routes
          if (route !== '/' && !meta.canonical) {
            meta.canonical = `https://vladenza.com${route}/`;
          } else if (route === '/' && !meta.canonical) {
            meta.canonical = 'https://vladenza.com/';
          }
        }
        html = injectMeta(html, meta);
      }

      // Determine if this route should have hreflang
      const contentRouteForHreflang = enRoute || (locale === 'uk' ? route.replace(/^\/uk/, '') || '/' : route);
      const isIndexable = shouldHaveHreflang(contentRouteForHreflang, locale);

      if (isIndexable) {
        const enPath = locale === 'uk' ? (enRoute || '/') : route;
        const ukPath = locale === 'uk' ? route : (route === '/' ? '/uk' : '/uk' + route);
        html = injectHreflang(html, enPath, ukPath);
      } else {
        // Remove any existing hreflang tags for non-indexable pages
        html = html.replace(/<link\s+rel="alternate"\s+hreflang="[^"]*"\s+href="[^"]*"\s*\/?>/g, '');
      }

      // Inject noindex for non-indexable routes
      const isNoindex = NOINDEX_STATIC_ROUTES.includes(contentRouteForHreflang)
        || unverifiedCaseRoutes.includes(contentRouteForHreflang)
        || noindexBlogRoutes.includes(contentRouteForHreflang)
        || crowdLangRoutes.includes(contentRouteForHreflang)
        || contentRouteForHreflang === '/reviews'
        || meta?.noindex;

      if (isNoindex) {
        html = injectNoindex(html);
      }

      if (faqSchema) html = injectFaqSchema(html, faqSchema);

      const outPath = route === '/'
        ? path.join(distDir, 'index.html')
        : path.join(distDir, route.replace(/^\//, ''), 'index.html');
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, html);
      successCount++;
      console.log(`✓ prerendered ${route}`);
    } catch (err) {
      console.warn(`✗ failed to prerender ${route}:`, err.message);
    }
  }

  // ─── Generate sitemap from indexable allowlist only ─────────
  const sitemapEnRoutes = [
    ...INDEXABLE_STATIC_ROUTES,
    ...indexableCaseRoutes,
    ...retainedBlogRoutes,
  ];

  // UK sitemap routes: only core pages + retained blog with UK translations + indexable cases with UK
  const sitemapUkRoutes = [
    ...ukIndexableRoutes,
    ...ukIndexableCaseRoutes,
    ...ukRetainedBlogRoutes,
  ];

  const sitemapEntries = [];

  for (const r of sitemapEnRoutes) {
    const enUrl = `https://vladenza.com${r === '/' ? '/' : r + '/'}`;
    // Check if UK equivalent exists and is indexable
    const ukRoute = sitemapUkRoutes.includes(r);
    const ukUrl = ukRoute ? `https://vladenza.com${r === '/' ? '/uk/' : '/uk' + r + '/'}` : null;
    if (ukUrl) {
      sitemapEntries.push(`  <url>
    <loc>${enUrl}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="uk" href="${ukUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>`);
      sitemapEntries.push(`  <url>
    <loc>${ukUrl}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="uk" href="${ukUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>`);
    } else {
      sitemapEntries.push(`  <url>
    <loc>${enUrl}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}"/>
  </url>`);
    }
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapEntries.join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml);

  console.log(`\n✓ Done: ${successCount}/${allRoutes.length} pages prerendered.`);
  console.log(`✓ sitemap.xml generated, ${sitemapEntries.length} URLs (${sitemapEnRoutes.length} EN + ${sitemapUkRoutes.length} UK)`);
}

main().catch((err) => {
  console.error('Prerender script failed:', err);
  process.exit(1);
});
