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
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12 items-center">
          <div>
            <h2 className="font-display text-[clamp(2.4rem,5vw,5rem)] font-bold leading-[.92] tracking-[-.05em] text-ink">{c.heading}</h2>
            <p className="mb-6 mt-5 max-w-md text-sm leading-6 text-ink/60">
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
                className="editorial-focus group flex flex-col border-2 border-ink bg-white p-5 transition-transform hover:-translate-y-1"
              >
                <div className="mb-4 flex items-center gap-2.5">
                  <PlatformIcon domain={platform.domain} name={platform.name} size={24} />
                  <span className="font-display text-xl font-bold text-ink">{platform.name}</span>
                </div>
                <div className="mt-auto flex items-center gap-1.5 border-t-2 border-ink/10 pt-4">
                  <span className="text-sm font-bold text-signal">{c.viewProfile}</span>
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
