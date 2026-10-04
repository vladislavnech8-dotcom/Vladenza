import { useState, useEffect, useRef } from 'react';
import {
  Menu, X, ChevronDown, Link2, FileText, Users, ShoppingCart,
  ArrowRight, Layers, Lock,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLocale } from '../context/LocaleContext';
import { LOCALE_LABELS, type Locale, type TranslationKey } from '../lib/i18n';

function LanguageSwitcher() {
  const { locale, switchLocale } = useLocale();
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-0.5 rounded-xl border border-white/15 bg-white/5 p-0.5" role="group" aria-label="Switch language">
      {(Object.keys(LOCALE_LABELS) as Locale[]).map((l) => {
        const isActive = l === locale;
        const targetPath = l === locale ? null : switchLocale();
        return (
          <button key={l} onClick={() => { if (targetPath) navigate(targetPath); }}
            aria-label={`${LOCALE_LABELS[l]} language`} aria-pressed={isActive}
            className={`editorial-focus min-h-[36px] rounded-lg px-2.5 text-[11px] font-bold transition-all ${isActive ? 'bg-signal text-white' : 'text-white/60 hover:text-white'}`}>
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
    const onClick = (e: MouseEvent) => { if (lbRef.current && !lbRef.current.contains(e.target as Node)) setLbOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const navigate = (href: string) => {
    if (href.startsWith('/#') || href.startsWith('#')) {
      const id = href.replace(/^[/#]+/, '');
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
        @keyframes slideDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Desktop floating dark nav */}
      <header className="fixed left-1/2 top-4 z-50 hidden -translate-x-1/2 lg:block">
        <div className="flex h-[74px] w-[calc(100vw-32px)] max-w-[1600px] items-center justify-between gap-8 rounded-[20px] border border-white/12 bg-[#0B1020] px-6 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-md">
          {/* Logo */}
          <a href={lp('/')} className="flex select-none items-center flex-shrink-0"
            onClick={(e) => { e.preventDefault(); navigate(lp('/')); }}>
            <span className="font-display text-[24px] font-bold tracking-[-.05em] text-white">Vladenza</span>
            <span className="font-black text-[10px] text-signal uppercase ml-1.5 px-1.5 py-0.5 border-2 border-signal"
              style={{ letterSpacing: '0.18em', lineHeight: 1, alignSelf: 'center', marginTop: '2px' }}>Agency</span>
          </a>

          {/* Center nav */}
          <nav className="flex items-center gap-1">
            <div ref={lbRef} className="relative">
              <button onClick={() => setLbOpen(!lbOpen)}
                className={`editorial-focus flex min-h-[44px] items-center gap-1.5 rounded-xl px-3.5 text-sm font-bold transition-colors duration-150 select-none ${lbOpen ? 'text-signal' : 'text-white/65 hover:text-white'}`}>
                {t['nav.linkBuilding']}
                <ChevronDown size={12} className={`transition-transform duration-200 ${lbOpen ? 'rotate-180 text-signal' : 'text-white/40'}`} />
              </button>
              {lbOpen && (
                <div className="absolute left-1/2 top-full z-50 mt-3 w-[340px] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/12 bg-[#0B1020] shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
                  style={{ animation: 'dropIn 0.18s cubic-bezier(0.16,1,0.3,1)' }}>
                  <div className="flex flex-col gap-0.5 p-2">
                    {lbItems.map((s) => (
                      <button key={s.href} onClick={() => navigate(s.href)}
                        className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-150 hover:bg-white/5">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                          <s.icon size={14} className="text-signal" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block text-sm font-medium leading-tight text-white/90 group-hover:text-signal">{s.label}</span>
                          <span className="mt-0.5 block text-xs leading-tight text-white/40">{s.desc}</span>
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
                  className={`editorial-focus min-h-[44px] rounded-xl px-3.5 text-sm font-bold transition-colors duration-150 ${isActive ? 'text-signal' : 'text-white/65 hover:text-white'}`}>
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex flex-shrink-0 items-center gap-3">
            <LanguageSwitcher />
            <CartButton />
            <button onClick={() => (onOpenModal ? onOpenModal() : routerNavigate(lp('/#contact')))}
              className="editorial-focus flex min-h-[52px] items-center gap-1.5 whitespace-nowrap rounded-2xl bg-signal px-5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#EA580C]">
              {t['nav.getLinkPlan']} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile floating dark header */}
      <header className="fixed left-1/2 top-3 z-50 block w-[calc(100vw-24px)] -translate-x-1/2 lg:hidden">
        <div className="flex h-[60px] items-center justify-between rounded-2xl border border-white/12 bg-[#0B1020] px-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-md">
          <a href={lp('/')} className="flex select-none items-center"
            onClick={(e) => { e.preventDefault(); navigate(lp('/')); }}>
            <span className="font-display text-[20px] font-bold tracking-[-.05em] text-white">Vladenza</span>
            <span className="font-black text-[9px] text-signal uppercase ml-1 px-1.5 py-0.5 border-2 border-signal"
              style={{ letterSpacing: '0.18em', lineHeight: 1, alignSelf: 'center', marginTop: '2px' }}>Agency</span>
          </a>
          <div className="flex items-center gap-2">
            <CartButton />
            <button className="editorial-focus flex h-11 w-11 items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-signal hover:text-signal"
              onClick={() => setMobileOpen(!mobileOpen)} aria-label={t['nav.toggleMenu']}>
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
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
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 text-white/70 transition-colors hover:border-signal hover:text-signal"
      aria-label={t['nav.openCart']}>
      <ShoppingCart size={17} />
      {itemCount > 0 && <span className="absolute -top-1.5 -right-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-signal px-1 text-[10px] font-bold text-white">{itemCount}</span>}
    </button>
  );
}

interface MobileDrawerProps {
  open: boolean; onNavigate: (href: string) => void; onClose: () => void; onOpenModal?: () => void;
  lbItems: Array<{ label: string; href: string; icon: React.ElementType; desc: string }>;
  navLinks: Array<{ label: string; href: string }>;
  t: TranslationKey; lp: (path: string) => string;
}

function MobileDrawer({ open, onNavigate, onClose, onOpenModal, lbItems, navLinks, t, lp }: MobileDrawerProps) {
  const [lbOpen, setLbOpen] = useState(false);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden" style={{ top: '72px' }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full overflow-y-auto rounded-b-2xl border border-white/12 bg-[#0B1020] shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
        style={{ animation: 'slideDown 0.22s cubic-bezier(0.16,1,0.3,1)' }}>
        <div className="flex flex-col gap-1 p-4">
          <button onClick={() => setLbOpen(!lbOpen)}
            className="flex min-h-[44px] w-full items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-white/5">
            <span className="text-sm font-bold text-white/90">{t['nav.linkBuilding']}</span>
            <ChevronDown size={15} className={`text-white/40 transition-transform duration-200 ${lbOpen ? 'rotate-180' : ''}`} />
          </button>
          {lbOpen && (
            <div className="mb-1 flex flex-col gap-0.5 pl-2">
              {lbItems.map((s) => (
                <button key={s.href} onClick={() => onNavigate(s.href)}
                  className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-white/5">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <s.icon size={13} className="text-signal" />
                  </div>
                  <span className="text-sm font-medium text-white/80">{s.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="my-1 h-px bg-white/10" />
          {navLinks.map((link) => (
            <button key={link.label} onClick={() => onNavigate(link.href)}
              className="flex min-h-[44px] w-full items-center rounded-xl px-3 py-3 text-left text-sm font-bold text-white/65 transition-colors hover:bg-white/5 hover:text-white">
              {link.label}
            </button>
          ))}

          <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
            <LanguageSwitcher />
          </div>

          <button onClick={() => { onClose(); if (onOpenModal) onOpenModal(); else onNavigate(lp('/#contact')); }}
            className="mt-3 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-signal text-sm font-bold text-white transition-colors hover:bg-[#EA580C]">
            {t['nav.getLinkPlan']} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
