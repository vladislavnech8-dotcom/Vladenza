import { useState, useEffect, useRef } from 'react';
import {
  Menu, X, ChevronDown, Link2, FileText, Users, ShoppingCart,
  ArrowRight, Layers, Lock,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLocale } from '../context/LocaleContext';
import { LOCALE_LABELS, type Locale } from '../lib/i18n';

function LanguageSwitcher() {
  const { locale, switchLocale, otherLocale } = useLocale();
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5" role="group" aria-label="Switch language">
      {(Object.keys(LOCALE_LABELS) as Locale[]).map((l) => {
        const isActive = l === locale;
        const targetPath = l === locale ? null : switchLocale();
        return (
          <button key={l} onClick={() => { if (targetPath) navigate(targetPath); }}
            aria-label={`${LOCALE_LABELS[l]} language`} aria-pressed={isActive}
            className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${isActive ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}>
            {LOCALE_LABELS[l]}
          </button>
        );
      })}
    </div>
  );
}

interface NavigationProps { onOpenModal?: () => void; }

export default function Navigation({ onOpenModal }: NavigationProps) {
  const { t, localizePath: lp } = useLocale();
  const routerNavigate = useNavigate();
  const { pathname: path } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lbOpen, setLbOpen] = useState(false);
  const lbRef = useRef<HTMLDivElement>(null);

  const lbItems = [
    { label: t['nav.managedCampaigns'], href: lp('/#managed-campaigns'), icon: Layers, desc: t['nav.managedCampaignsDesc'] },
    { label: t['nav.svc.guestPosting'], href: lp('/services/guest-posting'), icon: FileText, desc: t['nav.svc.guestPostingDesc'] },
    { label: t['nav.svc.nicheEdits'], href: lp('/services/niche-edits'), icon: Link2, desc: t['nav.svc.nicheEditsDesc'] },
    { label: t['nav.svc.crowdLinks'], href: lp('/services/crowd-links'), icon: Users, desc: t['nav.svc.crowdLinksDesc'] },
    { label: t['nav.whiteLabelLink'], href: lp('/services/white-label'), icon: Lock, desc: t['nav.whiteLabelLinkDesc'] },
  ];

  const navLinks = [
    { label: t['nav.placements'], href: lp('/placements') },
    { label: t['nav.caseStudies'], href: lp('/case-studies') },
    { label: t['nav.pricing'], href: lp('/pricing') },
    { label: t['nav.blog'], href: lp('/blog') },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (lbRef.current && !lbRef.current.contains(e.target as Node)) setLbOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const navigate = (href: string) => {
    if (href.startsWith('/#') || href.startsWith('#')) {
      const id = href.replace(/^[\/#]+/, '');
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else routerNavigate(lp('/'));
    } else {
      routerNavigate(href);
    }
    setLbOpen(false);
    setMobileOpen(false);
  };

  return (
    <>
      <style>{`
        @keyframes dropIn { from { opacity: 0; transform: translateY(-8px) translateX(-50%); } to { opacity: 1; transform: translateY(0) translateX(-50%); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className={`bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">
            <a href={lp('/')} className="flex items-center select-none flex-shrink-0"
              onClick={(e) => { e.preventDefault(); navigate(lp('/')); }}>
              <span className="font-black text-[24px] text-gray-900" style={{ letterSpacing: '-0.05em' }}>Vladenza</span>
              <span className="font-black text-[10px] text-[#F97316] uppercase ml-1.5 px-1.5 py-0.5 border border-[#F97316] rounded"
                style={{ letterSpacing: '0.18em', lineHeight: 1, alignSelf: 'center', marginTop: '2px' }}>Agency</span>
            </a>

            <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              <div ref={lbRef} className="relative">
                <button onClick={() => setLbOpen(!lbOpen)}
                  className={`flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-xl transition-all duration-150 font-medium select-none ${lbOpen ? 'text-[#F97316] bg-orange-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                  {t['nav.linkBuilding']}
                  <ChevronDown size={12} className={`transition-transform duration-200 ${lbOpen ? 'rotate-180 text-[#F97316]' : 'text-gray-400'}`} />
                </button>
                {lbOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[320px] bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/80 z-50 overflow-hidden"
                    style={{ animation: 'dropIn 0.18s cubic-bezier(0.16,1,0.3,1)' }}>
                    <div className="p-2 flex flex-col gap-0.5">
                      {lbItems.map((s) => (
                        <button key={s.href} onClick={() => navigate(s.href)}
                          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-150 text-left w-full">
                          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-[#F97316] transition-colors duration-150">
                            <s.icon size={14} className="text-[#F97316] group-hover:text-white transition-colors duration-150" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-gray-900 text-sm font-medium leading-tight block">{s.label}</span>
                            <span className="text-gray-400 text-xs mt-0.5 leading-tight block">{s.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {navLinks.map((link) => {
                const isActive = link.href === path || (link.href !== lp('/') && path.startsWith(link.href));
                return (
                  <button key={link.label} onClick={() => navigate(link.href)}
                    className={`text-sm transition-colors duration-150 font-medium px-3 py-2 rounded-xl ${isActive ? 'text-[#F97316] bg-orange-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                    {link.label}
                  </button>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              <LanguageSwitcher />
              <CartButton />
              <button onClick={() => (onOpenModal ? onOpenModal() : routerNavigate(lp('/#contact')))}
                className="text-sm text-white font-semibold px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap shadow-sm hover:shadow-md hover:shadow-orange-200">
                {t['nav.getLinkPlan']} <ArrowRight size={13} />
              </button>
            </div>

            <div className="lg:hidden flex items-center gap-2">
              <LanguageSwitcher />
              <CartButton />
              <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)} aria-label={t['nav.toggleMenu']}>
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileDrawer open={mobileOpen} onNavigate={navigate} onClose={() => setMobileOpen(false)} onOpenModal={onOpenModal}
        lbItems={lbItems} navLinks={navLinks} t={t} lp={lp} />
    </>
  );
}

function CartButton() {
  const { itemCount, openCart } = useCart();
  const { t } = useLocale();
  return (
    <button onClick={openCart}
      className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#F97316] transition-colors"
      aria-label={t['nav.openCart']}>
      <ShoppingCart size={17} />
      {itemCount > 0 && <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#F97316] text-white text-[10px] font-bold flex items-center justify-center">{itemCount}</span>}
    </button>
  );
}

interface MobileDrawerProps {
  open: boolean; onNavigate: (href: string) => void; onClose: () => void; onOpenModal?: () => void;
  lbItems: Array<{ label: string; href: string; icon: React.ComponentType<{ size?: number; className?: string }>; desc: string }>;
  navLinks: Array<{ label: string; href: string }>;
  t: Record<string, string>; lp: (path: string) => string;
}

function MobileDrawer({ open, onNavigate, onClose, onOpenModal, lbItems, navLinks, t, lp }: MobileDrawerProps) {
  const [lbOpen, setLbOpen] = useState(false);
  if (!open) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-40" style={{ top: '56px' }}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white h-full overflow-y-auto shadow-2xl max-w-sm w-full"
        style={{ animation: 'slideIn 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
        <div className="px-4 py-4 flex flex-col gap-1">
          <button onClick={() => setLbOpen(!lbOpen)}
            className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors w-full min-h-[44px]">
            <span className="text-sm font-semibold text-gray-900">{t['nav.linkBuilding']}</span>
            <ChevronDown size={15} className={`text-gray-400 transition-transform duration-200 ${lbOpen ? 'rotate-180' : ''}`} />
          </button>
          {lbOpen && (
            <div className="flex flex-col gap-0.5 pl-2 mb-1">
              {lbItems.map((s) => (
                <button key={s.href} onClick={() => onNavigate(s.href)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left w-full min-h-[44px]">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <s.icon size={13} className="text-[#F97316]" />
                  </div>
                  <span className="text-sm text-gray-800 font-medium">{s.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="h-px bg-gray-100 my-1" />
          {navLinks.map((link) => (
            <button key={link.label} onClick={() => onNavigate(link.href)}
              className="flex items-center px-3 py-3 rounded-xl hover:bg-gray-50 text-sm text-gray-600 font-medium transition-colors text-left w-full min-h-[44px]">
              {link.label}
            </button>
          ))}

          <div className="flex flex-col gap-2.5 pt-3 mt-1 border-t border-gray-100">
            <button onClick={() => { onClose(); onOpenModal ? onOpenModal() : onNavigate(lp('/#contact')); }}
              className="text-sm text-center text-white font-semibold px-4 py-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] transition-colors flex items-center justify-center gap-2 min-h-[44px]">
              {t['nav.getLinkPlan']} <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
