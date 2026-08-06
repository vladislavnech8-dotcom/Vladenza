import { Mail, Star, Circle } from 'lucide-react';
import { REVIEW_PLATFORMS } from '../data/reviewPlatforms';
import PlatformIcon from './PlatformIcon';

const year = new Date().getFullYear();

const serviceLinks = [
  { label: 'Guest Posting', href: '/services/guest-posting' },
  { label: 'Niche Edits', href: '/services/niche-edits' },
  { label: 'Crowd Marketing', href: '/services/crowd-links' },
  { label: 'SEO Audit', href: '/services/seo-audit' },
  { label: 'AI & LLM SEO', href: '/services/ai-llm' },
  { label: 'Local SEO Links', href: '/services/local-seo-links' },
  { label: 'LinkedIn Personal', href: '/services/linkedin-personal' },
  { label: 'LinkedIn Company', href: '/services/linkedin-company' },
  { label: 'White Label', href: '/services/white-label' },
];

import { Gamepad2, Laptop, Car, Heart, Lock, Home } from 'lucide-react';

const packageLinks = [
  { label: 'iGaming Links', href: '/services/link-packages/igaming', Icon: Gamepad2 },
  { label: 'SaaS Links', href: '/services/link-packages/saas', Icon: Laptop },
  { label: 'Automotive Links', href: '/services/link-packages/auto', Icon: Car },
  { label: 'Health Links', href: '/services/link-packages/health', Icon: Heart },
  { label: 'Proxy & VPN', href: '/services/link-packages/proxy', Icon: Lock },
  { label: 'Home Reno Links', href: '/services/link-packages/renovations', Icon: Home },
];

const companyLinks = [
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Sitemap', href: '/sitemap' },
];

/* Platform icons/ratings now come from ../data/reviewPlatforms + PlatformIcon */

interface FooterProps {
  onOpenModal?: () => void;
}

export default function Footer({ onOpenModal }: FooterProps) {
  return (
    <footer className="bg-gray-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-5 gap-10">

          {/* Brand col */}
          <div className="lg:col-span-1">
            <a href="/" className="flex items-center gap-0 mb-5 select-none">
              <span className="font-black text-[22px] text-white" style={{ letterSpacing: '-0.04em' }}>Vladen</span>
              <span className="font-black text-[22px] text-[#F97316]" style={{ letterSpacing: '-0.04em', borderBottom: '2.5px solid #F97316', lineHeight: 1 }}>za</span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your organic growth partner. Building authority for competitive niches since 2018.
            </p>

            <a
              href="mailto:sales@vladenza.com"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors group mb-6"
            >
              <Mail size={13} className="text-[#F97316]" />
              sales@vladenza.com
            </a>

            {/* Ratings */}
            <div className="grid grid-cols-2 gap-2">
              {REVIEW_PLATFORMS.map((r) => (
                <div key={r.name} className="flex items-center gap-1.5 border border-white/10 rounded-lg px-2 py-1.5 bg-white/5">
                  <PlatformIcon domain={r.domain} name={r.name} size={12} />
                  <span className="text-gray-300 text-[11px] font-semibold">{r.name}</span>
                  <div className="flex gap-px ml-auto">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={7} style={{ fill: r.accent, color: r.accent }} />
                    ))}
                  </div>
                  <span className="text-gray-400 text-[10px]">{r.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-4">Services</p>
            <ul className="flex flex-col gap-2.5">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link Packages */}
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-4">Link Packages</p>
            <ul className="flex flex-col gap-2.5">
              {packageLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 text-sm hover:text-white transition-colors flex items-center gap-2">
                    <link.Icon size={12} className="text-gray-600 flex-shrink-0" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-4">Company</p>
            <ul className="flex flex-col gap-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 text-sm hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-4">Contact</p>
            <ul className="flex flex-col gap-2.5 mb-6">
              <li>
                <a href="mailto:sales@vladenza.com" className="text-gray-400 text-sm hover:text-white transition-colors flex items-center gap-2">
                  <Mail size={12} className="text-[#F97316]" /> sales@vladenza.com
                </a>
              </li>
              <li>
                {onOpenModal ? (
                  <button onClick={onOpenModal} className="text-gray-400 text-sm hover:text-white transition-colors text-left">
                    Get a Custom Quote
                  </button>
                ) : (
                  <a href="/#contact" className="text-gray-400 text-sm hover:text-white transition-colors">
                    Get a Custom Quote
                  </a>
                )}
              </li>
            </ul>

            {/* Accepting clients badge */}
            <div className="border border-white/10 rounded-xl p-4 bg-white/5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 animate-pulse" />
                <span className="text-white text-xs font-semibold">Currently accepting clients</span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">
                Limited spots available each month. Campaigns start within 5 business days.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs order-2 sm:order-1">
            © {year} Vladenza — Organic Growth Partner. All rights reserved.
          </p>
          <div className="flex items-center gap-5 order-1 sm:order-2">
            <a href="#" className="text-gray-600 text-xs hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-600 text-xs hover:text-gray-300 transition-colors">Terms of Use</a>
            <a href="/admin" className="text-gray-700 text-xs hover:text-gray-500 transition-colors">Admin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
