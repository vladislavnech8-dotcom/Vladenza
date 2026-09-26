import { Mail, Linkedin, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCookieConsent } from '../context/CookieConsentContext';
import { useLocale } from '../context/LocaleContext';

const year = new Date().getFullYear();

interface FooterProps { onOpenModal?: () => void; }

export default function Footer(_: FooterProps) {
  const { t, localizePath: lp } = useLocale();
  const { openPreferences } = useCookieConsent();

  const linkBuildingLinks = [
    { label: t['nav.managedCampaigns'], href: lp('/#managed-campaigns') },
    { label: t['nav.svc.guestPosting'], href: lp('/services/guest-posting') },
    { label: t['nav.svc.nicheEdits'], href: lp('/services/niche-edits') },
    { label: t['nav.svc.crowdLinks'], href: lp('/services/crowd-links') },
    { label: t['footer.whiteLabel'], href: lp('/services/white-label') },
  ];

  const proofLinks = [
    { label: t['nav.placements'], href: lp('/placements') },
    { label: t['nav.caseStudies'], href: lp('/case-studies') },
    { label: t['footer.reviewsFiverr'], href: 'https://www.fiverr.com/vladenza' },
    { label: t['footer.reviewsClutch'], href: 'https://clutch.co/profile/vladenza' },
  ];

  const resourceLinks = [
    { label: t['nav.pricing'], href: lp('/pricing') },
    { label: t['nav.blog'], href: lp('/blog') },
    { label: t['footer.contact'], href: 'mailto:sales@vladenza.com' },
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
          className="text-gray-400 text-sm hover:text-[#F97316] transition-colors">{link.label}</a>
      );
    }
    if (link.href.includes('/#')) {
      return <a key={link.label} href={link.href} className="text-gray-400 text-sm hover:text-[#F97316] transition-colors">{link.label}</a>;
    }
    return <Link key={link.label} to={link.href} className="text-gray-400 text-sm hover:text-[#F97316] transition-colors">{link.label}</Link>;
  };

  return (
    <footer className="bg-gray-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link to={lp('/')} className="flex items-center gap-0 mb-3 select-none">
              <span className="font-black text-[22px] text-white" style={{ letterSpacing: '-0.04em' }}>Vladen</span>
              <span className="font-black text-[22px] text-[#F97316]" style={{ letterSpacing: '-0.04em', borderBottom: '2.5px solid #F97316', lineHeight: 1 }}>za</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-3 max-w-[220px]">{t['footer.tagline']}</p>
            <a href="mailto:sales@vladenza.com" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors mb-4">
              <Mail size={13} className="text-[#F97316]" />sales@vladenza.com
            </a>
            <div className="flex items-center gap-3">
              <a href="https://www.linkedin.com/company/vladenza" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#F97316]/40 transition-colors" aria-label="LinkedIn">
                <Linkedin size={14} />
              </a>
              <a href="https://www.youtube.com/@vladenza" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#F97316]/40 transition-colors" aria-label="YouTube">
                <Youtube size={14} />
              </a>
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">{t['footer.linkBuilding']}</p>
            <ul className="flex flex-col gap-2">{linkBuildingLinks.map(l => <li key={l.label}>{renderLink(l)}</li>)}</ul>
          </div>

          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">{t['footer.proof']}</p>
            <ul className="flex flex-col gap-2">{proofLinks.map(l => <li key={l.label}>{renderLink(l)}</li>)}</ul>
          </div>

          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">{t['footer.resources']}</p>
            <ul className="flex flex-col gap-2">{resourceLinks.map(l => <li key={l.label}>{renderLink(l)}</li>)}</ul>
          </div>

          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">{t['footer.legal']}</p>
            <ul className="flex flex-col gap-2">{legalLinks.map(l => <li key={l.label}>{renderLink(l)}</li>)}</ul>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs">&copy; {year} Vladenza Agency. {t['footer.rights']}</p>
          <div className="flex items-center gap-5">
            <Link to={lp('/privacy-policy')} className="text-gray-600 text-xs hover:text-gray-300 transition-colors">{t['footer.privacy']}</Link>
            <Link to={lp('/terms')} className="text-gray-600 text-xs hover:text-gray-300 transition-colors">{t['footer.terms']}</Link>
            <Link to={lp('/refund-policy')} className="text-gray-600 text-xs hover:text-gray-300 transition-colors">{t['footer.refund']}</Link>
            <button onClick={openPreferences} className="text-gray-600 text-xs hover:text-gray-300 transition-colors">{t['footer.cookiePrefs']}</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
