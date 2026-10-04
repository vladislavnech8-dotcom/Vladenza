import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const defaultFaqs = [
  { q: 'What kind of websites do you work with?', a: 'We work with brands and agencies across competitive niches, with a focus on relevant, manually reviewed placements.' },
  { q: 'Do you provide custom link-building strategies?', a: 'Yes. Each plan is based on your niche, competition, existing backlink profile and target pages.' },
  { q: 'Are all links manually reviewed?', a: 'Yes. We avoid PBNs and spam networks and review relevance, traffic and editorial quality.' },
  { q: 'Can I track campaign progress?', a: 'Yes. Reports include every link placed, anchor used, domain metrics and the live URL.' },
];

interface FaqItem { q: string; a: string }

function FAQItem({ faq, index, openId, onToggle }: { faq: FaqItem; index: string; openId: string | null; onToggle: (id: string) => void }) {
  const isOpen = openId === index;
  const panelId = `${index}-panel`;
  return <div className={`border-2 transition-colors ${isOpen ? 'border-signal bg-white' : 'border-ink/20 bg-white hover:border-ink/50'}`}>
    <button type="button" onClick={() => onToggle(index)} aria-expanded={isOpen} aria-controls={panelId} className="editorial-focus flex min-h-14 w-full items-center justify-between gap-4 px-4 text-left sm:px-5">
      <span className="text-sm font-bold text-ink">{faq.q}</span><ChevronDown size={18} className={`shrink-0 transition-transform ${isOpen ? 'rotate-180 text-signal' : 'text-ink/50'}`} />
    </button>
    <div id={panelId} role="region" hidden={!isOpen} className="px-4 pb-5 sm:px-5"><p className="max-w-xl text-sm leading-6 text-ink/65">{faq.a}</p></div>
  </div>;
}

export default function FAQ({ faqs, compact = false }: { faqs?: FaqItem[]; compact?: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const groupId = useId();
  const list = faqs?.length ? faqs : defaultFaqs;
  const toggle = (id: string) => setOpen((current) => current === id ? null : id);
  if (compact) return <div className="flex flex-col gap-3">{list.map((faq, index) => <FAQItem key={faq.q} faq={faq} index={`${groupId}-${index}`} openId={open} onToggle={toggle} />)}</div>;
  return <section id="faq" className="bg-cream py-20"><div className="mx-auto max-w-5xl px-5"><h2 className="font-display text-4xl font-bold">Frequently asked questions</h2><div className="mt-8 grid gap-3 md:grid-cols-2">{list.map((faq, index) => <FAQItem key={faq.q} faq={faq} index={`${groupId}-${index}`} openId={open} onToggle={toggle} />)}</div></div></section>;
}
