import { Mail, Linkedin, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCookieConsent } from '../context/CookieConsentContext';
import { useLocale } from '../context/LocaleContext';

const year = new Date().getFullYear();

interface FooterProps { onOpenModal?: () => void; }

export default function Footer({ onOpenModal }: FooterProps) {
  void onOpenModal;
  const { t, localizePath: lp } = useLocale();
  const { openPreferences } = useCookieConsent();

  const linkBuildingLinks = [
    { label: t['nav.svc.guestPosting'], href: lp('/services/guest-posting') },
    { label: t['nav.svc.nicheEdits'], href: lp('/services/niche-edits') },
    { label: t['nav.svc.crowdLinks'], href: lp('/services/crowd-links') },
    { label: t['footer.whiteLabel'], href: lp('/services/white-label') },
  ];

  const proofLinks = [
    { label: t['nav.placements'], href: lp('/placements') },
    { label: t['nav.caseStudies'], href: lp('/case-studies') },
    { label: t['footer.reviewsFiverr'], href: 'https://www.fiverr.com/fittranslate?public_mode=true' },
    { label: t['footer.reviewsClutch'], href: 'https://clutch.co/profile/vladenza' },
  ];

  const resourceLinks = [
    { label: t['nav.pricing'], href: lp('/pricing') },
    { label: t['nav.blog'], href: lp('/blog') },
    { label: t['footer.contact'], href: 'mailto:info@vladenza.com' },
  ];

  const legalLinks = [
    { label: t['footer.privacy'], href: lp('/privacy-policy') },
    { label: t['footer.terms'], href: lp('/terms') },
    { label: t['footer.refund'], href: lp('/refund-policy') },
    { label: t['footer.cookiePolicy'], href: lp('/cookie-policy') },
  ];

  const renderLink = (link: { label: string; href: string }) => {
    if (link.href.startsWith('mailto:') || link.href.startsWith('http')) {
      return (
        <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="text-sm text-white/60 transition-colors hover:text-signal">{link.label}</a>
      );
    }
    if (link.href.includes('/#')) {
      return <a key={link.label} href={link.href} className="text-sm text-white/60 transition-colors hover:text-signal">{link.label}</a>;
    }
    return <Link key={link.label} to={link.href} className="text-sm text-white/60 transition-colors hover:text-signal">{link.label}</Link>;
  };

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link to={lp('/')} className="mb-3 flex select-none items-center">
              <img src="/Vladenza_Logo.png?v=5" alt="Vladenza" className="h-11 w-auto object-contain" />
            </Link>
            <p className="mb-3 max-w-[220px] text-sm leading-6 text-white/70">{t['footer.tagline']}</p>
            <a href="mailto:info@vladenza.com" className="mb-4 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white">
              <Mail size={13} className="text-[#F97316]" />info@vladenza.com
            </a>
            <div className="flex items-center gap-3">
              <a href="https://www.linkedin.com/company/vladenza" target="_blank" rel="noopener noreferrer" className="editorial-focus flex h-10 w-10 items-center justify-center border border-white/20 text-white/65 transition-colors hover:border-signal hover:text-white" aria-label="LinkedIn">
                <Linkedin size={14} />
              </a>
              <a href="https://www.youtube.com/@vladenza" target="_blank" rel="noopener noreferrer" className="editorial-focus flex h-10 w-10 items-center justify-center border border-white/20 text-white/65 transition-colors hover:border-signal hover:text-white" aria-label="YouTube">
                <Youtube size={14} />
              </a>
            </div>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/55">{t['footer.linkBuilding']}</p>
            <ul className="flex flex-col gap-2">{linkBuildingLinks.map(l => <li key={l.label}>{renderLink(l)}</li>)}</ul>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/55">{t['footer.proof']}</p>
            <ul className="flex flex-col gap-2">{proofLinks.map(l => <li key={l.label}>{renderLink(l)}</li>)}</ul>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/55">{t['footer.resources']}</p>
            <ul className="flex flex-col gap-2">{resourceLinks.map(l => <li key={l.label}>{renderLink(l)}</li>)}</ul>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/55">{t['footer.legal']}</p>
            <ul className="flex flex-col gap-2">{legalLinks.map(l => <li key={l.label}>{renderLink(l)}</li>)}</ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-5 sm:flex-row">
          <p className="text-xs text-white/55">&copy; {year} Vladenza Agency. {t['footer.rights']}</p>
          <div className="flex items-center gap-5">
            <Link to={lp('/privacy-policy')} className="text-xs text-white/55 transition-colors hover:text-white">{t['footer.privacy']}</Link>
            <Link to={lp('/terms')} className="text-xs text-white/55 transition-colors hover:text-white">{t['footer.terms']}</Link>
            <Link to={lp('/refund-policy')} className="text-xs text-white/55 transition-colors hover:text-white">{t['footer.refund']}</Link>
            <button onClick={openPreferences} className="text-xs text-white/55 transition-colors hover:text-white">{t['footer.cookiePrefs']}</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
