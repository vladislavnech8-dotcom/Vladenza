interface GeoContext {
  country?: { code?: string };
}

const UA_BLOCKED = [
  'Googlebot', 'Bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider',
  'YandexBot', 'Sogou', 'Exabot', 'facebot', 'ia_archiver',
  'facebookexternalhit', 'Twitterbot', 'Applebot', 'SemrushBot',
  'AhrefsBot', 'MJ12bot', 'DotBot', 'PiplBot', 'BLEXBot',
];

export default async (request: Request, context: { geo?: GeoContext }) {
  const url = new URL(request.url);

  // Only redirect from the exact homepage path
  if (url.pathname !== '/') return;

  // Skip search engine crawlers
  const ua = request.headers.get('user-agent') ?? '';
  if (UA_BLOCKED.some((b) => ua.includes(b))) return;

  // Check for stored locale preference via cookie
  const cookieHeader = request.headers.get('cookie') ?? '';
  if (cookieHeader.includes('vladenza_locale=')) return;

  // Determine country from Netlify geo context
  const countryCode = context.geo?.country?.code ?? '';

  // Also check Accept-Language as fallback
  const acceptLang = request.headers.get('accept-language') ?? '';
  const hasUkrainian = /\buk\b/i.test(acceptLang.split(',')[0]);

  if (countryCode === 'UA' || (!countryCode && hasUkrainian)) {
    // Preserve query string (gclid, utm params, etc.)
    const dest = new URL('/uk/', url.origin);
    dest.search = url.search;
    return Response.redirect(dest.toString(), 302);
  }
};
