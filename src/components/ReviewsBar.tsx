import { Star, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const platforms = [
  {
    name: 'Fiverr',
    score: '4.9',
    reviews: '200+ orders',
    href: 'https://www.fiverr.com/vladenza',
    accent: '#1DBF73',
    logo: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="#1DBF73">
        <path d="M22.1 0H1.9C.9 0 0 .9 0 1.9v20.2C0 23.1.9 24 1.9 24h20.2c1 0 1.9-.9 1.9-1.9V1.9C24 .9 23.1 0 22.1 0zM8.5 18.5H6V10H8.5v8.5zm-1.3-9.7c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.6 1.5-1.5 1.5zm13 9.7h-2.5v-4.3c0-1-.4-1.7-1.2-1.7-.7 0-1 .5-1.2 1-.1.2-.1.4-.1.7v4.3H12.7V10h2.4v1.1c.4-.6 1-1.3 2.4-1.3 1.7 0 3 1.1 3 3.5l-.3 5.2z" />
      </svg>
    ),
  },
  {
    name: 'Clutch',
    score: '5.0',
    reviews: '40+ reviews',
    href: 'https://clutch.co/profile/vladenza',
    accent: '#EF3E27',
    logo: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="#EF3E27">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 19.5c-4.1 0-7.5-3.4-7.5-7.5S7.9 4.5 12 4.5c2.6 0 4.9 1.3 6.3 3.3l-3.1 1.8C14.4 8.7 13.3 8 12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4c1.3 0 2.5-.7 3.2-1.7l3.1 1.8c-1.4 2.1-3.7 3.4-6.3 3.4z" />
      </svg>
    ),
  },
  {
    name: 'Google',
    score: '4.8',
    reviews: '60+ reviews',
    href: 'https://g.page/r/vladenza',
    accent: '#4285F4',
    logo: (
      <svg viewBox="0 0 24 24" width="22" height="22">
        <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9c-.3 1.4-1 2.5-2.2 3.3v2.7h3.5c2-1.9 3.3-4.7 3.3-8z"/>
        <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.2 1-3.8 1-2.9 0-5.4-2-6.3-4.6H2.1v2.8C3.9 20.7 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.7 14c-.2-.7-.3-1.3-.3-2s.1-1.3.3-2V7.2H2.1C1.4 8.6 1 10.3 1 12s.4 3.4 1.1 4.8l3.6-2.8z"/>
        <path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.5 2.1 15 1 12 1 7.7 1 3.9 3.3 2.1 7.2l3.6 2.8C6.6 7.4 9.1 5.4 12 5.4z"/>
      </svg>
    ),
  },
];

const testimonials = [
  {
    text: 'Vladenza delivered 80+ DR 50+ links in 4 months. Our organic traffic doubled and we now rank top 3 for our most competitive keywords.',
    author: 'Marcus Webb',
    role: 'Head of SEO, SaaS Platform',
    initials: 'MW',
    color: '#F97316',
  },
  {
    text: 'The best link building agency we have worked with. Transparent reporting, real placements, and rankings that actually moved.',
    author: 'Sofia Chen',
    role: 'Marketing Director, Fintech',
    initials: 'SC',
    color: '#2563eb',
  },
  {
    text: 'We tried three other agencies before Vladenza. None delivered. These guys got us results within the first month.',
    author: 'James Okafor',
    role: 'Founder, iGaming Startup',
    initials: 'JO',
    color: '#16a34a',
  },
];

export default function ReviewsBar() {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top row: heading + platform badges inline */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Trusted by <span className="text-[#F97316]">840+ clients</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-sm">
              Real results from real campaigns across platforms.
            </p>
          </div>

          {/* Platform badges — horizontal row */}
          <div className="flex items-center gap-3 flex-wrap">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex-shrink-0">{p.logo}</div>
                <div>
                  <p className="text-[11px] text-gray-400 leading-none mb-0.5">{p.name}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold" style={{ color: p.accent }}>{p.score}</span>
                    <div className="flex gap-[1px]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={8} style={{ fill: p.accent, color: p.accent }} />
                      ))}
                    </div>
                  </div>
                </div>
                <ExternalLink size={9} className="text-gray-300 group-hover:text-gray-400 transition-colors ml-1" />
              </a>
            ))}
          </div>
        </div>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-[#F97316]/30 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} style={{ fill: '#F97316', color: '#F97316' }} />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-5">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-gray-900 text-sm font-semibold">{t.author}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => navigate('/reviews')}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors group"
          >
            Read all reviews
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
