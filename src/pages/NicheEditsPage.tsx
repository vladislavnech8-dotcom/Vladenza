import { useState, useEffect } from 'react';
import { FileText, Link2, BarChart3, Target, Eye, Globe, ArrowRight, ArrowUpRight } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import ServiceSeoBlock from '../components/ServiceSeoBlock';
import OrderModal, { type Package } from '../components/OrderModal';
import { supabase } from '../lib/supabase';
import { useSEO } from '../hooks/useSEO';

const advantages = [
  { icon: FileText, title: 'Existing Content', desc: 'Your backlink is added to an article that is already published rather than waiting for a new article to be created.' },
  { icon: Link2, title: 'Contextual Placement', desc: 'The link is placed within content related to the destination page and topic.' },
  { icon: BarChart3, title: 'DR & Traffic Options', desc: 'Choose from different authority and organic traffic levels depending on your campaign and budget.' },
  { icon: Target, title: 'Anchor Control', desc: 'Provide your preferred anchor or let us suggest an anchor based on the existing backlink profile.' },
  { icon: Eye, title: 'Manual Review', desc: 'We review the website and page before confirming the placement.' },
  { icon: Globe, title: 'Multiple Industries', desc: 'We source opportunities across SaaS, eCommerce, finance, technology, healthcare, iGaming, and other markets.' },
];

const packages = [
  { label: 'DR10+', dr: '500–1,000 monthly traffic', price: '$70', highlight: false },
  { label: 'DR20+', dr: '1,000–5,000 monthly traffic', price: '$90', highlight: false },
  { label: 'DR30+', dr: '1,000–10,000 monthly traffic', price: '$110', highlight: false },
  { label: 'DR40+', dr: '1,000–20,000 monthly traffic', price: '$200', highlight: true },
  { label: 'DR50+', dr: '1,000–30,000 monthly traffic', price: '$280', highlight: false },
  { label: 'DR60+', dr: '1,000–60,000 monthly traffic', price: '$400', highlight: false },
];

const vsGuest = [
  { label: 'Placement', niche: 'Existing article', guest: 'New article' },
  { label: 'Typical delivery', niche: '3–7 days', guest: '10–21 days' },
  { label: 'Content', niche: 'Existing content is updated', guest: 'New article is created' },
  { label: 'Topic control', niche: 'Based on existing article', guest: 'More control over the full article' },
  { label: 'Typical cost', niche: 'Usually lower', guest: 'Usually higher' },
  { label: 'Best use', niche: 'Adding links within relevant existing content', guest: 'Creating new content around a specific topic' },
];

const samples = [
  { url: 'https://droven.io/why-predictability-matters-in-networking/', domain: 'droven.io', dr: 37, traffic: '260,464', keywords: 35, label: 'Tech / Networking', img: '/samples/niche-edit-droven.jpg' },
  { url: 'https://www.agicent.com/blog/instagram-growth-hacks-to-get-followers/', domain: 'agicent.com', dr: 54, traffic: '21,972', keywords: 464, label: 'Marketing / SaaS', img: '/samples/niche-edit-agicent.jpg' },
  { url: 'https://thefoxmagazine.com/technology/apps/6-techniques-for-gaining-followers-on-instagram-in-2025/', domain: 'thefoxmagazine.com', dr: 52, traffic: '1,258', keywords: 405, label: 'Tech / Lifestyle', img: '/samples/niche-edit-thefoxmagazine.jpg' },
  { url: 'https://www.intelligentliving.co/digital-marketing-actionable-insight/', domain: 'intelligentliving.co', dr: 64, traffic: '524', keywords: 444, label: 'Digital Marketing', img: '/samples/niche-edit-intelligentliving.jpg' },
  { url: 'https://ccr-mag.com/unlocking-your-best-smile-dental-innovations-for-a-confident-you/', domain: 'ccr-mag.com', dr: 64, traffic: '1,076', keywords: 571, label: 'Health / Dental', img: '/samples/niche-edit-ccrmag.jpg' },
  { url: 'https://theglobalhues.com/a-beginners-guide-to-choosing-the-right-hosting-plan-for-your-website/', domain: 'theglobalhues.com', dr: 52, traffic: '7,028', keywords: 766, label: 'Tech / Hosting', img: '/samples/niche-edit-theglobalhues.jpg' },
];

