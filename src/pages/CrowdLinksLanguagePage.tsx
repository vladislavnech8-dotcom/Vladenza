import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Globe as Globe2, Star } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import ServiceSeoBlock from '../components/ServiceSeoBlock';
import OrderModal, { type Package } from '../components/OrderModal';
import PlatformIcon from '../components/PlatformIcon';
import { useSEO } from '../hooks/useSEO';
import { REVIEW_PLATFORMS } from '../data/reviewPlatforms';

interface LanguageData {
  label: string;
  metaTitle: string;
  metaDescription: string;
  heroDesc: string;
  marketNote: string;
  intro: string;
  body: string[];
  extraFaq: { q: string; a: string };
  tags: string[];
}

const LANGUAGE_DATA: Record<string, LanguageData> = {
  english: {
    label: 'English',
    metaTitle: 'English Crowd Marketing Service — Forum & Community Links | Vladenza',
    metaDescription: 'Crowd links on English-language forums, Q&A platforms, and communities across the US, UK, and global English-speaking markets. Manual placement, spam-safe.',
    heroDesc: 'We build forum and community links on English-language platforms — the deepest inventory we cover, spanning US, UK, Canadian, and Australian communities.',
    marketNote: 'The largest, most mature crowd-marketing market we operate in — the widest selection of niche forums, subreddits, and Q&A platforms of any language we cover.',
    intro: 'English-language crowd marketing gives you access to the widest pool of forums, subreddits, and niche communities of any market we work in. For most brands targeting US, UK, or global English-speaking audiences, this is the highest-volume, most cost-efficient way to diversify a link profile with genuine community signals.',
    body: [
      'Because English-language communities are so numerous, we can be highly selective — placing mentions only in threads and discussions genuinely relevant to your niche, rather than padding volume with off-topic forums. Every account we post from is aged and has real posting history.',
      'English crowd links work especially well layered under [guest posting](/services/guest-posting) and [niche edits](/services/niche-edits) campaigns targeting the same English-speaking market — see the [full Crowd Marketing service](/services/crowd-links) for how these combine.',
    ],
    extraFaq: { q: 'Do you cover Reddit and Quora specifically?', a: 'Yes — Reddit and Quora are part of our English-language inventory alongside dozens of niche forums, chosen based on where your specific target audience is actually active, not just the biggest names.' },
    tags: ['forum links', 'crowd marketing', 'english backlinks', 'community links', 'link building', 'US & UK SEO'],
  },
  spanish: {
    label: 'Spanish',
    metaTitle: 'Spanish Crowd Marketing Service — Forum Links (Spain & LatAm) | Vladenza',
    metaDescription: 'Native Spanish-language crowd links across forums and communities in Spain and Latin America. Manually placed, niche-matched, spam-safe.',
    heroDesc: 'We build forum and community links on Spanish-language platforms, covering both Spain and Latin American communities — a market most link building vendors don\u2019t serve natively.',
    marketNote: 'A fast-growing, still-underserved market — most link building vendors only operate in English, leaving genuine Spanish-language placement opportunity on the table.',
    intro: 'Spanish-language crowd marketing reaches two distinct audiences at once — Spain and Latin America — through forums and communities where discussions happen natively in Spanish, not through translated English content. This matters for brands genuinely targeting Spanish-speaking markets rather than just running English campaigns through a translator.',
    body: [
      'Placements are written natively in Spanish by contributors familiar with regional differences between Spain and Latin American Spanish — not machine-translated from English, which is a common shortcut among cheaper vendors and reads unnaturally to native speakers and moderators alike.',
      'This works best combined with [guest posting](/services/guest-posting) on Spanish-language publications for a fuller local link profile — see the [full Crowd Marketing service](/services/crowd-links) for the complete picture.',
    ],
    extraFaq: { q: 'Do you target Spain, Latin America, or both?', a: 'Both, and we adjust the mix based on where your actual customers are — tell us your target region when requesting a quote and we\u2019ll weight placements accordingly.' },
    tags: ['forum links', 'crowd marketing', 'spanish backlinks', 'community links', 'link building', 'Spain & LatAm SEO'],
  },
  german: {
    label: 'German',
    metaTitle: 'German Crowd Marketing Service — DACH Forum Links | Vladenza',
    metaDescription: 'German-language crowd links across forums and communities in the DACH region (Germany, Austria, Switzerland). Quality-first, native placements.',
    heroDesc: 'We build forum and community links on German-language platforms across the DACH region — a smaller but notably high-quality, well-moderated market.',
    marketNote: 'German-language forums are known for strict moderation and lower placement volume than English — we prioritize quality and acceptance rate over raw count here.',
    intro: 'German-language communities are more tightly moderated than English or Spanish forums, which means lower placement volume but a genuinely higher bar for what gets accepted and stays live. For DACH-region brands, this translates into fewer but more durable, higher-trust mentions.',
    body: [
      'Because German forum moderation is stricter, we allocate more time per placement — contributions are written to add real value to the discussion, which is what keeps them from being removed. This is not a high-volume package by design.',
      'Pair this with [niche edits](/services/niche-edits) on established German publications for a stronger overall profile — see the [full Crowd Marketing service](/services/crowd-links) for combined options.',
    ],
    extraFaq: { q: 'Why is the German package lower volume than English?', a: 'German-language forums are fewer in number and more strictly moderated than English-language communities, so we intentionally prioritize placements that survive review over hitting a specific volume target.' },
    tags: ['forum links', 'crowd marketing', 'german backlinks', 'DACH SEO', 'link building', 'community links'],
  },
  french: {
    label: 'French',
    metaTitle: 'French Crowd Marketing Service — Forum Links (France & Francophone) | Vladenza',
    metaDescription: 'French-language crowd links across forums and communities in France, Belgium, and Quebec. Native placements, manually reviewed.',
    heroDesc: 'We build forum and community links on French-language platforms across France, Belgium, and Quebec.',
    marketNote: 'Covers metropolitan France as well as Belgian and Quebec French-speaking communities, which have distinct platforms and tone from each other.',
    intro: 'French-language crowd marketing spans several genuinely distinct markets — France, French-speaking Belgium, and Quebec — each with its own community platforms and conversational tone. We don\u2019t treat these as interchangeable.',
    body: [
      'Placements are matched to the right regional community rather than dropped into the largest French forum regardless of fit — a Quebec-focused brand and a Paris-focused brand need different placement strategies even in the same language.',
      'Combine with [guest posting](/services/guest-posting) on French-language sites for fuller coverage — see the [full Crowd Marketing service](/services/crowd-links) for details.',
    ],
    extraFaq: { q: 'Can you focus specifically on Quebec instead of France?', a: 'Yes — tell us your target region (France, Belgium, or Quebec) when requesting a quote and we\u2019ll weight the community mix toward it.' },
    tags: ['forum links', 'crowd marketing', 'french backlinks', 'community links', 'link building', 'francophone SEO'],
  },
  portuguese: {
    label: 'Portuguese (Brazil)',
    metaTitle: 'Brazilian Portuguese Crowd Marketing Service — Forum Links | Vladenza',
    metaDescription: 'Brazilian Portuguese crowd links across forums and communities. One of the fastest-growing digital markets, native placement.',
    heroDesc: 'We build forum and community links on Brazilian Portuguese-language platforms — one of the fastest-growing, most digitally active markets we serve.',
    marketNote: 'Brazil has one of the largest, most active online communities in the world — high engagement, but also high competition for attention.',
    intro: 'Brazilian online communities are exceptionally large and active, which means genuine opportunity for brand visibility — but also real competition for attention inside those threads. Generic or templated contributions get ignored fast.',
    body: [
      'Placements are written by contributors fluent in Brazilian Portuguese (distinct from European Portuguese in vocabulary and tone) and matched to communities where engagement is genuinely high, not just follower counts.',
      'Works well paired with [niche edits](/services/niche-edits) on Brazilian publications — see the [full Crowd Marketing service](/services/crowd-links) for combined packages.',
    ],
    extraFaq: { q: 'Is this Brazilian Portuguese or European Portuguese?', a: 'Brazilian Portuguese by default, since that is by far the larger market — let us know if you specifically need European Portuguese (Portugal) placements instead.' },
    tags: ['forum links', 'crowd marketing', 'brazilian backlinks', 'community links', 'link building', 'Brazil SEO'],
  },
  korean: {
    label: 'Korean',
    metaTitle: 'Korean Crowd Marketing Service — Naver Cafe & Community Links | Vladenza',
    metaDescription: 'Korean-language crowd links across Naver Cafe communities and Korean online forums. A specialized market few link building agencies cover.',
    heroDesc: 'We build community links within the Korean online ecosystem, including Naver Cafe communities — platforms most Western link building agencies don\u2019t operate in at all.',
    marketNote: 'The Korean web runs on a different set of platforms than the rest of the world (Naver-centric rather than Google/Reddit-centric) — this is a specialized, less commoditized capability.',
    intro: 'Korea\u2019s online ecosystem is structured differently from most Western markets — Naver, not Google, dominates search and community behavior, and Naver Cafe communities function much like forums do elsewhere. Most link building vendors simply don\u2019t operate here, which is exactly why it\u2019s worth doing properly if you\u2019re targeting this market.',
    body: [
      'Because this is a more specialized capability with a smaller contributor pool than English or Spanish, turnaround and available volume are more limited — we\u2019ll confirm realistic timelines at the quote stage rather than promise a fixed schedule upfront.',
      'For brands seriously targeting the Korean market, this is best combined with [guest posting](/services/guest-posting) on Korean publications — see the [full Crowd Marketing service](/services/crowd-links) for the complete picture.',
    ],
    extraFaq: { q: 'Is this different from your other language packages?', a: 'Yes — Korean placements run through Naver Cafe communities rather than the Reddit/forum-style platforms we use for English, Spanish, German, and French, since that\u2019s where Korean online discussion actually happens.' },
    tags: ['forum links', 'crowd marketing', 'korean backlinks', 'naver cafe', 'link building', 'community links'],
  },
};

