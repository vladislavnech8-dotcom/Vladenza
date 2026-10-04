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
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
        <div className="grid items-center gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
          <div>
            <h2 className="font-display max-w-[460px] text-[clamp(2.5rem,3.6vw,4.25rem)] font-bold leading-[.96] tracking-[-.045em] text-ink">{c.heading}</h2>
            <p className="mt-5 max-w-md text-[17px] leading-[1.6] text-ink/65">
              {c.subheading}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {REVIEW_PLATFORMS.map((platform) => (
              <a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="editorial-focus group flex min-h-[190px] flex-col border-2 border-ink bg-white p-6 transition-transform hover:-translate-y-1"
              >
                <div className="mb-4 flex items-center gap-2.5">
                  <PlatformIcon domain={platform.domain} name={platform.name} size={24} />
                  <span className="font-display text-xl font-bold text-ink">{platform.name}</span>
                </div>
                <div className="mt-4 text-sm font-medium text-ink/60">{platform.name === 'Fiverr' ? (locale === 'uk' ? 'Рейтинг 4.9 · 1 100+ відгуків' : '4.9 rating · 1,100+ reviews') : (locale === 'uk' ? 'Перевірений профіль агенції' : 'Verified agency profile')}</div>
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