interface RelatedCase {
  slug: string;
  title: string;
  niche: string;
  service: string;
  period: string;
  metric: string;
  metric_sub: string;
  color: string;
  challenge: string;
}

function SampleCard({ s }: { s: typeof samples[number] }) {
  const [imgError, setImgError] = useState(false);
  return (
    <a
      href={s.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#F97316]/40 hover:shadow-md transition-all duration-300 flex flex-col"
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-gray-50">
        {imgError ? (
          <div className="w-full h-full bg-gradient-to-br from-orange-50 via-orange-50/40 to-gray-100 flex items-center justify-center">
            <span className="text-gray-300 text-sm font-medium">{s.domain}</span>
          </div>
        ) : (
          <img
            src={s.img}
            alt={`Niche edit placement on ${s.domain}`}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        )}
      </div>
      <div className="p-6 flex flex-col gap-4 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-[#F97316] uppercase tracking-wide mb-1">{s.label}</div>
            <div className="text-sm font-semibold text-gray-800 group-hover:text-[#F97316] transition-colors leading-snug break-all">{s.domain}</div>
          </div>
          <ArrowUpRight size={14} className="text-gray-300 group-hover:text-[#F97316] transition-colors mt-1 flex-shrink-0" />
        </div>
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1 font-medium">DR</div>
            <div className={`text-lg font-black ${s.dr >= 60 ? 'text-emerald-500' : s.dr >= 50 ? 'text-[#F97316]' : 'text-blue-500'}`}>{s.dr}</div>
          </div>
          <div className="text-center border-x border-gray-100">
            <div className="text-xs text-gray-400 mb-1 font-medium">Traffic</div>
            <div className="text-sm font-bold text-gray-800">{s.traffic}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1 font-medium">Keywords</div>
            <div className="text-sm font-bold text-gray-800">{s.keywords}</div>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function NicheEditsPage() {
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [relatedCases, setRelatedCases] = useState<RelatedCase[]>([]);

  useSEO({
    title: 'Buy Niche Edits & Link Insertions | Vladenza',
    description: 'Niche edits and link insertions inside existing, relevant content. Choose from DR and organic traffic options. Pricing from $70 per placement. 3–7 day delivery.',
    canonical: 'https://vladenza.com/services/niche-edits',
  });

  useEffect(() => {
    const preloaded = typeof window === 'undefined'
      ? (globalThis as Record<string, unknown>).__SSR_RELATED_CASES__ as RelatedCase[] | undefined
      : undefined;
    if (preloaded && preloaded.length > 0) {
      setRelatedCases(preloaded);
      return;
    }
    supabase
      .from('case_studies')
      .select('slug,title,niche,service,period,metric,metric_sub,color,challenge')
      .eq('published', true)
      .ilike('service', '%niche edit%')
      .limit(3)
      .then(({ data }) => {
        if (data) setRelatedCases(data as RelatedCase[]);
      });
  }, []);

  return (
    <ServicePageLayout>
      <OrderModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: 'linear-gradient(160deg, #fff7f0 0%, #ffffff 60%)' }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <circle cx="1200" cy="80" r="380" fill="none" stroke="#F97316" strokeWidth="1.5" opacity="0.1"/>
          <circle cx="1200" cy="80" r="260" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.12"/>
          <circle cx="1200" cy="80" r="140" fill="none" stroke="#F97316" strokeWidth="2.5" opacity="0.15"/>
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
              <circle key={`ne-${row}-${col}`} cx={col * 44 + 20} cy={row * 44 + 220} r="2.5" fill="#F97316" opacity={0.07 + col * 0.012} />
            ))
          )}
        </svg>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F97316]/20 bg-[#F97316]/8 text-[#F97316] text-xs font-semibold mb-6 tracking-wide uppercase">
              <Link2 size={12} />
              Service — Niche Edits
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold text-gray-900 leading-[1.08] tracking-tight mb-6">
              Niche Edit Link Building
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-3 max-w-xl">
              <span className="font-semibold text-gray-700">Backlinks inside existing, relevant content.</span>
            </p>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-xl">
              Niche edits place your link inside an existing article on a relevant website. Choose the DR and traffic level that fits your campaign, or let us recommend a mix based on your website and budget.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedPkg({ name: 'Niche Edits', price: '$70', links: 'DR 10+', service: 'Niche Edits' })}
                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
              >
                Order Niche Edits <ArrowRight size={14} />
              </button>
              <div className="flex items-center gap-2 border border-gray-200 px-5 py-3 rounded-lg text-sm text-gray-600">
                From $70 per placement · 3–7 day delivery
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Use Niche Edits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Use Niche Edits?</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              Niche edits let you add links to already-published pages. They're useful on their own and can complement guest posts and other link types in a broader campaign.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {advantages.map((a) => (
              <div key={a.title} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#F97316]/30 hover:shadow-sm transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                  <a.icon size={18} className="text-[#F97316]" />
                </div>
                <h3 className="text-gray-900 font-semibold text-sm mb-2">{a.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Choose Your Niche Edit</h2>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">
              Choose a DR and traffic level based on your campaign and budget. We'll source a relevant opportunity within the selected range and manually review the placement before it goes live.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.label} className={`rounded-2xl p-7 border ${pkg.highlight ? 'bg-[#F97316] border-[#F97316]' : 'bg-white/5 border-white/10'}`}>
                <div className="text-2xl font-bold text-white mb-2">{pkg.label}</div>
                <div className={`text-sm mb-8 ${pkg.highlight ? 'text-white/80' : 'text-gray-400'}`}>{pkg.dr}</div>
                <div className="text-4xl font-black text-white mb-7">{pkg.price}<span className={`text-sm font-medium ml-2 ${pkg.highlight ? 'text-white/80' : 'text-gray-400'}`}>/ placement</span></div>
                <button
                  onClick={() => setSelectedPkg({ name: pkg.label, price: pkg.price, links: pkg.dr, service: 'Niche Edits' })}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${pkg.highlight ? 'bg-white text-[#F97316] hover:bg-gray-100' : 'bg-[#F97316] hover:bg-[#EA580C] text-white'}`}
                >
                  Order Now <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Not sure what to choose? */}
          <div className="mt-10 max-w-2xl mx-auto text-center">
            <h3 className="text-lg font-semibold text-white mb-3">Not sure what to choose?</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Not every backlink needs to be DR60+, and a strong backlink profile usually includes different types and levels of referring domains. Send us your website and budget. We'll review your backlink profile and competitors and recommend how we'd distribute the budget across placements.
            </p>
            <a href="/#contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[#F97316] hover:text-[#FB923C] transition-colors">
              Get a Link Plan <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </section>

      {/* Different Links for Different Campaigns */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5">Different Links for Different Campaigns</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Not every campaign needs the same type of backlink. A newer website may need more referring domain diversity. An established site may need stronger links to specific commercial pages. Competitive niches may require a larger share of higher-authority placements. That's why we offer niche edits across different DR and traffic levels instead of forcing every client into one package. You can choose individual placements yourself, or we can build a mix around your backlink profile, competitors, targets, and budget.
          </p>
        </div>
      </section>

      {/* Sample Placements */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Sample Placements</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">Examples of real niche edit placements we've delivered, with current Ahrefs metrics.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {samples.map((s) => (
              <SampleCard key={s.url} s={s} />
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">Metrics sourced from Ahrefs. DR = Domain Rating. Traffic = estimated monthly organic visits. Metrics may change over time.</p>
        </div>
      </section>

      {/* Related Case Studies */}
      {relatedCases.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Niche Edits in Real Campaigns</h2>
              <p className="text-gray-500 text-sm max-w-lg mx-auto">See how niche edits have been used as part of broader link-building campaigns.</p>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {relatedCases.map((c) => (
                <a
                  key={c.slug}
                  href={`/case-studies/${c.slug}`}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="h-1 w-full" style={{ backgroundColor: c.color }} />
                  <div className="p-6 flex flex-col flex-1 gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-1 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em] truncate" style={{ color: c.color }}>{c.niche}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-[0.14em] truncate">· {c.service}</span>
                      </div>
                      <ArrowUpRight size={16} className="flex-shrink-0 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 mt-0.5" />
                    </div>
                    <h3 className="text-[16px] font-bold text-gray-900 leading-snug group-hover:text-gray-700 transition-colors">{c.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">{c.challenge}</p>
                    <div className="pt-4 mt-auto border-t border-gray-100 flex items-end justify-between gap-4">
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Key result</div>
                        <div className="text-2xl font-black leading-none" style={{ color: c.color }}>{c.metric}</div>
                        <div className="text-xs text-gray-500 mt-1">{c.metric_sub}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Timeline</div>
                        <div className="text-sm font-semibold text-gray-700">{c.period}</div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Niche Edits vs Guest Posts */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Niche Edits vs. Guest Posts</h2>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-100 border-b border-gray-200">
              <div className="p-4 text-xs font-bold uppercase text-gray-500 tracking-widest">Factor</div>
              <div className="p-4 text-xs font-bold uppercase text-[#F97316] tracking-widest border-l border-gray-200">Niche Edits</div>
              <div className="p-4 text-xs font-bold uppercase text-gray-500 tracking-widest border-l border-gray-200">Guest Posts</div>
            </div>
            {vsGuest.map((row, i) => (
              <div key={row.label} className={`grid grid-cols-3 ${i < vsGuest.length - 1 ? 'border-b border-gray-200' : ''}`}>
                <div className="p-4 text-sm text-gray-700 font-medium">{row.label}</div>
                <div className="p-4 text-sm text-gray-900 border-l border-gray-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0"/>
                  {row.niche}
                </div>
                <div className="p-4 text-sm text-gray-400 border-l border-gray-200">{row.guest}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            Both can be part of the same campaign. The right mix depends on your backlink profile, target pages, competitors, and budget.
          </p>
        </div>
      </section>

      <ServiceSeoBlock
        heading="Niche Edits as Part of Your Link Building Strategy"
        intro="Niche edits, also called link insertions, add backlinks to articles that are already published. They are commonly used alongside guest posts, forum links, and other placements to build referring domain diversity and support important pages."
        body={[
          'Selection should consider both measurable criteria and relevance. We look at DR, organic traffic, the actual article, topic, target page, anchor, and the existing backlink profile — not just a DR threshold.',
          'Clients can order individual placements by DR and traffic level, but larger campaigns may use a mix of price levels. Not every backlink needs to be a premium placement. A DR10+ link serves a different purpose than a DR50+ link, and both can have a place in the same profile depending on the campaign.',
          'For clients running ongoing link-building campaigns, we can analyze competitors and the existing backlink profile before recommending the mix of [niche edits](/blog/niche-edits-vs-guest-posts), [guest posts](/services/guest-posting), and [community links](/services/crowd-links). See real outcomes in our [case studies](/case-studies), or explore niche-specific bundles in our [link building packages](/services/link-packages/saas).',
        ]}
        faqs={[
          { q: 'What is a niche edit?', a: 'A niche edit, also called a link insertion, is a backlink added to an existing article. The link is placed inside relevant content rather than publishing a completely new guest post.' },
          { q: 'Are niche edits safe?', a: 'No link-building method is completely risk-free. We manually review potential placements and focus on relevant websites and articles rather than approving sites only because they meet a DR threshold.' },
          { q: 'Are niche edits faster than guest posts?', a: "Usually yes, because a new article doesn't need to be written and published. Typical delivery is 3–7 days, although publisher response times can vary." },
          { q: 'Can I control the anchor text?', a: 'Yes. Clients can provide preferred anchors. For ongoing campaigns, we can also recommend anchors based on the current backlink profile and target pages.' },
          { q: 'Which DR package should I choose?', a: 'It depends on the current backlink profile, competitors, target pages, and budget. Not every link needs to be DR50–60+. Clients can order a specific level or ask us to recommend a mix.' },
          { q: 'Do you guarantee indexing?', a: 'No. We can check whether a page is accessible and indexed when evaluating it, but indexing is controlled by search engines and can change over time.' },
          { q: 'Are niche edits permanent?', a: "Placements are intended to remain live, but third-party websites are outside our permanent control. If a placement is removed within the coverage period, contact us and we'll replace it." },
        ]}
      />
    </ServicePageLayout>
  );
}
