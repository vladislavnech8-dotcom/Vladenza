import { Link } from 'react-router-dom';
import { Home, Wrench, BookOpen, BarChart2, Globe, ExternalLink, ChevronRight, FileCode } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import { useSEO } from '../hooks/useSEO';
import { blogPosts } from '../data/blogPosts';
import { cases } from '../data/cases';

interface SitemapSection {
  icon: typeof Home;
  title: string;
  color: string;
  links: { label: string; href: string; desc?: string }[];
}

const sections: SitemapSection[] = [
  {
    icon: Home,
    title: 'Main',
    color: 'text-gray-700 bg-gray-50 border-gray-200',
    links: [
      { label: 'Home', href: '/', desc: 'Overview of all services and agency overview' },
      { label: 'Reviews', href: '/reviews', desc: 'Client reviews on Clutch, Google, and Fiverr — leave your own' },
    ],
  },
  {
    icon: Wrench,
    title: 'Services',
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    links: [
      { label: 'Guest Posting', href: '/services/guest-posting', desc: 'High-authority DR 30–90+ link placements on real traffic sites' },
      { label: 'Niche Edits', href: '/services/niche-edits', desc: 'Contextual link insertions into aged, indexed content' },
      { label: 'Crowd Links', href: '/services/crowd-links', desc: 'Forum & community link building across 50+ platforms' },
      { label: 'SEO Audit', href: '/services/seo-audit', desc: 'Technical, on-page, and backlink profile analysis' },
      { label: 'AI & LLM Visibility', href: '/services/ai-llm', desc: 'Get cited by ChatGPT, Gemini, and Perplexity' },
      { label: 'Local SEO Links', href: '/services/local-seo-links', desc: 'Geo-targeted links for local business rankings' },
    ],
  },
  {
    icon: Globe,
    title: 'Link Packages by Niche',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    links: [
      { label: 'iGaming & Betting', href: '/services/link-packages/igaming', desc: 'Compliance-aware links for casino, poker & sports betting' },
      { label: 'SaaS & B2B Tech', href: '/services/link-packages/saas', desc: 'Authority links for software, developer tools & MarTech' },
      { label: 'Automotive', href: '/services/link-packages/auto', desc: 'Links for dealerships, parts retailers & auto reviews' },
      { label: 'Health & Wellness', href: '/services/link-packages/health', desc: 'YMYL-safe links for health, nutrition & medical sites' },
      { label: 'Proxy & VPN', href: '/services/link-packages/proxy', desc: 'High-DR links for proxy, VPN & cybersecurity brands' },
      { label: 'Renovations & Home', href: '/services/link-packages/renovations', desc: 'Local & national links for construction & home services' },
    ],
  },
  {
    icon: BarChart2,
    title: 'Case Studies',
    color: 'text-green-600 bg-green-50 border-green-200',
    links: [
      { label: 'All Case Studies', href: '/case-studies', desc: 'Browse 840+ client campaigns with real results' },
      ...cases.map((c) => ({ label: c.title, href: `/case-studies/${c.slug}`, desc: `${c.niche} · ${c.metric} ${c.metricSub}` })),
    ],
  },
  {
    icon: BookOpen,
    title: 'Blog',
    color: 'text-sky-600 bg-sky-50 border-sky-200',
    links: [
      { label: 'All Articles', href: '/blog', desc: 'Link building strategies, GEO, and SEO playbooks' },
      ...blogPosts.map((p) => ({ label: p.title, href: `/blog/${p.slug}`, desc: `${p.category} · ${p.readTime}` })),
    ],
  },
];

export default function SitemapPage() {
  useSEO({
    title: 'Sitemap — Vladenza SEO Agency',
    description: 'Full sitemap of Vladenza — link building services, niche packages, SEO case studies, and blog articles.',
    canonical: 'https://vladenza.com/sitemap',
  });

  const totalLinks = sections.reduce((acc, s) => acc + s.links.length, 0);

  return (
    <ServicePageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 lg:py-20" style={{ background: 'linear-gradient(160deg,#fff7f0 0%,#ffffff 55%)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-5">
              <Globe size={13} className="text-[#F97316]" />
              <span className="text-xs font-semibold text-[#F97316] tracking-wide uppercase">Site Navigation</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight mb-4">
              Sitemap
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-6">
              Every page on the Vladenza website — organised by section for easy navigation.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 text-xs font-semibold text-gray-600">
                <Globe size={11} className="text-gray-400" />
                {totalLinks} pages indexed
              </span>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-gray-900 text-white rounded-full px-4 py-1.5 text-xs font-semibold hover:bg-gray-700 transition-colors"
              >
                <FileCode size={11} />
                sitemap.xml for Google Search Console
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sections grid */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title}>
                {/* Section header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${section.color}`}>
                    <Icon size={16} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                  <span className="ml-1 text-xs font-semibold text-gray-400 bg-gray-100 rounded-full px-2.5 py-0.5">
                    {section.links.length}
                  </span>
                </div>

                {/* Links grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="group flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-2xl hover:border-[#F97316]/40 hover:shadow-sm transition-all duration-200"
                    >
                      <ChevronRight
                        size={14}
                        className="text-gray-300 group-hover:text-[#F97316] mt-0.5 shrink-0 transition-colors"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-[#F97316] transition-colors leading-snug truncate">
                          {link.label}
                        </div>
                        {link.desc && (
                          <div className="text-xs text-gray-400 mt-0.5 leading-snug line-clamp-2">{link.desc}</div>
                        )}
                        <div className="text-[10px] text-gray-300 mt-1 font-mono truncate">
                          vladenza.com{link.href}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* XML note */}
      <section className="py-10 lg:py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 bg-gray-50 border border-gray-200 rounded-2xl">
            <div className="w-11 h-11 bg-gray-900 rounded-xl flex items-center justify-center shrink-0">
              <FileCode size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 mb-0.5">XML Sitemap for Search Engines</p>
              <p className="text-sm text-gray-500">
                Submit <span className="font-mono text-gray-700 text-xs bg-gray-100 px-1.5 py-0.5 rounded">https://vladenza.com/sitemap.xml</span> to Google Search Console to ensure all pages are indexed.
              </p>
            </div>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-700 transition-colors shrink-0"
            >
              Open sitemap.xml <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
}
