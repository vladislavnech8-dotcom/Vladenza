import { ArrowRight, ExternalLink } from 'lucide-react';
import { REVIEW_PLATFORMS } from '../data/reviewPlatforms';
import PlatformIcon from './PlatformIcon';

export default function ReviewsBar() {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Reviewed on <span className="text-[#F97316]">Fiverr and Clutch</span>
            </h2>
            <p className="text-gray-400 text-sm max-w-sm">
              See what clients say about working with Vladenza on our review platforms.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {REVIEW_PLATFORMS.map((p) => (
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
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-[#F97316] transition-colors">
                    View profile
                  </p>
                </div>
                <ExternalLink size={9} className="text-gray-300 group-hover:text-gray-400 transition-colors ml-1" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