const packages = [
  { name: 'Basic', links: '30 Links', domains: '30 unique domains', price: '$290', priceNote: '$9.67 per link', desc: 'Entry-level presence in this language market — good for testing before scaling up.', advantages: ['30 unique-domain placements', 'Manual review of every link', 'Delivered in 5–10 days'], highlight: false, popular: false },
  { name: 'Standard', links: '60 Links', domains: '60 unique domains', price: '$520', priceNote: '$8.67 per link', desc: 'Consistent presence across primary communities in this market — our most popular volume.', advantages: ['60 unique-domain placements', 'Manual review of every link', 'Detailed reporting with anchors', 'Replacement guarantee'], highlight: true, popular: true },
  { name: 'Powerful', links: '120 Links', domains: '120 unique domains', price: '$940', priceNote: '$7.83 per link', desc: 'High-volume coverage for competitive campaigns needing strong profile diversification.', advantages: ['120 unique-domain placements', 'Manual review of every link', 'Priority delivery scheduling', 'Detailed reporting with anchors', 'Replacement guarantee'], highlight: false, popular: false },
];

export default function CrowdLinksLanguagePage() {
  const { language } = useParams<{ language: string }>();
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const data = language ? LANGUAGE_DATA[language] : undefined;

  if (!data) {
    return <Navigate to="/services/crowd-links" replace />;
  }

  useSEO({
    title: data.metaTitle,
    description: data.metaDescription,
    canonical: `https://vladenza.com/services/crowd-links/${language}`,
  });

  return (
    <ServicePageLayout defaultService={`Crowd Links — ${data.label}`}>
      {/* Hero — service description */}
      <section className="relative overflow-hidden py-20 lg:py-24" style={{ background: 'linear-gradient(160deg, #fff7f0 0%, #ffffff 60%)' }}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F97316]/20 bg-[#F97316]/8 text-[#F97316] text-xs font-semibold mb-6 tracking-wide uppercase">
              <Globe2 size={12} />
              Crowd Links — {data.label}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-[1.08] tracking-tight mb-6">
              We Build {data.label} Forum<br />
              <span className="text-[#F97316]">& Community Links</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-4 max-w-xl">{data.heroDesc}</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xl">{data.marketNote}</p>
            <a href="#packages" className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md">
              View Packages <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* 3 packages with descriptions and advantages */}
      <section id="packages" className="py-16 bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">{data.label} crowd link packages</h2>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">Choose the volume that fits your campaign — every tier gets the same manual-quality delivery.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative rounded-2xl border overflow-hidden flex flex-col ${pkg.highlight ? 'bg-[#F97316] border-[#F97316] shadow-2xl shadow-orange-500/20 scale-[1.02]' : 'bg-[#161616] border-white/10'}`}
              >
                {pkg.popular && (
                  <div className="bg-white/15 text-white text-[10px] font-black uppercase tracking-widest text-center py-2.5 border-b border-white/20">★ Most Popular</div>
                )}
                <div className="p-7 flex flex-col flex-1">
                  <div className="mb-5">
                    <h3 className="text-xl font-black text-white mb-1">{pkg.name}</h3>
                    <span className={`text-sm font-semibold ${pkg.highlight ? 'text-white/90' : 'text-[#F97316]'}`}>{pkg.domains}</span>
                  </div>
                  <div className="mb-1"><span className="text-4xl font-black text-white">{pkg.price}</span></div>
                  <div className={`text-xs mb-5 ${pkg.highlight ? 'text-orange-100' : 'text-gray-500'}`}>{pkg.priceNote} · one-time payment</div>
                  <div className={`h-px mb-5 ${pkg.highlight ? 'bg-white/25' : 'bg-white/8'}`} />
                  <p className={`text-sm leading-relaxed mb-5 ${pkg.highlight ? 'text-white/80' : 'text-gray-400'}`}>{pkg.desc}</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {pkg.advantages.map((a) => (
                      <li key={a} className={`flex items-start gap-2 text-xs ${pkg.highlight ? 'text-white/85' : 'text-gray-300'}`}>
                        <CheckCircle size={13} className="flex-shrink-0 mt-0.5" />
                        {a}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setSelectedPkg(pkg)}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${pkg.highlight ? 'bg-white text-[#F97316] hover:bg-gray-50' : 'bg-[#F97316] hover:bg-[#EA580C] text-white'}`}
                  >
                    Order Now <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews — cards linking out to verify */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Don't just take our word for it</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">See real, verified reviews directly on each platform.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REVIEW_PLATFORMS.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gray-50 border border-gray-200 hover:border-[#F97316] rounded-xl p-5 flex flex-col items-center text-center transition-colors"
              >
                <PlatformIcon domain={p.domain} name={p.name} size={28} />
                <div className="text-sm font-semibold text-gray-900 mt-3">{p.name}</div>
                <div className="flex gap-px my-1.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} style={{ fill: p.accent, color: p.accent }} />)}
                </div>
                <div className="text-xs text-gray-400 mb-3">{p.score} · {p.reviewCount}</div>
                <span className="text-xs font-semibold text-[#F97316] flex items-center gap-1 group-hover:gap-1.5 transition-all">
                  View Reviews <ArrowRight size={11} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Long-form content + FAQ */}
      <ServiceSeoBlock
        heading={`${data.label} crowd links: natural community signals`}
        intro={data.intro}
        body={data.body}
        faqs={[
          { q: 'What are crowd links?', a: 'Crowd links are backlinks and brand mentions placed within forums, Q&A platforms, and online communities as part of natural, helpful discussion — a technique often called crowd marketing.' },
          { q: 'Are crowd links safe for SEO?', a: 'Yes. Because they are placed as genuine contributions from aged accounts across many platforms, they create a natural, diversified signal rather than a spammy footprint.' },
          data.extraFaq,
          { q: 'How soon will I see results?', a: 'Results are typically visible within 2–3 weeks of delivery, though this varies by niche competitiveness.' },
        ]}
      />

      {/* Tags */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide mr-1">Related:</span>
            {data.tags.map((tag) => (
              <span key={tag} className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-600">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {selectedPkg && (
        <OrderModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />
      )}
    </ServicePageLayout>
  );
}
