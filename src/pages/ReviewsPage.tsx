import { Star, ExternalLink } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import { useSEO } from '../hooks/useSEO';

/* ─── Favicon-based logos ─────────────────────────────────────── */

function PlatformIcon({ favicon, alt, size = 20 }: { favicon: string; alt: string; size?: number }) {
  return (
    <img
      src={`https://icons.duckduckgo.com/ip3/${favicon}.ico`}
      alt={alt}
      width={size}
      height={size}
      style={{ borderRadius: 4, display: 'inline-block' }}
    />
  );
}

/* ─── Data ────────────────────────────────────────────────────── */

const platforms = [
  {
    name: 'Fiverr',
    favicon: 'fiverr.com',
    score: '4.9',
    reviews: '1.1K',
    tag: 'Freelance Platform',
    tagColor: 'text-green-600 bg-green-50 border-green-200',
    description: 'Reviews on Fiverr help us rank higher and reach more clients looking for SEO services.',
    cta: 'View Profile on Fiverr',
    url: 'https://www.fiverr.com/fittranslate?public_mode=true',
    bg: 'from-emerald-50 to-white',
    border: 'border-emerald-100',
    btnBg: 'bg-[#1DBF73] hover:bg-green-600',
    steps: [
      'Open our Fiverr profile via the button below',
      'Find the order you placed with us',
      'Leave a star rating and written feedback',
    ],
  },
  {
    name: 'Clutch',
    favicon: 'clutch.co',
    score: '5.0',
    reviews: '11',
    tag: 'B2B Reviews',
    tagColor: 'text-red-600 bg-red-50 border-red-200',
    description: 'Clutch is the leading B2B ratings & reviews platform. Your review helps other businesses find reliable SEO partners.',
    cta: 'Leave a Review on Clutch',
    url: 'https://clutch.co/profile/vladenza',
    bg: 'from-red-50 to-white',
    border: 'border-red-100',
    btnBg: 'bg-[#EF3E27] hover:bg-red-700',
    steps: [
      'Click the button below to open our Clutch profile',
      'Sign in with LinkedIn or email',
      'Rate our cooperation and write a few sentences about the results',
    ],
  },
];

const testimonials = [
  {
    name: 'Marcus D.',
    role: 'Head of Growth, SaaS Platform',
    platform: 'Clutch',
    text: 'Vladenza delivered exactly what was promised — DR 60+ links, natural anchors, and visible ranking improvements within 8 weeks. Communication was fast and transparent throughout.',
    stars: 5,
  },
  {
    name: 'James K.',
    role: 'Founder, Health & Wellness Brand',
    platform: 'Fiverr',
    text: 'Ordered the health niche package — links were live within the agreed timeline, all on relevant, real-traffic sites. No PBN garbage. Will reorder.',
    stars: 5,
  },
  {
    name: 'Elena V.',
    role: 'SEO Manager, iGaming Portal',
    platform: 'Clutch',
    text: 'We\'ve tried 4 link building agencies before. Vladenza is the only one that actually moves the needle in competitive niches. Our DA went from 28 to 54 in 9 months.',
    stars: 5,
  },
  {
    name: 'Tom H.',
    role: 'Digital Agency Owner',
    platform: 'Fiverr',
    text: 'I resell these services to my own clients. Quality is consistently high, reporting is clean, and links are always from domains with genuine traffic.',
    stars: 5,
  },
];

const stats = [
  { value: '4.9', label: 'Average Rating', sub: 'across Fiverr and Clutch' },
  { value: '1.1K+', label: 'Verified Reviews', sub: 'Fiverr and Clutch' },
  { value: '840+', label: 'Campaigns', sub: 'delivered since 2018' },
  { value: '97%', label: 'Repeat Rate', sub: 'clients who reorder' },
];

const faviconMap: Record<string, string> = {
  Clutch: 'clutch.co',
  Fiverr: 'fiverr.com',
};

