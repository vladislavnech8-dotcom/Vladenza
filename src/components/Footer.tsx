import { Mail, Linkedin, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCookieConsent } from '../context/CookieConsentContext';

const year = new Date().getFullYear();

const linkBuildingLinks = [
  { label: 'Niche Edits', href: '/services/niche-edits' },
  { label: 'Guest Posts', href: '/services/guest-posting' },
  { label: 'Crowd Links', href: '/services/crowd-links' },
  { label: 'Custom Link Plan', href: '/#products' },
];

const companyLinks = [
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Real Placements', href: '/services/niche-edits#placements' },
  { label: 'About', href: '/#about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Reviews', href: '/reviews' },
];

const resourceLinks = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: 'mailto:sales@vladenza.com' },
];

const legalLinks = [
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Cookie Policy', href: '/cookie-policy' },
];

interface FooterProps {
  onOpenModal?: () => void;
}

export default function Footer(_: FooterProps) {
  const { openPreferences } = useCookieConsent();
  return (
    <footer className="bg-gray-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">

          {/* Brand col */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link to="/" className="flex items-center gap-0 mb-3 select-none">
              <span className="font-black text-[22px] text-white" style={{ letterSpacing: '-0.04em' }}>Vladen</span>
              <span className="font-black text-[22px] text-[#F97316]" style={{ letterSpacing: '-0.04em', borderBottom: '2.5px solid #F97316', lineHeight: 1 }}>za</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-3 max-w-[220px]">
              Link building for brands and agencies. Niche edits, guest posts and community links backed by manual review.
            </p>
            <a
              href="mailto:sales@vladenza.com"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors mb-4"
            >
              <Mail size={13} className="text-[#F97316]" />
              sales@vladenza.com
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

          {/* Link Building */}
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">Link Building</p>
            <ul className="flex flex-col gap-2">
              {linkBuildingLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-gray-400 text-sm hover:text-[#F97316] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">Company</p>
            <ul className="flex flex-col gap-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('mailto:') ? (
                    <a href={link.href} className="text-gray-400 text-sm hover:text-[#F97316] transition-colors">{link.label}</a>
                  ) : (
                    <Link to={link.href} className="text-gray-400 text-sm hover:text-[#F97316] transition-colors">{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">Resources</p>
            <ul className="flex flex-col gap-2">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  {link.href.startsWith('mailto:') ? (
                    <a href={link.href} className="text-gray-400 text-sm hover:text-[#F97316] transition-colors">{link.label}</a>
                  ) : link.href.startsWith('/#') ? (
                    <a href={link.href} className="text-gray-400 text-sm hover:text-[#F97316] transition-colors">{link.label}</a>
                  ) : (
                    <Link to={link.href} className="text-gray-400 text-sm hover:text-[#F97316] transition-colors">{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">Legal</p>
            <ul className="flex flex-col gap-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-gray-400 text-sm hover:text-[#F97316] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs">
            &copy; {year} Vladenza Agency. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/privacy-policy" className="text-gray-600 text-xs hover:text-gray-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-gray-600 text-xs hover:text-gray-300 transition-colors">Terms</Link>
            <Link to="/refund-policy" className="text-gray-600 text-xs hover:text-gray-300 transition-colors">Refunds</Link>
            <button onClick={openPreferences} className="text-gray-600 text-xs hover:text-gray-300 transition-colors">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
