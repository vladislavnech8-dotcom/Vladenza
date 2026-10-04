import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useLocale } from '../context/LocaleContext';

export interface Faq {
  q: string;
  a: string;
}

export let lastRenderedFaqSchema: Faq[] | null = null;

export function resetFaqSchemaCapture() {
  lastRenderedFaqSchema = null;
}

interface Props {
  heading: string;
  intro: string;
  body: string[];
  faqs: Faq[];
}

function renderInline(text: string, lp: (p: string) => string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\[([^\]]+)\]\((\/[^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <Link key={key++} to={lp(match[2])} className="text-signal font-medium hover:underline underline-offset-2">
        {match[1]}
      </Link>
    );
    last = regex.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function ServiceSeoBlock({ heading, intro, body, faqs }: Props) {
  const [open, setOpen] = useState<number | null>(0);
  const { locale, localizePath: lp } = useLocale();

  if (typeof window === 'undefined') {
    lastRenderedFaqSchema = faqs;
  }

  useEffect(() => {
    const id = 'faq-schema';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: locale === 'uk' ? 'uk' : 'en',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        inLanguage: locale === 'uk' ? 'uk' : 'en',
        acceptedAnswer: { '@type': 'Answer', text: f.a, inLanguage: locale === 'uk' ? 'uk' : 'en' },
      })),
    });
    return () => {
      document.getElementById(id)?.remove();
    };
  }, [faqs, locale]);

  return (
    <section className="bg-cream py-[88px] md:py-28">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-[clamp(2rem,3vw,3rem)] font-bold leading-[.96] tracking-[-.045em] text-ink mb-5">
              {heading}
            </h2>
            <p className="text-[17px] leading-[1.65] text-ink/70 mb-6">{renderInline(intro, lp)}</p>
            <div className="flex flex-col gap-5">
              {body.map((p, i) => (
                <p key={i} className="text-[15px] leading-[1.75] text-ink/60">
                  {renderInline(p, lp)}
                </p>
              ))}
            </div>
          </div>

          {faqs.length > 0 && (
            <div>
              <h3 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-bold tracking-[-.045em] text-ink mb-6">{locale === 'uk' ? 'Поширені запитання' : 'Frequently asked questions'}</h3>
              <div className="flex flex-col gap-3">
                {faqs.map((f, i) => {
                  const isOpen = open === i;
                  return (
                    <div
                      key={i}
                      className={`rounded-2xl border transition-colors ${isOpen ? 'border-signal/30 bg-white' : 'border-ink/10 bg-white'}`}
                    >
                      <button
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="text-[15px] font-bold text-ink">{f.q}</span>
                        <ChevronDown
                          size={18}
                          className={`flex-shrink-0 text-signal transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                      >
                        <div className="overflow-hidden">
                          <p className="px-5 pb-5 text-[15px] leading-[1.7] text-ink/60">{renderInline(f.a, lp)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