export default function ReviewsPage() {
  useSEO({
    title: 'Reviews & Ratings — Vladenza SEO Agency',
    description: 'See what clients say about Vladenza on Fiverr and Clutch. Leave a review and help other businesses find trusted SEO partners.',
    canonical: 'https://vladenza.com/reviews',
  });

  return (
    <ServicePageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 lg:py-24" style={{ background: 'linear-gradient(155deg,#fff7f0 0%,#ffffff 60%)' }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="revGlow" cx="80%" cy="30%" r="40%">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.08"/>
              <stop offset="100%" stopColor="#F97316" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#revGlow)"/>
        </svg>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-6">
              <Star size={12} className="fill-[#F97316] text-[#F97316]" />
              <span className="text-xs font-semibold text-[#F97316] tracking-wide uppercase">Client Reviews</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight mb-5">
              What Our Clients<br />
              <span className="text-[#F97316]">Say About Us</span>
            </h1>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-8">
              We've helped 840+ websites grow organic traffic in competitive niches. Here's what they say — and where you can share your experience too.
            </p>
            {/* Platform badges */}
            <div className="flex flex-wrap gap-3">
              {platforms.map((p) => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-semibold text-gray-700 hover:border-[#F97316]/50 hover:text-[#F97316] transition-all duration-200 shadow-sm"
                >
                  <PlatformIcon favicon={p.favicon} alt={p.name} size={16} />
                  <span className="flex gap-px">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={9} className="fill-[#F97316] text-[#F97316]" />
                    ))}
                  </span>
                  {p.score} on {p.name}
                  <ExternalLink size={11} className="text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-gray-100 bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-gray-900 mb-0.5">{s.value}</div>
                <div className="text-xs font-bold text-gray-700">{s.label}</div>
                <div className="text-[10px] text-gray-400">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leave a review — platform cards */}
      <section className="py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-3">
              Worked with us? <span className="text-[#F97316]">Leave a Review</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
              Your feedback helps other businesses choose the right SEO partner and takes less than 2 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {platforms.map((p) => (
                <div
                  key={p.name}
                  className={`relative bg-gradient-to-br ${p.bg} border ${p.border} rounded-2xl p-6 flex flex-col group hover:shadow-md transition-all duration-300`}
                >
                  {/* Platform header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/80 flex items-center justify-center shadow-sm border border-gray-100">
                      <PlatformIcon favicon={p.favicon} alt={p.name} size={24} />
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${p.tagColor}`}>
                      {p.tag}
                    </span>
                  </div>

                  {/* Logo + score */}
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="text-lg font-black text-gray-900">{p.name}</span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-sm font-bold text-[#F97316]">{p.score}</span>
                    <span className="text-xs text-gray-400">({p.reviews} reviews)</span>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className="fill-[#F97316] text-[#F97316]" />
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1">{p.description}</p>

                  {/* Steps */}
                  <ol className="mb-5 space-y-1.5">
                    {p.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] text-gray-500">
                        <span className="w-4 h-4 rounded-full bg-white border border-gray-200 text-[9px] font-bold text-gray-700 flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>

                  {/* CTA button */}
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-1.5 w-full text-white text-xs font-bold py-2.5 rounded-xl ${p.btnBg} transition-colors duration-200`}
                  >
                    {p.cta}
                    <ExternalLink size={11} />
                  </a>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="py-16 lg:py-20 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-3">
              Recent Client Feedback
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Real results from real campaigns. Names and details shared with permission.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5">
            {testimonials.map((t) => {
              const favicon = faviconMap[t.platform];
              return (
                <div
                  key={t.name}
                  className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-sm hover:border-gray-200 transition-all duration-200"
                >
                  {/* Stars + platform */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {[...Array(t.stars)].map((_, i) => (
                        <Star key={i} size={12} className="fill-[#F97316] text-[#F97316]" />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {favicon && <PlatformIcon favicon={favicon} alt={t.platform} size={14} />}
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{t.platform}</span>
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-gray-600 text-sm leading-relaxed flex-1">"{t.text}"</p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#F97316] font-bold text-xs">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">{t.name}</div>
                      <div className="text-[10px] text-gray-400">{t.role}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
}
