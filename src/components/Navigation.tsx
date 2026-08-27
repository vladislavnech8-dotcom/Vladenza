import { useState, useEffect, useRef } from 'react';
import {
  Menu, X, Star, ChevronDown, Link2, FileText, Users, Cpu,
  Search, BarChart2, ArrowUpRight, Gamepad2, Laptop,
  Car, Heart, ArrowRight, Zap, BookOpen, TrendingUp, MapPin, Lock, Home, Linkedin, Building2, ShoppingCart,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { REVIEW_PLATFORMS } from '../data/reviewPlatforms';
import PlatformIcon from './PlatformIcon';
import { useCart } from '../context/CartContext';

/* ─── Data ────────────────────────────────────────────────────── */

const services = [
  {
    label: 'SEO Audit',
    href: '/services/seo-audit',
    icon: Search,
    desc: 'Full technical & strategic audit',
    badge: null,
  },
  {
    label: 'Guest Posting',
    href: '/services/guest-posting',
    icon: FileText,
    desc: 'Editorial links on real traffic sites',
    badge: null,
  },
  {
    label: 'Niche Edits',
    href: '/services/niche-edits',
    icon: Link2,
    desc: 'Links inserted in aged, indexed content',
    badge: null,
  },
  {
    label: 'Crowd Links',
    href: '/services/crowd-links',
    icon: Users,
    desc: 'Forum & community link building',
    badge: null,
  },
  {
    label: 'AI & LLM SEO',
    href: '/services/ai-llm',
    icon: Cpu,
    desc: 'Get cited by ChatGPT & Perplexity',
    badge: 'New',
  },
  {
    label: 'Local SEO Links',
    href: '/services/local-seo-links',
    icon: MapPin,
    desc: 'Map pack & local organic rankings',
    badge: null,
  },
  {
    label: 'LinkedIn Personal',
    href: '/services/linkedin-personal',
    icon: Linkedin,
    desc: 'Personal brand & profile growth',
    badge: null,
  },
  {
    label: 'LinkedIn Company',
    href: '/services/linkedin-company',
    icon: Building2,
    desc: 'Company page management & B2B leads',
    badge: null,
  },
  {
    label: 'White Label',
    href: '/services/white-label',
    icon: Lock,
    desc: 'Silent fulfilment for agencies',
    badge: 'Agencies',
  },
];

const packages = [
  { label: 'iGaming Links',     href: '/services/link-packages/igaming',     icon: Gamepad2, color: 'text-emerald-600 bg-emerald-50', desc: 'Casino, sports betting, poker' },
  { label: 'SaaS Links',        href: '/services/link-packages/saas',         icon: Laptop,   color: 'text-blue-600 bg-blue-50',    desc: 'B2B tech & software' },
  { label: 'Automotive Links',  href: '/services/link-packages/auto',         icon: Car,      color: 'text-amber-600 bg-amber-50',  desc: 'Dealerships, parts, reviews' },
  { label: 'Health Links',      href: '/services/link-packages/health',       icon: Heart,    color: 'text-rose-600 bg-rose-50',    desc: 'Supplements, fitness, medical' },
  { label: 'Proxy & VPN Links', href: '/services/link-packages/proxy',        icon: Lock,     color: 'text-gray-600 bg-gray-100',   desc: 'VPN, proxy, cybersecurity' },
  { label: 'Home Reno Links',   href: '/services/link-packages/renovations',  icon: Home,     color: 'text-orange-600 bg-orange-50',desc: 'Plumbing, contractors, HVAC' },
];

const navLinks = [
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQ', href: '/#faq' },
];

/* Platform rating icons now come from ../data/reviewPlatforms + PlatformIcon */

/* ─── Sub-components ──────────────────────────────────────────── */

interface ServicesMegaProps {
  onNavigate: (href: string) => void;
  onOpenModal?: () => void;
}

function ServicesMega({ onNavigate, onOpenModal }: ServicesMegaProps) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[540px] bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/80 z-50 overflow-hidden"
      style={{ animation: 'dropIn 0.18s cubic-bezier(0.16,1,0.3,1)' }}>
      <div className="grid grid-cols-2 gap-px bg-gray-100">
        {/* Left col – services list */}
        <div className="bg-white p-4 flex flex-col gap-0.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 pb-2">Services</p>
          {services.map((s) => (
            <button
              key={s.href}
              onClick={() => onNavigate(s.href)}
              className="group flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-150 text-left w-full"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#F97316] transition-colors duration-150">
                <s.icon size={14} className="text-[#F97316] group-hover:text-white transition-colors duration-150" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 text-sm font-medium leading-tight">{s.label}</span>
                  {s.badge && (
                    <span className="text-[9px] font-bold uppercase tracking-wide bg-[#F97316] text-white px-1.5 py-0.5 rounded-full">{s.badge}</span>
                  )}
                </div>
                <div className="text-gray-400 text-xs mt-0.5 leading-tight truncate">{s.desc}</div>
              </div>
              <ArrowUpRight size={12} className="text-gray-300 group-hover:text-[#F97316] flex-shrink-0 transition-colors duration-150 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-transform" />
            </button>
          ))}
        </div>

        {/* Right col – packages + CTA */}
        <div className="bg-white p-4 flex flex-col">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 pb-2">Link Packages by Niche</p>
          <div className="flex flex-col gap-0.5 flex-1">
            {packages.map((p) => (
              <button
                key={p.href}
                onClick={() => onNavigate(p.href)}
                className="group flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-150 text-left w-full"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${p.color} group-hover:opacity-90 transition-opacity`}>
                  <p.icon size={14} />
                </div>
                <div>
                  <div className="text-gray-900 text-sm font-medium leading-tight">{p.label}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{p.desc}</div>
                </div>
              </button>
            ))}
          </div>
          {/* Bottom CTA */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => (onOpenModal ? onOpenModal() : onNavigate('/#contact'))}
              className="w-full flex items-center justify-center gap-2 bg-gray-950 hover:bg-gray-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200"
            >
              <Zap size={12} className="text-[#F97316]" />
              Get a Custom Package
              <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom quick links */}
      <div className="bg-gray-50 border-t border-gray-100 px-4 py-2.5 flex items-center gap-1">
        <span className="text-[10px] text-gray-400 font-medium mr-2">Explore:</span>
        <button
          onClick={() => onNavigate('/case-studies')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-600 hover:text-gray-900 hover:bg-white border border-transparent hover:border-gray-200 transition-all duration-150 font-medium"
        >
          <TrendingUp size={11} className="text-[#F97316]" />
          Case Studies
        </button>
        <button
          onClick={() => onNavigate('/blog')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-600 hover:text-gray-900 hover:bg-white border border-transparent hover:border-gray-200 transition-all duration-150 font-medium"
        >
          <BookOpen size={11} className="text-[#F97316]" />
          Blog
        </button>
        <div className="flex-1" />
        <button
          onClick={() => onNavigate('/pricing')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-700 transition-colors font-medium"
        >
          Pricing <ArrowUpRight size={10} />
        </button>
      </div>
    </div>
  );
}

/* ─── Mobile drawer ───────────────────────────────────────────── */

interface MobileDrawerProps {
  open: boolean;
  onNavigate: (href: string) => void;
  onClose: () => void;
  onOpenModal?: () => void;
}

function MobileDrawer({ open, onNavigate, onClose, onOpenModal }: MobileDrawerProps) {
  const [svcOpen, setSvcOpen] = useState(true);
  const [pkgOpen, setPkgOpen] = useState(false);

  if (!open) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-40" style={{ top: '88px' }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      {/* Panel */}
      <div className="relative bg-white h-full overflow-y-auto shadow-2xl max-w-sm w-full"
        style={{ animation: 'slideIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
        <div className="px-4 py-4 flex flex-col gap-1">

          {/* Services accordion */}
          <button
            onClick={() => setSvcOpen(!svcOpen)}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors w-full"
          >
            <span className="text-sm font-semibold text-gray-900">Services</span>
            <ChevronDown size={15} className={`text-gray-400 transition-transform duration-200 ${svcOpen ? 'rotate-180' : ''}`} />
          </button>
          {svcOpen && (
            <div className="flex flex-col gap-0.5 pl-2 mb-1">
              {services.map((s) => (
                <button
                  key={s.href}
                  onClick={() => onNavigate(s.href)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left w-full group"
                >
                  <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <s.icon size={13} className="text-[#F97316]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-800 font-medium">{s.label}</span>
                      {s.badge && <span className="text-[9px] font-bold uppercase bg-[#F97316] text-white px-1.5 py-0.5 rounded-full">{s.badge}</span>}
                    </div>
                    <div className="text-xs text-gray-400">{s.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Packages accordion */}
          <button
            onClick={() => setPkgOpen(!pkgOpen)}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors w-full"
          >
            <span className="text-sm font-semibold text-gray-900">Link Packages</span>
            <ChevronDown size={15} className={`text-gray-400 transition-transform duration-200 ${pkgOpen ? 'rotate-180' : ''}`} />
          </button>
          {pkgOpen && (
            <div className="flex flex-col gap-0.5 pl-2 mb-1">
              {packages.map((p) => (
                <button
                  key={p.href}
                  onClick={() => onNavigate(p.href)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left w-full"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${p.color}`}>
                    <p.icon size={13} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-800 font-medium">{p.label}</div>
                    <div className="text-xs text-gray-400">{p.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Regular nav links */}
          <div className="h-px bg-gray-100 my-1" />
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => onNavigate(link.href)}
              className="flex items-center px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm text-gray-600 font-medium transition-colors text-left w-full"
            >
              {link.label}
            </button>
          ))}

          {/* CTAs */}
          <div className="flex flex-col gap-2.5 pt-3 mt-1 border-t border-gray-100">
            <button
              onClick={() => {
                onClose();
                onOpenModal ? onOpenModal() : onNavigate('/#contact');
              }}
              className="text-sm text-center text-white font-semibold px-4 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] transition-colors flex items-center justify-center gap-2"
            >
              Get a Custom Quote <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────── */

