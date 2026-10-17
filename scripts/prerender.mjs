import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { render, getStaticBlogSlugs, supabase, blogPostsUk, casesUk } from '../dist-ssr/entry-server.js';
import {
  INDEXABLE_STATIC as EN_INDEXABLE_STATIC,
  UK_INDEXABLE_STATIC,
  NOINDEX_STATIC as EN_NOINDEX_STATIC,
  UK_NOINDEX_STATIC,
  INDEXABLE_CASE_SLUGS as EN_INDEXABLE_CASE_SLUGS,
  INDEXABLE_BLOG_SLUGS as EN_INDEXABLE_BLOG_SLUGS,
  NOINDEX_BLOG_SLUGS as EN_NOINDEX_BLOG_SLUGS,
  UNVERIFIED_CASE_SLUGS,
  CROWD_LINKS_LANGUAGES,
  REDIRECTED_ROUTES,
  GONE_ROUTES,
  isEnIndexable,
  isUkIndexable,
  shouldHaveHreflang,
} from '../src/lib/routeRegistry.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');

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
  const description = rawDesc.length > 180
    ? rawDesc.slice(0, 180).replace(/[\s,;.:.\u2013\u2014-]+$/, '')
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

function injectHreflang(html, enPath, ukPath) {
  const enUrl = `https://vladenza.com${enPath === '/' ? '/' : enPath + '/'}`;
  const ukUrl = `https://vladenza.com${ukPath === '/' ? '/uk/' : ukPath + '/'}`;
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

// Remove all hreflang tags (for non-indexable pages)
function stripHreflang(html) {
  return html.replace(/<link\s+rel="alternate"\s+hreflang="[^"]*"\s+href="[^"]*"\s*\/?>/g, '');
}

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

// Service-role client for fetching pending revisions (not embedded in client code)
// Falls back to anon client (active-only) if the service role key is not set.
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceSupabase = serviceRoleKey && supabaseUrl
  ? createClient(supabaseUrl, serviceRoleKey)
  : null;

// Optional: pin build to a specific revision ID via env var
const pinnedRevisionId = process.env.SEO_REVISION_ID || null;

async function getSeoRevision() {
  try {
    // If a specific revision ID is pinned, fetch it with the service-role client
    if (pinnedRevisionId && serviceSupabase) {
      const { data: pinned, error } = await serviceSupabase
        .from('seo_revisions')
        .select('*')
        .eq('id', pinnedRevisionId)
        .maybeSingle();
      if (error) console.warn('⚠ Pinned revision fetch error:', error.message);
      if (pinned) {
        if (pinned.status === 'cancelled') {
          console.warn(`⚠ Pinned revision #${pinned.number} is cancelled — skipping`);
          return null;
        }
        console.log(`✓ Using pinned SEO revision #${pinned.number} (status: ${pinned.status})`);
        return pinned;
      }
      console.warn(`⚠ Pinned revision ${pinnedRevisionId} not found`);
    }

    // Try to fetch pending revision with service-role client
    if (serviceSupabase) {
      const { data: pending } = await serviceSupabase
        .from('seo_revisions')
        .select('*')
        .eq('status', 'pending')
        .order('number', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (pending) {
        console.log(`✓ Using pending SEO revision #${pending.number}`);
        return pending;
      }
    }

    // Fall back to active revision via anon client (publicly readable)
    const { data: active } = await supabase
      .from('seo_revisions')
      .select('*')
      .eq('status', 'active')
      .order('number', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (active) {
      console.log(`✓ Using active SEO revision #${active.number}`);
      return active;
    }
  } catch (err) {
    console.warn('⚠ SEO revision fetch failed:', err.message);
  }
  console.log('✓ No SEO revision found — using hardcoded metadata');
  return null;
}

function getRevisionMetaForRoute(revision, contentRoute, locale) {
  if (!revision || !revision.metadata) return null;
  // contentRoute is like '/services/guest-posting' or '/'
  const pageKey = contentRoute === '/' ? 'home' : contentRoute.replace(/^\//, '');
  const entry = revision.metadata[pageKey];
  if (!entry) return null;
  // Only use entries matching the locale (or en as fallback for og_title etc.)
  if (entry.locale && entry.locale !== locale) return null;
  return entry;
}

function injectSeoManifest(html, revision) {
  if (!revision) return html;
  const manifest = JSON.stringify({
    revisionId: revision.id,
    revisionNumber: revision.number,
    metadata: revision.metadata,
  });
  const tag = `<script type="application/json" id="seo-manifest" data-revision="${revision.number}">${manifest}</script>`;
  // Remove any existing manifest
  html = html.replace(/<script[^>]*id="seo-manifest"[^>]*><\/script>/g, '');
  return html.replace('</head>', `  ${tag}\n</head>`);
}

function injectBuildManifest(revision) {
  if (!revision) return null;
  return {
    revisionId: revision.id,
    revisionNumber: revision.number,
    builtAt: new Date().toISOString(),
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

  const allBlogSlugs = Array.from(new Set([...dbPostsBySlug.keys(), ...staticBlogSlugs]));

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

  return { allBlogSlugs, dbPostsBySlug, dbCasesBySlug, nicheEditsCases };
}

async function main() {
  const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
  fs.writeFileSync(path.join(distDir, 'spa-fallback.html'), template);

  const { allBlogSlugs, dbPostsBySlug, dbCasesBySlug, nicheEditsCases } = await getDynamicData();
  const seoRevision = await getSeoRevision();

  // ─── Build route lists ─────────────────────────────────────────
  // EN indexable case/blog routes
  const enIndexableCaseRoutes = EN_INDEXABLE_CASE_SLUGS
    .filter((s) => dbCasesBySlug.has(s))
    .map((s) => `/case-studies/${s}`);
  const enUnverifiedCaseRoutes = UNVERIFIED_CASE_SLUGS
    .filter((s) => dbCasesBySlug.has(s))
    .map((s) => `/case-studies/${s}`);
  const enIndexableBlogRoutes = EN_INDEXABLE_BLOG_SLUGS
    .filter((s) => dbPostsBySlug.has(s) || allBlogSlugs.includes(s))
    .map((s) => `/blog/${s}`);
  const enNoindexBlogRoutes = EN_NOINDEX_BLOG_SLUGS
    .filter((s) => dbPostsBySlug.has(s) || allBlogSlugs.includes(s))
    .map((s) => `/blog/${s}`);
  const crowdLangRoutes = CROWD_LINKS_LANGUAGES.map((l) => `/services/crowd-links/${l}`);

  // EN routes to prerender
  const enRoutes = [
    // Indexable
    ...EN_INDEXABLE_STATIC,
    ...enIndexableCaseRoutes,
    ...enIndexableBlogRoutes,
    // Noindex
    ...EN_NOINDEX_STATIC,
    ...enUnverifiedCaseRoutes,
    ...enNoindexBlogRoutes,
    ...crowdLangRoutes,
  ];

  // UK routes to prerender
  // Indexable: only compact commercial layer
  const ukIndexableRoutes = UK_INDEXABLE_STATIC;
  // Noindex: all other UK routes that exist (static noindex + blog/case mirrors)
  const ukNoindexStatic = UK_NOINDEX_STATIC;
  // UK blog: all retained blog slugs that have UK translations (noindex)
  const ukBlogRoutes = EN_INDEXABLE_BLOG_SLUGS
    .filter((s) => blogPostsUk[s] && (dbPostsBySlug.has(s) || allBlogSlugs.includes(s)))
    .map((s) => `/blog/${s}`);
  // UK case studies: split into indexable (verified) and noindex (unverified)
  const ukIndexableCaseRoutes = EN_INDEXABLE_CASE_SLUGS
    .filter((s) => casesUk[s] && dbCasesBySlug.has(s))
    .map((s) => `/case-studies/${s}`);
  const ukUnverifiedCaseRoutes = UNVERIFIED_CASE_SLUGS
    .filter((s) => casesUk[s] && dbCasesBySlug.has(s))
    .map((s) => `/case-studies/${s}`);
  const ukCaseRoutes = [...ukIndexableCaseRoutes, ...ukUnverifiedCaseRoutes];
  // UK crowd language pages (noindex)
  const ukCrowdLangRoutes = CROWD_LINKS_LANGUAGES.map((l) => `/services/crowd-links/${l}`);

  const ukRoutes = [
    ...ukIndexableRoutes,
    ...ukNoindexStatic,
    ...ukBlogRoutes,
    ...ukCaseRoutes,
    ...ukCrowdLangRoutes,
  ];

  // Combine: map UK routes to /uk prefix
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

      html = html.replace(/<html\s+lang="[^"]*"/, `<html lang="${locale}"`);

      if (locale === 'uk') {
        html = html.replace('"name": "SEO & Link Building Services"', '"name": "Послуги SEO та лінкбілдингу"');
        html = html.replace('"name": "Guest Posting"', '"name": "Гостові публікації"');
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
          if (route !== '/' && !meta.canonical) {
            meta.canonical = `https://vladenza.com${route}/`;
          } else if (route === '/' && !meta.canonical) {
            meta.canonical = 'https://vladenza.com/';
          }
        }
        html = injectMeta(html, meta);
      }

      // Override with SEO revision metadata if available
      const revMeta = getRevisionMetaForRoute(seoRevision, contentRoute, locale);
      if (revMeta && revMeta.title) {
        const revOverride = {
          title: revMeta.title,
          description: revMeta.description || '',
          canonical: revMeta.canonical || (locale === 'uk'
            ? `https://vladenza.com${route === '/uk' ? '/uk/' : route + '/'}`
            : `https://vladenza.com${route === '/' ? '/' : route + '/'}`),
        };
        html = injectMeta(html, revOverride);
      }

      // Hreflang: only if both EN and UK are indexable
      if (shouldHaveHreflang(contentRoute, locale)) {
        const enPath = locale === 'uk' ? contentRoute : route;
        const ukPath = locale === 'uk' ? route : (route === '/' ? '/uk' : '/uk' + route);
        html = injectHreflang(html, enPath, ukPath);
      } else {
        html = stripHreflang(html);
      }

      // Determine noindex status (locale-aware)
      const isNoindexRoute =
        (locale === 'en' && EN_NOINDEX_STATIC.includes(contentRoute)) ||
        (locale === 'uk' && UK_NOINDEX_STATIC.includes(contentRoute)) ||
        (locale === 'en' && enUnverifiedCaseRoutes.includes(contentRoute)) ||
        (locale === 'uk' && ukUnverifiedCaseRoutes.includes(contentRoute)) ||
        (locale === 'en' && enNoindexBlogRoutes.includes(contentRoute)) ||
        (locale === 'uk' && ukBlogRoutes.includes(contentRoute)) ||
        (locale === 'en' && crowdLangRoutes.includes(contentRoute)) ||
        (locale === 'uk' && ukCrowdLangRoutes.includes(contentRoute)) ||
        meta?.noindex;

      if (isNoindexRoute) {
        html = injectNoindex(html);
      }

      if (faqSchema) html = injectFaqSchema(html, faqSchema);

      // Inject SEO metadata manifest for SPA navigation consistency
      html = injectSeoManifest(html, seoRevision);

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

  // ─── Generate sitemap ──────────────────────────────────────────
  // EN indexable routes
  const sitemapEnRoutes = [
    ...EN_INDEXABLE_STATIC,
    ...enIndexableCaseRoutes,
    ...enIndexableBlogRoutes,
  ];

  // UK indexable routes: compact commercial layer + verified case studies
  const sitemapUkRoutes = [...UK_INDEXABLE_STATIC, ...ukIndexableCaseRoutes];

  const sitemapEntries = [];

  for (const r of sitemapEnRoutes) {
    const enUrl = `https://vladenza.com${r === '/' ? '/' : r + '/'}`;
    // Check if UK equivalent is indexable
    const ukIsIndexable = sitemapUkRoutes.includes(r);
    const ukUrl = ukIsIndexable ? `https://vladenza.com${r === '/' ? '/uk/' : '/uk' + r + '/'}` : null;
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

  // Also copy sitemap.xml to public/ so it exists before build
  fs.writeFileSync(path.join(root, 'public', 'sitemap.xml'), sitemapXml);

  // Write build manifest for deployment verification
  const buildManifest = injectBuildManifest(seoRevision);
  if (buildManifest) {
    fs.writeFileSync(path.join(distDir, 'seo-build-manifest.json'), JSON.stringify(buildManifest, null, 2));
    console.log(`✓ seo-build-manifest.json: revision #${buildManifest.revisionNumber}`);
  } else {
    fs.writeFileSync(path.join(distDir, 'seo-build-manifest.json'), JSON.stringify({ revisionId: null, revisionNumber: null, builtAt: new Date().toISOString() }, null, 2));
    console.log('✓ seo-build-manifest.json: no revision (hardcoded metadata)');
  }

  console.log(`\n✓ Done: ${successCount}/${allRoutes.length} pages prerendered.`);
  console.log(`✓ sitemap.xml: ${sitemapEntries.length} URLs (${sitemapEnRoutes.length} EN + ${sitemapUkRoutes.length} UK)`);
}

main().catch((err) => {
  console.error('Prerender script failed:', err);
  process.exit(1);
});
