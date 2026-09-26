import { ExternalLink } from 'lucide-react';
import { REVIEW_PLATFORMS } from '../data/reviewPlatforms';
import PlatformIcon from './PlatformIcon';
import { useLocale } from '../context/LocaleContext';

const content = {
  en: {
    heading: 'Reviewed on Fiverr and Clutch',
    subheading: 'Independent reviews on the platforms where our clients find and hire us.',
    viewProfile: 'View profile',
  },
  uk: {
    heading: 'Відгуки на Fiverr та Clutch',
    subheading: 'Незалежні відгуки на платформах, де наші клієнти знаходять і наймають нас.',
    viewProfile: 'Переглянути профіль',
  },
};

export default function ReviewsSection() {
  const { locale } = useLocale();
  const c = content[locale];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{c.heading}</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-md">
              {c.subheading}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {REVIEW_PLATFORMS.map((platform) => (
              <a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <PlatformIcon domain={platform.domain} name={platform.name} size={24} />
                  <span className="text-base font-bold text-gray-900">{platform.name}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-auto pt-3 border-t border-gray-100">
                  <span className="text-sm font-semibold text-gray-700">{c.viewProfile}</span>
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
