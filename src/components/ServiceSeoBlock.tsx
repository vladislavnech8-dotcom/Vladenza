import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

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

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\[([^\]]+)\]\((\/[^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <Link key={key++} to={match[2]} className="text-[#F97316] font-medium hover:underline underline-offset-2">
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
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
    return () => {
      document.getElementById(id)?.remove();
    };
  }, [faqs]);

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight tracking-tight mb-5">
          {heading}
        </h2>
        <p className="text-gray-600 text-[17px] leading-[1.8] mb-6">{renderInline(intro)}</p>
        <div className="flex flex-col gap-5">
          {body.map((p, i) => (
            <p key={i} className="text-gray-500 text-[15px] leading-[1.85]">
              {renderInline(p)}
            </p>
          ))}
        </div>

        {faqs.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">Frequently asked questions</h3>
            <div className="flex flex-col gap-3">
              {faqs.map((f, i) => {
                const isOpen = open === i;
                return (
                  <div
                    key={i}
                    className={`rounded-xl border transition-colors ${isOpen ? 'border-[#F97316]/30 bg-orange-50/40' : 'border-gray-200 bg-white'}`}
                  >
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
                      aria-expanded={isOpen}
                    >
                      <span className="text-[15px] font-semibold text-gray-900">{f.q}</span>
                      <ChevronDown
                        size={18}
                        className={`flex-shrink-0 text-[#F97316] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 text-[14px] text-gray-500 leading-[1.8]">{renderInline(f.a)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
