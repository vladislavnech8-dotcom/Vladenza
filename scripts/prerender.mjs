import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, getStaticBlogSlugs, supabase } from '../dist-ssr/entry-server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');

const STATIC_ROUTES = [
  '/', '/services/seo-audit', '/services/guest-posting', '/services/niche-edits',
  '/services/crowd-links', '/services/ai-llm', '/services/local-seo-links',
  '/services/linkedin-personal', '/services/linkedin-company', '/services/white-label',
  '/case-studies', '/blog', '/sitemap', '/reviews', '/seo-audit-sample', '/pricing',
  '/checkout',
];
const NICHE_SLUGS = ['igaming', 'saas', 'auto', 'health', 'proxy', 'renovations'];
const CROWD_LINKS_LANGUAGES = ['english', 'spanish', 'german', 'french', 'portuguese', 'korean'];

const HOME_META = {
  title: 'Vladenza — SEO Link Building Agency & AI Visibility',
  description: 'Results-driven SEO agency for high-authority link building, guest posting, niche edits, and AI/LLM visibility. Grow organic traffic — no lock-ins.',
  canonical: 'https://vladenza.com/',
};

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function injectMeta(html, meta) {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description || '');
  const canonical = meta.canonical || '';

  html = html.replace(/<title>.*?<\/title>/s, `<title>${title}</title>`);
  html = html.replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${description}$2`);
  html = html.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${title}$2`);
  html = html.replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${description}$2`);
  html = html.replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${canonical}$2`);
  html = html.replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${title}$2`);
  html = html.replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${description}$2`);

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
    console.warn('⚠ Не удалось получить данные из базы во время сборки:', err.message);
  }

  const staticBlogSlugs = getStaticBlogSlugs();
  const dbPostsBySlug = new Map(dbPosts.map((p) => [p.slug, p]));
  const dbCasesBySlug = new Map(dbCases.map((c) => [c.slug, c]));

  const blogSlugs = Array.from(new Set([...dbPostsBySlug.keys(), ...staticBlogSlugs]));
  const caseSlugs = Array.from(dbCasesBySlug.keys());

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

  return { blogSlugs, caseSlugs, dbPostsBySlug, dbCasesBySlug, nicheEditsCases };
}

async function main() {
  const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
  const { blogSlugs, caseSlugs, dbPostsBySlug, dbCasesBySlug, nicheEditsCases } = await getDynamicData();

  const ROUTES = [
    ...STATIC_ROUTES,
    ...NICHE_SLUGS.map((s) => `/services/link-packages/${s}`),
    ...CROWD_LINKS_LANGUAGES.map((l) => `/services/crowd-links/${l}`),
    ...caseSlugs.map((s) => `/case-studies/${s}`),
    ...blogSlugs.map((s) => `/blog/${s}`),
  ];

  let successCount = 0;

  for (const route of ROUTES) {
    try {
      let preload;
      const caseMatch = route.match(/^\/case-studies\/(.+)$/);
      const blogMatch = route.match(/^\/blog\/(.+)$/);
      if (caseMatch && dbCasesBySlug.has(caseMatch[1])) {
        preload = { caseData: dbCasesBySlug.get(caseMatch[1]) };
      } else if (blogMatch && dbPostsBySlug.has(blogMatch[1])) {
        preload = { postData: dbPostsBySlug.get(blogMatch[1]) };
      } else if (route === '/services/niche-edits') {
        preload = { relatedCases: nicheEditsCases };
      }

      const { html: appHtml, seo, faqSchema } = await render(route, preload);
      const meta = seo || (route === '/' ? HOME_META : null);
      let html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
      if (meta) html = injectMeta(html, meta);
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

  const sitemapUrls = ROUTES.map((r) => `  <url><loc>https://vladenza.com${r === '/' ? '/' : r + '/'}</loc></url>`).join('\n');
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`;
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml);

  console.log(`\n✓ Готово: ${successCount}/${ROUTES.length} страниц пререндерено.`);
  console.log(`✓ sitemap.xml сгенерирован, ${ROUTES.length} URL`);

  if (successCount < ROUTES.length) {
    console.warn(`⚠ ${ROUTES.length - successCount} страниц не удалось пререндерить — см. ошибки выше.`);
  }
}

main().catch((err) => {
  console.error('Prerender script failed:', err);
  process.exit(1);
});
