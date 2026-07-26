import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');

const STATIC_ROUTES = [
  '/', '/services/seo-audit', '/services/guest-posting', '/services/niche-edits',
  '/services/crowd-links', '/services/ai-llm', '/services/local-seo-links',
  '/services/linkedin-personal', '/services/linkedin-company', '/services/white-label',
  '/case-studies', '/blog', '/sitemap', '/reviews', '/seo-audit-sample', '/pricing',
];
const NICHE_SLUGS = ['igaming', 'saas', 'auto', 'health', 'proxy', 'renovations'];

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

async function getDynamicSlugs(vite) {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  let dbBlogSlugs = [];
  let dbCaseSlugs = [];

  if (url && key) {
    const supabase = createClient(url, key);
    const [{ data: posts }, { data: cases }] = await Promise.all([
      supabase.from('blog_posts').select('slug').eq('published', true),
      supabase.from('case_studies').select('slug').eq('published', true),
    ]);
    dbBlogSlugs = (posts ?? []).map((p) => p.slug);
    dbCaseSlugs = (cases ?? []).map((c) => c.slug);
  } else {
    console.warn('⚠ Supabase env vars отсутствуют — блог/кейсы из базы не попадут в пререндер.');
  }

  const { blogPosts } = await vite.ssrLoadModule('/src/data/blogPosts.ts');
  const staticBlogSlugs = blogPosts.map((p) => p.slug);

  return {
    blogSlugs: Array.from(new Set([...dbBlogSlugs, ...staticBlogSlugs])),
    caseSlugs: Array.from(new Set(dbCaseSlugs)),
  };
}

async function main() {
  const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
  const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom' });

  const { default: App } = await vite.ssrLoadModule('/src/App.tsx');
  const seoModule = await vite.ssrLoadModule('/src/hooks/useSEO.ts');
  const { blogSlugs, caseSlugs } = await getDynamicSlugs(vite);

  const ROUTES = [
    ...STATIC_ROUTES,
    ...NICHE_SLUGS.map((s) => `/services/link-packages/${s}`),
    ...caseSlugs.map((s) => `/case-studies/${s}`),
    ...blogSlugs.map((s) => `/blog/${s}`),
  ];

  for (const route of ROUTES) {
    try {
      const appHtml = renderToString(
        React.createElement(StaticRouter, { location: route }, React.createElement(App))
      );
      const meta = seoModule.lastRenderedSEO || (route === '/' ? HOME_META : null);
      let html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
      if (meta) html = injectMeta(html, meta);

      const outPath = route === '/'
        ? path.join(distDir, 'index.html')
        : path.join(distDir, route.replace(/^\//, ''), 'index.html');
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, html);
      console.log(`✓ prerendered ${route}`);
    } catch (err) {
      console.warn(`✗ failed to prerender ${route}:`, err.message);
    }
  }

  const sitemapUrls = ROUTES.map((r) => `  <url><loc>https://vladenza.com${r}</loc></url>`).join('\n');
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`;
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml);
  console.log(`✓ sitemap.xml сгенерирован, ${ROUTES.length} URL`);

  await vite.close();
}

main();