function CartButton() {
  const { itemCount, openCart } = useCart();
  return (
    <button
      onClick={openCart}
      className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#F97316] transition-colors"
      aria-label="Open cart"
    >
      <ShoppingCart size={17} />
      {itemCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#F97316] text-white text-[10px] font-bold flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}

interface NavigationProps {
  onOpenModal?: () => void;
}

export default function Navigation({ onOpenModal }: NavigationProps) {
  const routerNavigate = useNavigate();
  const { pathname: path } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const navigate = (href: string) => {
    if (href.startsWith('/#') || href.startsWith('#')) {
      window.location.href = href;
    } else {
      routerNavigate(href);
    }
    setMegaOpen(false);
    setMobileOpen(false);
  };

  return (
    <>
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) translateX(-50%); }
          to   { opacity: 1; transform: translateY(0)   translateX(-50%); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}>
        {/* Top ratings bar */}
        <div className="hidden lg:flex items-center justify-center gap-8 bg-gray-950 py-1.5 px-6">
          {REVIEW_PLATFORMS.map((r) => (
            <div key={r.name} className="flex items-center gap-1.5">
              <PlatformIcon domain={r.domain} name={r.name} size={14} />
              <span className="text-[11px] font-semibold text-gray-300">{r.name}</span>
              <div className="flex gap-px">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={9} style={{ fill: r.accent, color: r.accent }} />
                ))}
              </div>
              <span className="text-[11px] font-bold text-white">{r.score}</span>
            </div>
          ))}
        </div>

        {/* Main nav bar */}
        <div className={`bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">

            {/* Logo */}
            <a
              href="/"
              className="flex items-center select-none flex-shrink-0"
              onClick={(e) => { e.preventDefault(); navigate('/'); }}
            >
              <span className="font-black text-[24px] text-gray-900" style={{ letterSpacing: '-0.05em' }}>Vladenza</span>
              <span
                className="font-black text-[10px] text-[#F97316] uppercase ml-1.5 px-1.5 py-0.5 border border-[#F97316] rounded"
                style={{ letterSpacing: '0.18em', lineHeight: 1, alignSelf: 'center', marginTop: '2px' }}
              >Agency</span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">

              {/* Mega-menu trigger */}
              <div ref={megaRef} className="relative">
                <button
                  onClick={() => setMegaOpen(!megaOpen)}
                  className={`flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-xl transition-all duration-150 font-medium select-none
                    ${megaOpen
                      ? 'text-[#F97316] bg-orange-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  <BarChart2 size={13} className={megaOpen ? 'text-[#F97316]' : 'text-gray-400'} />
                  Services & Packages
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${megaOpen ? 'rotate-180 text-[#F97316]' : 'text-gray-400'}`}
                  />
                </button>
                {megaOpen && <ServicesMega onNavigate={navigate} onOpenModal={onOpenModal} />}
              </div>

              {/* Separator */}
              <div className="w-px h-4 bg-gray-200 mx-1" />

              {navLinks.map((link) => {
                const isActive = link.href === path || (link.href !== '/' && path.startsWith(link.href.replace('/#', '/')));
                return (
                  <button
                    key={link.label}
                    onClick={() => navigate(link.href)}
                    className={`text-sm transition-colors duration-150 font-medium px-3 py-2 rounded-xl ${
                      isActive
                        ? 'text-[#F97316] bg-orange-50'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              <CartButton />
              <button
                onClick={() => (onOpenModal ? onOpenModal() : routerNavigate('/#contact'))}
                className="text-sm text-white font-semibold px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap shadow-sm hover:shadow-md hover:shadow-orange-200"
              >
                Get a Custom Quote
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Mobile: cart + hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              <CartButton />
              <button
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer (rendered outside header to cover full screen) */}
      <MobileDrawer
        open={mobileOpen}
        onNavigate={navigate}
        onClose={() => setMobileOpen(false)}
        onOpenModal={onOpenModal}
      />
    </>
  );
}
