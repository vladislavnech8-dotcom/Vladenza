import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqsLeft = [
  {
    q: 'What kind of websites do you work with?',
    a: 'We specialize in SaaS, iGaming, crypto, and niche affiliate websites. Our team has experience with both new domains and established sites, ensuring strategies that drive sustainable growth.',
  },
  {
    q: 'Do you provide custom link building strategies?',
    a: 'Yes. Every client gets a custom link strategy based on their niche, competition level, existing backlink profile, and target keywords. We don\'t use cookie-cutter approaches.',
  },
  {
    q: 'Are all links safe and Google-friendly?',
    a: 'Absolutely. We manually vet every placement for relevance, traffic, and editorial quality. We avoid PBNs, spam networks, and any tactics that could trigger penalties.',
  },
  {
    q: 'Can I track the progress of my campaigns?',
    a: 'Yes. You receive monthly reports with full transparency: every link placed, anchor used, domain metrics, and ranking changes. We also provide access to live dashboards on higher plans.',
  },
  {
    q: 'Do you offer local SEO services?',
    a: 'Yes. Our local SEO service covers Google Business Profile optimization, citation building, local link acquisition, and map pack ranking strategies for location-based businesses.',
  },
];

const faqsRight = [
  {
    q: 'How quickly can I see results from link building?',
    a: 'Results vary depending on your niche, website authority, and content quality. Typically, clients start seeing measurable improvements in traffic and referring domains within 1–2 months.',
  },
  {
    q: 'What is included in your SEO audit?',
    a: 'Our audit covers technical SEO, on-page optimization, backlink profile analysis, content gap identification, competitor benchmarking, and a prioritized action plan.',
  },
  {
    q: 'Can I upgrade my plan later?',
    a: 'Yes. You can scale up your plan at any time as your needs grow. We make transitions seamless with no downtime in your link building operations.',
  },
  {
    q: 'Do you guarantee rankings?',
    a: 'We don\'t guarantee specific positions — no honest agency can. What we guarantee is a systematic, proven approach that consistently grows authority and organic traffic over time.',
  },
  {
    q: 'How do I get started?',
    a: 'Fill out the form on this page or click "Get Proposal." We\'ll analyze your website and schedule a strategy call to discuss your goals and recommend the right package.',
  },
];

function FAQItem({ faq, index, openId, onToggle }: { faq: { q: string; a: string }; index: string; openId: string | null; onToggle: (id: string) => void }) {
  const isOpen = openId === index;
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? 'border-[#F97316]/30 bg-orange-50/50' : 'border-gray-200 bg-white'}`}>
      <button
        onClick={() => onToggle(index)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className={`text-sm font-medium transition-colors pr-4 ${isOpen ? 'text-gray-900' : 'text-gray-700'}`}>
          {faq.q}
        </span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#F97316]' : 'text-gray-400'}`}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-4">
          <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ({ faqs, compact }: { faqs?: { q: string; a: string }[]; compact?: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (id: string) => setOpen(open === id ? null : id);

  const list = faqs && faqs.length > 0 ? faqs : [...faqsLeft, ...faqsRight];

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        {list.map((faq, i) => (
          <FAQItem key={i} faq={faq} index={`f${i}`} openId={open} onToggle={toggle} />
        ))}
      </div>
    );
  }

  return (
    <section id="faq" className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #fef6ee 0%, #ffffff 100%)' }}>
      {/* FAQ background vectors */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="faqGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="#F97316" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <ellipse cx="720" cy="0" rx="500" ry="300" fill="url(#faqGlow)"/>
        {/* Big ring centered top */}
        <circle cx="720" cy="-40" r="360" fill="none" stroke="#F97316" strokeWidth="1.5" opacity="0.1"/>
        <circle cx="720" cy="-40" r="260" fill="none" stroke="#F97316" strokeWidth="1.5" opacity="0.12"/>
        <circle cx="720" cy="-40" r="160" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.14"/>
        {/* Dot grid left */}
        {Array.from({ length: 7 }).map((_, row) =>
          Array.from({ length: 5 }).map((_, col) => (
            <circle key={`faq-${row}-${col}`} cx={col * 40 + 20} cy={row * 44 + 200} r="2.5" fill="#F97316" opacity={0.07 + col * 0.014} />
          ))
        )}
        {/* Dot grid right */}
        {Array.from({ length: 7 }).map((_, row) =>
          Array.from({ length: 5 }).map((_, col) => (
            <circle key={`faqr-${row}-${col}`} cx={1240 + col * 40} cy={row * 44 + 200} r="2.5" fill="#F97316" opacity={0.07 + (4 - col) * 0.014} />
          ))
        )}
        {/* Horizontal dashed lines */}
        <line x1="0" y1="650" x2="360" y2="650" stroke="#F97316" strokeWidth="1.5" opacity="0.1" strokeDasharray="6 12"/>
        <line x1="1080" y1="650" x2="1440" y2="650" stroke="#F97316" strokeWidth="1.5" opacity="0.1" strokeDasharray="6 12"/>
        {/* Corner brackets */}
        <path d="M 30 30 L 30 80 L 80 80" fill="none" stroke="#F97316" strokeWidth="2.5" opacity="0.18" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M 1410 30 L 1410 80 L 1360 80" fill="none" stroke="#F97316" strokeWidth="2.5" opacity="0.18" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#F97316] text-xs font-semibold uppercase tracking-wide mb-5">
            FAQ
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Frequently asked{' '}
            <span className="text-[#F97316]">questions</span>
          </h2>
          <p className="text-gray-400 text-sm">Everything you need to know before getting started.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            {list.slice(0, Math.ceil(list.length / 2)).map((faq, i) => (
              <FAQItem key={i} faq={faq} index={`l${i}`} openId={open} onToggle={toggle} />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {list.slice(Math.ceil(list.length / 2)).map((faq, i) => (
              <FAQItem key={i} faq={faq} index={`r${i}`} openId={open} onToggle={toggle} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
