import { useState } from 'react';
import {
  Eye, AlertTriangle, ArrowRight, CheckCircle, XCircle, ChevronDown, ChevronUp,
  Monitor, Smartphone, BarChart2, Globe, Link2, FileText, Layers, Search, Zap,
  TrendingUp, MapPin, Clock, Target, AlertCircle, Info
} from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import { useSEO } from '../hooks/useSEO';

// ─── helpers ────────────────────────────────────────────────────────────────

function Badge({ color, children }: { color: 'red' | 'orange' | 'green' | 'blue' | 'gray'; children: React.ReactNode }) {
  const map = {
    red: 'bg-red-50 text-red-600 border-red-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    gray: 'bg-gray-100 text-gray-500 border-gray-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${map[color]}`}>
      {children}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#F97316] text-xs font-semibold uppercase tracking-wide mb-4">
      {children}
    </div>
  );
}

function IssueCard({
  severity, title, children,
}: { severity: 'critical' | 'warning' | 'info'; title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const cfg = {
    critical: { bg: 'bg-red-50 border-red-200', icon: <XCircle size={15} className="text-red-500 flex-shrink-0" />, badge: <Badge color="red">Critical</Badge> },
    warning: { bg: 'bg-orange-50 border-orange-100', icon: <AlertTriangle size={15} className="text-orange-500 flex-shrink-0" />, badge: <Badge color="orange">Warning</Badge> },
    info: { bg: 'bg-blue-50 border-blue-100', icon: <Info size={15} className="text-blue-500 flex-shrink-0" />, badge: <Badge color="blue">Opportunity</Badge> },
  }[severity];

  return (
    <div className={`rounded-xl border ${cfg.bg} overflow-hidden`}>
      <button
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
        onClick={() => setOpen(v => !v)}
      >
        {cfg.icon}
        <span className="flex-1 text-sm font-semibold text-gray-900">{title}</span>
        {cfg.badge}
        {open ? <ChevronUp size={14} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-black/5 text-sm text-gray-600 leading-relaxed space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

function Rec({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 bg-white/70 rounded-lg px-3 py-2.5 border border-black/5">
      <ArrowRight size={13} className="text-[#F97316] mt-0.5 flex-shrink-0" />
      <span className="text-sm text-gray-700 leading-snug">{children}</span>
    </div>
  );
}

function MetricRow({ label, value, sub, status }: { label: string; value: string; sub?: string; status?: 'good' | 'warn' | 'bad' }) {
  const dot = status === 'good' ? 'bg-green-500' : status === 'warn' ? 'bg-orange-400' : status === 'bad' ? 'bg-red-500' : 'bg-gray-300';
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2.5">
        {status && <span className={`w-2 h-2 rounded-full ${dot} flex-shrink-0`} />}
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-gray-900">{value}</div>
        {sub && <div className="text-xs text-gray-400">{sub}</div>}
      </div>
    </div>
  );
}

// ─── keyword tier data ───────────────────────────────────────────────────────

const tiers = [
  {
    tier: 'Tier 1',
    label: 'Core Brand Keywords',
    desc: 'Highest volume, build first — establish the main service offering in the primary city.',
    color: 'bg-red-50 border-red-200 text-red-700',
    dotColor: 'bg-red-500',
    keywords: [
      'handyman [city]', 'handyman services [city]', 'handyman near me [city]',
      'local handyman [city]', 'handyman GTA', 'same day handyman [city]',
      'affordable handyman [city]', 'handyman for hire [city]', 'handyman condo [city]',
    ],
  },
  {
    tier: 'Tier 2',
    label: 'Service Keywords',
    desc: 'Target after Tier 1 is moving — capture specific service demand across all verticals.',
    color: 'bg-orange-50 border-orange-200 text-orange-700',
    dotColor: 'bg-orange-400',
    keywords: [
      'tv mounting [city]', 'tv wall mount installation [city]', 'furniture assembly [city]',
      'IKEA assembly [city]', 'drywall repair [city]', 'drywall patching [city]',
      'painting services [city]', 'interior painting [city]', 'plumbing services [city]',
      'faucet repair [city]', 'drain cleaning [city]', 'ceiling fan installation [city]',
      'light fixture installation [city]', 'pot light installation [city]',
      'caulking services [city]', 'bathroom caulking [city]', 'pest proofing [city]',
    ],
  },
  {
    tier: 'Tier 3',
    label: 'Location Keywords',
    desc: 'Expand reach into surrounding areas once primary city is ranking.',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    dotColor: 'bg-blue-400',
    keywords: [
      'handyman [area-1]', 'handyman services [area-1]', 'handyman [area-2]',
      'handyman services [area-2]', 'handyman [area-3]', 'handyman [area-4]',
      'handyman [area-5]', 'handyman near me [area-1]', 'handyman near me [area-2]',
    ],
  },
  {
    tier: 'Tier 4',
    label: 'Service + Location (Phase 2)',
    desc: 'Dedicated landing pages combining service + area for high-intent local queries.',
    color: 'bg-green-50 border-green-200 text-green-700',
    dotColor: 'bg-green-500',
    keywords: [
      'drywall repair [area]', 'tv mounting [area]', 'furniture assembly [area]',
      'IKEA assembly [area]', 'ceiling fan installation [area]',
      'drain cleaning [area]', 'pest proofing [area]', 'light fixture installation [area]',
    ],
  },
  {
    tier: 'Tier 5',
    label: 'Long-tail / High Intent',
    desc: 'Conversion-focused queries that indicate purchase intent — add via blog and FAQ.',
    color: 'bg-gray-100 border-gray-200 text-gray-700',
    dotColor: 'bg-gray-400',
    keywords: [
      'how much does tv mounting cost [city]', 'how much does drywall repair cost [city]',
      'IKEA furniture assembly cost [city]', 'same day handyman service [city]',
      'handyman for condo repairs [city]', 'best handyman [city]',
      'licensed handyman [city]', 'insured handyman [city]',
      'can a handyman do electrical work [city]', 'handyman for small jobs [city]',
    ],
  },
];

// ─── site structure data ─────────────────────────────────────────────────────

const siloGroups = [
  {
    label: 'Core Service Hubs',
    num: '9 pages',
    items: ['/tv-mounting/', '/furniture-assembly/', '/drywall/', '/painting/', '/plumbing/', '/electrical/', '/repairs/', '/caulking/', '/pest-proofing/'],
  },
  {
    label: 'Sub-service Pages',
    num: '29 pages',
    items: [
      '/tv-mounting/above-fireplace/', '/tv-mounting/outdoor/', '/tv-mounting/condo/',
      '/furniture-assembly/ikea/', '/furniture-assembly/wayfair/', '/furniture-assembly/structube/',
      '/drywall/hole-patching/', '/drywall/ceiling-repair/', '/drywall/installation/',
      '/painting/interior/', '/painting/exterior/',
      '/plumbing/faucet-repair/', '/plumbing/toilet-repair/', '/plumbing/drain-cleaning/',
      '/plumbing/showerhead-installation/', '/plumbing/sink-installation/', '/plumbing/leak-repair/',
      '/electrical/light-fixture-installation/', '/electrical/ceiling-fan-installation/', '/electrical/pot-light-installation/',
      '/repairs/door-repair/', '/repairs/cabinet-repair/',
      '/caulking/bathroom-caulking/', '/caulking/kitchen-caulking/',
      '/pest-proofing/door-gap-sealing/', '/pest-proofing/crack-and-hole-repair/',
      '/pest-proofing/window-sealing/', '/pest-proofing/baseboard-sealing/', '/pest-proofing/plumbing-gap-sealing/',
    ],
  },
  {
    label: 'Location Hubs',
    num: '10 pages',
    items: ['/locations/', '/[city]-handyman-services/', '/[area1]-handyman-services/', '/[area2]-handyman-services/', '/[area3]-handyman-services/', '/[area4]-handyman-services/', '/[area5]-handyman-services/', '/[area6]-handyman-services/', '/[area7]-handyman-services/', '/[area8]-handyman-services/'],
  },
  {
    label: 'Service + Location Pages (Phase 2)',
    num: '26 pages',
    items: [
      '/drywall/[city]/', '/drywall/[area1]/', '/drywall/[area2]/', '/drywall/[area3]/', '/drywall/[area4]/',
      '/tv-mounting/[city]/', '/tv-mounting/[area1]/', '/tv-mounting/[area2]/', '/tv-mounting/[area3]/',
      '/furniture-assembly/[city]/', '/furniture-assembly/[area1]/', '/furniture-assembly/[area2]/',
      '/electrical/[city]/', '/electrical/[area1]/', '/electrical/[area2]/',
      '/plumbing/[city]/', '/plumbing/[area1]/', '/plumbing/[area2]/',
      '/plumbing/drain-cleaning/[city]/', '/plumbing/drain-cleaning/[area1]/', '/plumbing/drain-cleaning/[area2]/',
      '/pest-proofing/[city]/', '/pest-proofing/[area1]/', '/pest-proofing/[area2]/', '/pest-proofing/[area3]/',
    ],
  },
  {
    label: 'Blog Posts',
    num: '11 pages',
    items: [
      '/blog/tv-mounting-cost-[city]/', '/blog/ikea-assembly-[city]/', '/blog/drywall-repair-cost-[city]/',
      '/blog/ceiling-fan-installation-[city]/', '/blog/handyman-vs-contractor-[city]/',
      '/blog/condo-handyman-rules-[city]/', '/blog/tv-mounting-height-guide/',
      '/blog/home-maintenance-checklist/', '/blog/how-to-pest-proof-your-condo/',
      '/blog/seasonal-pest-prevention/', '/blog/drain-cleaning-vs-drain-repair/',
    ],
  },
  {
    label: 'Static Pages',
    num: '9 pages',
    items: ['/', '/services/', '/locations/', '/contact/', '/faq/', '/blog/', '/hiring/', '/about/', '/reviews/'],
  },
];

// ─── link building plan ──────────────────────────────────────────────────────

const linkPlan = [
  { month: 'Month 1–2', phase: 'Foundation', desc: 'Build a natural base: niche directories, local citations, profile links. Establish the brand footprint before adding editorial links.', links: '15–20', type: 'Directories + Citations', dr: 'DR 10–30' },
  { month: 'Month 2–3', phase: 'Contextual Base', desc: 'Start contextual placements: niche-relevant link insertions and guest posts on DR 30–50 sites. Mix 1 strong link per 3–4 medium ones.', links: '20–30', type: 'Link Insertions + Guest Posts', dr: 'DR 30–50' },
  { month: 'Month 3–4', phase: 'Scale & Diversify', desc: 'Increase volume, add crowd links and forum mentions for natural profile diversity. Support location pages with geo-relevant placements.', links: '30–40', type: 'Mixed profile', dr: 'DR 30–60' },
  { month: 'Month 5–6', phase: 'Authority Push', desc: 'Introduce stronger placements (DR 50–70) for priority service pages. Continue supporting new Service + Location pages from Phase 2.', links: '30–40', type: 'Guest Posts + Insertions', dr: 'DR 50–70' },
];

// ─── component ───────────────────────────────────────────────────────────────

export default function SeoAuditSamplePage() {
  const [openTier, setOpenTier] = useState<number | null>(0);

  useSEO({
    title: 'SEO Audit Sample Report — Website Analysis & Growth Plan | Vladenza',
    description: 'See what a full Vladenza SEO audit looks like: UX review, technical findings, site structure plan, keyword strategy, competitor analysis, and a 6-month link building roadmap.',
    canonical: 'https://vladenza.com/seo-audit-sample',
  });

  return (
    <ServicePageLayout defaultService="SEO Audit">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 lg:py-24" style={{ background: 'linear-gradient(160deg, #fff7f0 0%, #ffffff 60%)' }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <circle cx="1200" cy="100" r="380" fill="none" stroke="#F97316" strokeWidth="1.5" opacity="0.1"/>
          <circle cx="1200" cy="100" r="250" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.12"/>
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
              <circle key={`h-${row}-${col}`} cx={col * 44 + 20} cy={row * 44 + 200} r="2.5" fill="#F97316" opacity={0.07 + col * 0.012} />
            ))
          )}
        </svg>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F97316]/20 bg-[#F97316]/8 text-[#F97316] text-xs font-semibold mb-6 tracking-wide uppercase">
              <FileText size={12} />
              Sample Audit Report
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold text-gray-900 leading-[1.08] tracking-tight mb-5">
              What a Full SEO Audit<br />
              <span className="text-[#F97316]">Looks Like in Practice</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-2xl">
              This is a real-structure audit we produced for a local services business — domain and niche references removed. It covers UX & conversion issues, on-page findings, site architecture, keyword strategy, competitor insights, and a 6-month link building plan.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              {['Visual & UX review', 'On-page findings', 'Site structure plan', 'Keyword tiers', 'Link building roadmap'].map(t => (
                <div key={t} className="flex items-center gap-1.5 bg-white border border-gray-200 px-3.5 py-1.5 rounded-full text-gray-600">
                  <CheckCircle size={12} className="text-[#F97316]" /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Score banner ─────────────────────────────────────────────────── */}
      <section className="bg-gray-950 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
            {[
              { label: 'Critical Issues', value: '5', sub: 'need immediate fix', color: 'text-red-400' },
              { label: 'Warnings', value: '9', sub: 'medium priority', color: 'text-orange-400' },
              { label: 'Opportunities', value: '12', sub: 'growth potential', color: 'text-blue-400' },
              { label: 'Pages in Plan', value: '~94', sub: 'after restructure', color: 'text-green-400' },
            ].map(m => (
              <div key={m.label} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                <div className={`text-3xl font-black mb-1 ${m.color}`}>{m.value}</div>
                <div className="text-white text-sm font-semibold mb-0.5">{m.label}</div>
                <div className="text-gray-500 text-xs">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Visual & UX Review ───────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionLabel><Eye size={11} /> Visual & UX Review</SectionLabel>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">First impressions & conversion flow</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-2xl">
            Design directly impacts bounce rate, CTR, and time-on-site. These are the UX issues that damage conversions before a user even reads a word of content.
          </p>

          <div className="flex flex-col gap-3">
            <IssueCard severity="critical" title="Hero section has no clear value proposition within 3 seconds">
              <p>Generic headline ("Quality Service") communicates nothing about what is offered, where, or why to choose this business. Rotating service blocks create visual noise and prevent any single message from landing.</p>
              <p className="font-semibold text-gray-800 mt-2">The hero should follow one simple formula:</p>
              <div className="bg-gray-900 text-green-300 rounded-lg px-4 py-3 font-mono text-xs">[What you do] + [Where you operate] + [Key benefit]</div>
              <div className="space-y-2 mt-3">
                <Rec>Replace rotating services with a single static headline targeting the primary city</Rec>
                <Rec>Add one prominent CTA ("Get a Quote" or "Call Now") with a clickable phone number</Rec>
                <Rec>Integrate trust signals (Google Reviews count + stars, "Licensed & Insured", years in business) directly into the first screen</Rec>
                <Rec>Move "View All Services" to a single button — remove the per-service rotating block</Rec>
              </div>
            </IssueCard>

            <IssueCard severity="critical" title="Top banner wastes prime real estate — communicates no value">
              <p>The current banner uses this space without delivering any message that drives user action. Most users read this area before anything else.</p>
              <div className="space-y-2">
                <Rec>Highlight the service areas (cities covered)</Rec>
                <Rec>Add a value proposition or offer (e.g., same-day service, fast response)</Rec>
                <Rec>Use a simple promo or trust indicator (e.g., "5★ rated · Licensed & Insured")</Rec>
              </div>
            </IssueCard>

            <IssueCard severity="critical" title="Conversion flow broken — CTA leaves the domain">
              <p>The current path is: Homepage → Contact page → Third-party external domain (form). This three-step flow with a domain change destroys trust and conversion rate.</p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 font-mono">
                yoursite.com → yoursite.com/contact → externaltool.com/form
              </div>
              <p className="mt-2">Users who leave your domain rarely return. The external form feels like a phishing redirect to untrusted visitors.</p>
              <div className="space-y-2">
                <Rec>Embed the quote/booking form directly on the homepage and /contact page</Rec>
                <Rec>Eliminate all redirects off-domain for primary CTAs</Rec>
                <Rec>Make the form visible without scrolling on desktop — above the fold wherever possible</Rec>
              </div>
            </IssueCard>

            <IssueCard severity="warning" title="Trust signals present but not visible in the first screen">
              <p>30+ Google reviews exist but are not shown with the Google logo, star rating, or review count in the hero. Users don't see this until they scroll well past the first screen — most never do.</p>
              <div className="space-y-2">
                <Rec>Add "30+ Google Reviews" with the Google logo and star rating to the hero section</Rec>
                <Rec>Integrate review count into the CTA area or directly below the headline</Rec>
              </div>
            </IssueCard>

            <IssueCard severity="warning" title="Services section is too large and hard to scan">
              <p>Repeating the service name in the card description creates redundancy. Large, text-heavy cards slow down scanning and reduce the likelihood of users clicking through to a specific service.</p>
              <div className="space-y-2">
                <Rec>Reduce card size — service name + icon + single short phrase is enough</Rec>
                <Rec>Remove descriptions that restate the service name</Rec>
                <Rec>Add a direct link or "Book" CTA on each card</Rec>
              </div>
            </IssueCard>

            <IssueCard severity="warning" title="Trust/stats block is placed too low on the page">
              <p>Numbers like "X years in business" or "Y jobs completed" carry significant conversion weight, but only if users see them. Most visitors never scroll past the third screen.</p>
              <div className="space-y-2">
                <Rec>Move the stats block to immediately below the hero section</Rec>
                <Rec>Or integrate the key numbers directly into the hero (e.g., "500+ jobs · 5★ rated · Since 2018")</Rec>
              </div>
            </IssueCard>

            <IssueCard severity="warning" title="WhatsApp section takes a full screen for a single-button action">
              <p>A full-page section dedicated only to a WhatsApp link is disproportionate. This space can be used for higher-value content.</p>
              <div className="space-y-2">
                <Rec>Replace with a sticky floating WhatsApp/chat button visible on all pages</Rec>
                <Rec>Or add it as a secondary option inside the contact form</Rec>
                <Rec>Use the reclaimed space for an FAQ section or additional trust content</Rec>
              </div>
            </IssueCard>

            <IssueCard severity="info" title="Location block is visual only — no SEO or conversion value">
              <p>The service area map is a good UX element but currently functions only as a graphic. Clicking on a location leads to an unrelated page or produces no result.</p>
              <div className="space-y-2">
                <Rec>Replace or supplement with clickable location links using keyword-focused anchor text (e.g., "Handyman Services in [Area]")</Rec>
                <Rec>Move a simple location list to the footer — reserve page real estate for content with higher conversion value</Rec>
                <Rec>Build dedicated location pages with proper keyword targeting (see Site Structure section)</Rec>
              </div>
            </IssueCard>

            <IssueCard severity="info" title="No real photos — stock-only visuals reduce trust for a local service">
              <p>Competitors who use authentic photos of real work, team members, and project outcomes consistently outperform stock-image sites on trust metrics and conversion rate.</p>
              <div className="space-y-2">
                <Rec>Add before/after project photos to service pages and the homepage</Rec>
                <Rec>Include at least one photo of the team or operator to humanize the brand</Rec>
                <Rec>Geo-tag images where possible — this supports local SEO signals</Rec>
              </div>
            </IssueCard>
          </div>
        </div>
      </section>

      {/* ── On-Page ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <SectionLabel><FileText size={11} /> On-Page SEO</SectionLabel>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Title, H1, and meta findings</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-2xl">
            On-page signals are the clearest ranking inputs. These issues directly affect how search engines understand and index each page.
          </p>

          <div className="flex flex-col gap-3">
            <IssueCard severity="critical" title="Meta title exceeds character limit — truncated in SERPs">
              <p>The homepage title is too long and gets cut off in Google search results. Truncated titles lose keyword visibility and reduce click-through rate.</p>
              <div className="space-y-2">
                <Rec>Keep titles under 60 characters (ideally 50–58) to ensure full display</Rec>
                <Rec>Structure: Primary Keyword — Secondary Keyword | Brand Name</Rec>
                <Rec>Audit all service and location pages for the same issue — rewrite as part of restructure</Rec>
              </div>
            </IssueCard>

            <IssueCard severity="critical" title="H1 headings are weak or don't reflect the target keyword">
              <p>Many pages have H1s that don't match the primary keyword for that page. On some pages, it's unclear what the core offer is from the H1 alone. This reduces page relevance signals for Google.</p>
              <div className="space-y-2">
                <Rec>Every page must have exactly one H1 that contains the primary keyword</Rec>
                <Rec>Format: "[Service] in [City]" for service/location pages</Rec>
                <Rec>After site restructure — audit and rewrite all H1s as a batch task</Rec>
              </div>
            </IssueCard>

            <IssueCard severity="warning" title="No FAQ section — low structured content depth">
              <p>There is currently insufficient structured content for Google (and AI-driven results) to fully understand the site's topical relevance. FAQ sections serve dual purpose: user value and keyword coverage for long-tail queries.</p>
              <div className="space-y-2">
                <Rec>Add an FAQ to the homepage covering: pricing ranges, service areas, types of services, process, timelines</Rec>
                <Rec>Add service-specific FAQs to each service page</Rec>
                <Rec>Use FAQ schema markup to increase chances of rich snippet display</Rec>
              </div>
            </IssueCard>

            <IssueCard severity="warning" title="PageSpeed is in the orange zone — needs optimization">
              <p>Not the most critical issue, but PageSpeed affects both ranking (Core Web Vitals) and user experience. The competitor has worse scores and still ranks — so structure and content outweigh speed at this stage.</p>
              <div className="space-y-2">
                <Rec>Compress and convert images to WebP format</Rec>
                <Rec>Enable caching and use a CDN</Rec>
                <Rec>Defer non-critical JavaScript</Rec>
                <Rec>Address speed after core structure and content work is complete</Rec>
              </div>
            </IssueCard>
          </div>

          {/* Speed metrics visual */}
          <div className="mt-8 grid md:grid-cols-2 gap-5">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Monitor size={15} className="text-[#F97316]" />
                <span className="text-sm font-semibold text-gray-900">Desktop PageSpeed</span>
                <Badge color="orange">Orange Zone</Badge>
              </div>
              <MetricRow label="Performance" value="62 / 100" status="warn" />
              <MetricRow label="LCP" value="3.4s" sub="target: &lt;2.5s" status="warn" />
              <MetricRow label="CLS" value="0.12" sub="target: &lt;0.1" status="warn" />
              <MetricRow label="FID / INP" value="180ms" sub="target: &lt;100ms" status="bad" />
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Smartphone size={15} className="text-[#F97316]" />
                <span className="text-sm font-semibold text-gray-900">Mobile PageSpeed</span>
                <Badge color="red">Needs Work</Badge>
              </div>
              <MetricRow label="Performance" value="41 / 100" status="bad" />
              <MetricRow label="LCP" value="5.1s" sub="target: &lt;2.5s" status="bad" />
              <MetricRow label="CLS" value="0.08" sub="target: &lt;0.1" status="good" />
              <MetricRow label="FID / INP" value="310ms" sub="target: &lt;100ms" status="bad" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Site Structure ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionLabel><Layers size={11} /> Site Structure Plan</SectionLabel>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">The full silo architecture</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-4 max-w-2xl">
            The current site has service pages and location pages, but they operate in isolation. The recommended structure adds a third layer — Service + Location pages — and connects everything through proper internal linking.
          </p>

          {/* Internal linking diagram */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Internal linking model</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center text-sm">
              <div className="bg-white border-2 border-[#F97316] rounded-xl px-5 py-4 shadow-sm w-40">
                <div className="text-xs text-gray-400 mb-1">Hub</div>
                <div className="font-bold text-gray-900">/service/</div>
                <div className="text-xs text-gray-500 mt-1">links to all locations</div>
              </div>
              <ArrowRight size={16} className="text-gray-300 rotate-90 md:rotate-0 flex-shrink-0" />
              <div className="bg-white border-2 border-blue-300 rounded-xl px-5 py-4 shadow-sm w-48">
                <div className="text-xs text-gray-400 mb-1">Landing page</div>
                <div className="font-bold text-gray-900">/service/[city]/</div>
                <div className="text-xs text-gray-500 mt-1">links back to hub & location</div>
              </div>
              <ArrowRight size={16} className="text-gray-300 rotate-90 md:rotate-0 flex-shrink-0" />
              <div className="bg-white border-2 border-green-300 rounded-xl px-5 py-4 shadow-sm w-40">
                <div className="text-xs text-gray-400 mb-1">Hub</div>
                <div className="font-bold text-gray-900">/[city]/</div>
                <div className="text-xs text-gray-500 mt-1">links to all services</div>
              </div>
            </div>
          </div>

          {/* Silo groups */}
          <div className="grid md:grid-cols-2 gap-5 mb-8">
            {siloGroups.map(group => (
              <div key={group.label} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-900">{group.label}</span>
                  <Badge color="gray">{group.num}</Badge>
                </div>
                <div className="flex flex-col gap-1">
                  {group.items.slice(0, 6).map(item => (
                    <div key={item} className="text-xs text-gray-500 font-mono bg-white border border-gray-100 rounded px-2 py-1">{item}</div>
                  ))}
                  {group.items.length > 6 && (
                    <div className="text-xs text-gray-400 px-2 pt-1">+{group.items.length - 6} more…</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Page count summary */}
          <div className="bg-gray-950 rounded-2xl p-7">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">Total page count after restructure</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Service Hubs', n: '9' },
                { label: 'Sub-service', n: '29' },
                { label: 'Location Pages', n: '10' },
                { label: 'Svc + Location', n: '26' },
                { label: 'Blog Posts', n: '11' },
                { label: 'Static Pages', n: '9' },
              ].map(c => (
                <div key={c.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-black text-white mb-1">{c.n}</div>
                  <div className="text-xs text-gray-400">{c.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-gray-400 text-sm">Total pages after Phase 1 + 2</span>
              <span className="text-white font-black text-xl">~94</span>
            </div>
            <div className="mt-4 bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-3">
              <p className="text-orange-300 text-xs leading-relaxed">
                <strong>Note:</strong> Two 301 redirects needed on launch — existing ranking URLs must redirect to new canonical paths to preserve all accumulated authority.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Keyword Strategy ─────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <SectionLabel><Target size={11} /> Keyword Strategy</SectionLabel>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">5-tier keyword framework</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-4 max-w-2xl">
            Since the site is at an early stage, starting with every keyword at once would spread link equity too thin and produce no visible results. The correct approach is sequential: build authority tier by tier.
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-5 py-4 mb-10 flex items-start gap-3">
            <AlertCircle size={15} className="text-orange-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-orange-800 leading-relaxed">
              Trying to rank broad, competitive service clusters immediately requires a large number of links per page. It is more efficient to focus on smaller, precise clusters first, build rankings, then expand. Each page and keyword needs its own weight and support.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {tiers.map((tier, i) => (
              <div key={tier.tier} className={`rounded-xl border overflow-hidden ${tier.color}`}>
                <button
                  className="w-full flex items-center gap-3 px-5 py-4 text-left"
                  onClick={() => setOpenTier(openTier === i ? null : i)}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${tier.dotColor} flex-shrink-0`} />
                  <span className="text-sm font-bold text-gray-900 flex-1">{tier.tier} — {tier.label}</span>
                  <span className="text-xs text-gray-500 hidden sm:block">{tier.keywords.length} keyword clusters</span>
                  {openTier === i ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                </button>
                {openTier === i && (
                  <div className="px-5 pb-5 pt-1 border-t border-black/5">
                    <p className="text-sm text-gray-600 mb-4">{tier.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {tier.keywords.map(kw => (
                        <span key={kw} className="bg-white/80 border border-black/10 rounded-lg px-3 py-1.5 text-xs text-gray-700 font-mono">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Competitor Analysis ──────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionLabel><BarChart2 size={11} /> Competitor Analysis</SectionLabel>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">What's working for the market leader</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-2xl">
            The leading competitor in this niche has built a systematically larger site, but their approach has several exploitable weaknesses. Here's the objective comparison.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Your site */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-sm font-bold text-gray-900">Audited Site</span>
              </div>
              <div className="flex flex-col gap-1">
                <MetricRow label="Indexed pages" value="~15–20" sub="limited coverage" status="bad" />
                <MetricRow label="Location pages" value="Yes" sub="not fully connected" status="warn" />
                <MetricRow label="Service + Location pages" value="None" sub="missing layer" status="bad" />
                <MetricRow label="Svc + Location combos" value="0" status="bad" />
                <MetricRow label="Blog content" value="Minimal" status="warn" />
                <MetricRow label="Authentic photos" value="None" status="bad" />
                <MetricRow label="On-site conversion form" value="Off-domain" status="bad" />
              </div>
            </div>

            {/* Competitor */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                <span className="text-sm font-bold text-gray-900">Market Leader</span>
              </div>
              <div className="flex flex-col gap-1">
                <MetricRow label="Indexed pages" value="200+" sub="strong coverage" status="good" />
                <MetricRow label="Location pages" value="Yes" sub="well structured" status="good" />
                <MetricRow label="Service + Location pages" value="Yes" sub="core strategy" status="good" />
                <MetricRow label="Svc + Location combos" value="High volume" status="good" />
                <MetricRow label="Blog content" value="Active" status="good" />
                <MetricRow label="Authentic photos" value="Yes" status="good" />
                <MetricRow label="On-site conversion form" value="On-domain" status="good" />
              </div>
            </div>
          </div>

          {/* Weaknesses to exploit */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-4">Competitor weaknesses — exploitable gaps</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'Their backlink profile relies heavily on outdated directory links — a fresh contextual strategy will outperform this over 12 months',
                'Service pages are description-heavy with minimal brand differentiation — stronger branding + trust signals will convert better',
                'They show inaccurate trust data (e.g., 0/5 rating displayed) — maintaining accurate, real review counts is an immediate advantage',
                'No clear topical authority strategy in content — a structured blog targeting local long-tails can close the content gap faster than expected',
              ].map(w => (
                <div key={w} className="flex items-start gap-2.5 bg-white rounded-lg px-3 py-2.5 border border-amber-100">
                  <TrendingUp size={13} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 leading-snug">{w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Link Building Plan ───────────────────────────────────────────── */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-orange-300 text-xs font-semibold uppercase tracking-wide mb-4">
              <Link2 size={11} /> Off-page Strategy
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">6-month link building roadmap</h2>
            <p className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
              The competitor spent an estimated $20–25k building 500+ referring domains through niche directories and PR articles. The recommended alternative is a more natural, gradual growth pattern — which is what Google responds to best for a site at this stage.
            </p>
          </div>

          <div className="bg-orange-900/20 border border-orange-500/20 rounded-xl px-5 py-4 mb-10 flex items-start gap-3">
            <AlertCircle size={15} className="text-orange-400 flex-shrink-0 mt-0.5" />
            <p className="text-orange-200 text-sm leading-relaxed">
              <strong>Key principle:</strong> A brand with no link history that suddenly appears on major authority sites looks unnatural. Start with a mixed base of average-quality links (DR 30+), build momentum steadily, then scale into stronger placements. This pattern signals organic growth — not artificial manipulation.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {linkPlan.map((phase, i) => (
              <div key={phase.month} className="bg-white/5 border border-white/10 rounded-xl p-6 grid sm:grid-cols-[1fr_auto] gap-4 items-start">
                <div className="flex gap-5 items-start">
                  <div className="w-8 h-8 rounded-full bg-[#F97316]/20 border border-[#F97316]/30 flex items-center justify-center flex-shrink-0 text-[#F97316] font-black text-xs">
                    {i + 1}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-white font-bold text-sm">{phase.month}</span>
                      <Badge color="orange">{phase.phase}</Badge>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{phase.desc}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-right min-w-[120px]">
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Links / mo</div>
                    <div className="text-white font-bold text-sm">{phase.links}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Type</div>
                    <div className="text-gray-300 text-xs">{phase.type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Target DR</div>
                    <div className="text-gray-300 text-xs">{phase.dr}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Link mix ratio — why this matters</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { ratio: '1', label: 'High-quality placement', desc: 'Guest post or link insertion on a high-DR relevant site', color: 'border-[#F97316] text-[#F97316]' },
                { ratio: '3–4', label: 'Mid-quality contextual', desc: 'Solid niche-relevant placements on mid-DR sites', color: 'border-blue-400 text-blue-400' },
                { ratio: '5+', label: 'Crowd / foundation links', desc: 'Forum, community, and directory links for profile diversity', color: 'border-gray-500 text-gray-400' },
              ].map(m => (
                <div key={m.label} className={`border rounded-xl p-4 border-opacity-40 ${m.color.split(' ')[0]}`}>
                  <div className={`text-2xl font-black mb-1 ${m.color.split(' ')[1]}`}>{m.ratio}x</div>
                  <div className="text-white text-sm font-semibold mb-1">{m.label}</div>
                  <div className="text-gray-400 text-xs leading-relaxed">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Next steps CTA ───────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <SectionLabel><Zap size={11} /> Action Plan</SectionLabel>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Priority order for implementation</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-10">
            Not everything should be fixed at once. These are the highest-impact items in the correct sequence.
          </p>
          <div className="flex flex-col gap-3 text-left mb-10">
            {[
              { n: '1', title: 'Fix the conversion flow', desc: 'Embed the form on-domain. Every day off-domain loses leads.' },
              { n: '2', title: 'Rebuild the hero section', desc: 'Static headline, visible CTA, trust signals above the fold.' },
              { n: '3', title: 'Rewrite all H1s and meta titles', desc: 'Keyword-matched, within character limits, per the new structure.' },
              { n: '4', title: 'Build the silo structure (Phase 1)', desc: 'Service hubs → sub-services → location pages, all internally linked.' },
              { n: '5', title: 'Add FAQ sections', desc: 'Homepage + each service page. Include schema markup.' },
              { n: '6', title: 'Start link building (Foundation phase)', desc: 'Directories + citations first, then move to contextual.' },
              { n: '7', title: 'Launch Service + Location pages (Phase 2)', desc: 'After Phase 1 is indexed and moving, scale into combined pages.' },
            ].map(step => (
              <div key={step.n} className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-xl px-5 py-4">
                <div className="w-7 h-7 rounded-full bg-[#F97316] text-white font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{step.n}</div>
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-0.5">{step.title}</div>
                  <div className="text-sm text-gray-500">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <p className="text-gray-500 text-xs leading-relaxed">
              This report covered: Visual & UX review · Conversion flow analysis · On-page findings · Technical SEO · Site architecture plan · Keyword strategy (5 tiers) · Competitor analysis · 6-month link building roadmap. Domain and niche references have been removed for this sample.
            </p>
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
}
