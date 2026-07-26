import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const BASE = 'https://vladenza.com';

const STATIC_URLS = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/reviews', priority: '0.7', changefreq: 'monthly' },
  { loc: '/sitemap', priority: '0.5', changefreq: 'monthly' },
  { loc: '/services/seo-audit', priority: '0.9', changefreq: 'monthly' },
  { loc: '/services/guest-posting', priority: '0.9', changefreq: 'monthly' },
  { loc: '/services/niche-edits', priority: '0.9', changefreq: 'monthly' },
  { loc: '/services/crowd-links', priority: '0.9', changefreq: 'monthly' },
  { loc: '/services/ai-llm', priority: '0.9', changefreq: 'monthly' },
  { loc: '/services/local-seo-links', priority: '0.9', changefreq: 'monthly' },
  { loc: '/services/linkedin-personal', priority: '0.8', changefreq: 'monthly' },
  { loc: '/services/linkedin-company', priority: '0.8', changefreq: 'monthly' },
  { loc: '/services/white-label', priority: '0.8', changefreq: 'monthly' },
  { loc: '/seo-audit-sample', priority: '0.6', changefreq: 'monthly' },
  { loc: '/services/link-packages/igaming', priority: '0.8', changefreq: 'monthly' },
  { loc: '/services/link-packages/saas', priority: '0.8', changefreq: 'monthly' },
  { loc: '/services/link-packages/auto', priority: '0.8', changefreq: 'monthly' },
  { loc: '/services/link-packages/health', priority: '0.8', changefreq: 'monthly' },
  { loc: '/services/link-packages/proxy', priority: '0.8', changefreq: 'monthly' },
  { loc: '/services/link-packages/renovations', priority: '0.8', changefreq: 'monthly' },
  { loc: '/case-studies', priority: '0.8', changefreq: 'weekly' },
  { loc: '/blog', priority: '0.8', changefreq: 'weekly' },
];

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const [casesRes, postsRes] = await Promise.all([
      supabase.from('case_studies').select('slug, updated_at').eq('published', true).order('created_at', { ascending: false }),
      supabase.from('blog_posts').select('slug, updated_at').eq('published', true).order('created_at', { ascending: false }),
    ]);

    const caseUrls = (casesRes.data ?? []).map((c: { slug: string; updated_at: string }) => ({
      loc: `/case-studies/${c.slug}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: c.updated_at?.slice(0, 10),
    }));

    const blogUrls = (postsRes.data ?? []).map((p: { slug: string; updated_at: string }) => ({
      loc: `/blog/${p.slug}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: p.updated_at?.slice(0, 10),
    }));

    const allUrls = [...STATIC_URLS, ...caseUrls, ...blogUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url>
    <loc>${BASE}${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>\n    ` : ''}<changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
