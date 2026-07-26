import { Mail, Star, Circle } from 'lucide-react';

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

function TrustpilotIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M12 0L14.78 8.56H24L16.61 13.86L19.39 22.42L12 17.12L4.61 22.42L7.39 13.86L0 8.56H9.22L12 0Z" fill="#00B67A"/>
    </svg>
  );
}
function FiverrIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#1DBF73"/>
      <path d="M17.5 7.5C17.5 8.33 16.83 9 16 9s-1.5-.67-1.5-1.5S15.17 6 16 6s1.5.67 1.5 1.5zM8.5 10H7v8h2v-6h4v-2H9c0-.83.67-1.5 1.5-1.5H14V6.5h-3.5C8.57 6.5 7 8.07 7 10h1.5zM14 12h-2v6h2v-6z" fill="white"/>
    </svg>
  );
}
function ClutchIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#FF3D2E"/>
      <path d="M12 6C8.69 6 6 8.69 6 12s2.69 6 6 6c2.39 0 4.45-1.37 5.5-3.38l-2.57-1.37A3 3 0 0112 15c-1.66 0-3-1.34-3-3s1.34-3 3-3c1.26 0 2.36.72 2.93 1.75l2.57-1.37A6 6 0 0012 6z" fill="white"/>
    </svg>
  );
}
function GoogleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 01-2.2 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-1 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.87 0-5.29-1.93-6.16-4.53H2.15v2.84A11.99 11.99 0 0012 23z" fill="#34A853"/>
      <path d="M5.84 14.1A7.19 7.19 0 015.49 12c0-.73.13-1.44.35-2.1V7.06H2.15A12 12 0 001 12c0 1.8.42 3.5 1.15 4.95l3.69-2.85z" fill="#FBBC05"/>
      <path d="M12 5.37c1.62 0 3.06.56 4.21 1.7l3.15-3.15A11.97 11.97 0 0012 1C7.69 1 3.96 3.47 2.15 7.05l3.69 2.84C6.71 7.3 9.13 5.37 12 5.37z" fill="#EA4335"/>
    </svg>
  );
}

const ratings = [
  { name: 'Trustpilot', score: '4.4', Icon: TrustpilotIcon, starColor: '#00B67A' },
  { name: 'Clutch', score: '4.9', Icon: ClutchIcon, starColor: '#FF3D2E' },
  { name: 'Fiverr', score: '4.9', Icon: FiverrIcon, starColor: '#1DBF73' },
  { name: 'Google', score: '4.9', Icon: GoogleIcon, starColor: '#FBBC05' },
];

export default function Footer() {
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
              {ratings.map((r) => (
                <div key={r.name} className="flex items-center gap-1.5 border border-white/10 rounded-lg px-2 py-1.5 bg-white/5">
                  <r.Icon />
                  <span className="text-gray-300 text-[11px] font-semibold">{r.name}</span>
                  <div className="flex gap-px ml-auto">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={7} style={{ fill: r.starColor, color: r.starColor }} />
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
                <a href="/#contact" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Book a Call
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-gray-400 text-sm hover:text-white transition-colors">
                  Get a Proposal
                </a>
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
