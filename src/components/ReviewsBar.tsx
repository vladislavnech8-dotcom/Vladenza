import { Star, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { REVIEW_PLATFORMS } from '../data/reviewPlatforms';
import PlatformIcon from './PlatformIcon';

const platforms = REVIEW_PLATFORMS.filter((p) => ['Fiverr', 'Clutch', 'Google'].includes(p.name));

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
                <div className="flex-shrink-0"><PlatformIcon domain={p.domain} name={p.name} size={22} /></div>
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
