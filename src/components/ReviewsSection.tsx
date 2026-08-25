import { Star, ExternalLink } from 'lucide-react';
import { REVIEW_PLATFORMS } from '../data/reviewPlatforms';

export default function ReviewsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 items-start">
          {/* LEFT: heading + aggregate message */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Trusted by Clients Worldwide</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-md">
              Independent reviews across the platforms where our clients find and hire us.
            </p>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-[#F97316] text-[#F97316]" />
                ))}
              </div>
              <span className="text-2xl font-black text-gray-900">4.9</span>
              <span className="text-sm text-gray-400">/ 5 average</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              Ratings aggregated from Trustpilot, Clutch, Fiverr, and Google. Click a platform below to read independent reviews.
            </p>
          </div>

          {/* RIGHT: platform cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {REVIEW_PLATFORMS.map((platform) => (
              <a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center gap-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-[#F97316] text-[#F97316]" />
                  ))}
                </div>
                <div className="text-xl font-black text-gray-900 mb-0.5">{platform.score}</div>
                <div className="text-xs text-gray-400 mb-3">{platform.reviewCount}</div>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                  <span className="text-sm font-semibold text-gray-700">{platform.name}</span>
                  <ExternalLink size={12} className="text-gray-300 group-hover:text-[#F97316] transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
