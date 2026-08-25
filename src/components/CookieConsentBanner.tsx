import { useState } from 'react';
import { Cookie, Check, X, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCookieConsent } from '../context/CookieConsentContext';

export default function CookieConsentBanner() {
  const { showBanner, showPreferences, consent, setConsent, openPreferences, closePreferences } = useCookieConsent();
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  if (!showBanner && !showPreferences && consent !== null) return null;

  // Preferences modal
  if (showPreferences) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900">Cookie Preferences</h3>
            <button onClick={closePreferences} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={18} />
            </button>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            Choose which categories of cookies you allow. Essential cookies are always enabled.
          </p>

          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5">
              <div>
                <p className="text-sm font-semibold text-gray-900">Essential</p>
                <p className="text-xs text-gray-400">Required for the website to function</p>
              </div>
              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">Always on</span>
            </div>
            <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3.5">
              <div>
                <p className="text-sm font-semibold text-gray-900">Analytics & Marketing</p>
                <p className="text-xs text-gray-400">Google Analytics &amp; Google Ads</p>
              </div>
              <button
                onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                className={`relative w-10 h-6 rounded-full transition-colors ${analyticsEnabled ? 'bg-[#F97316]' : 'bg-gray-200'}`}
                aria-label="Toggle analytics cookies"
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${analyticsEnabled ? 'translate-x-4' : ''}`} />
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setConsent(analyticsEnabled ? 'accepted' : 'rejected')}
              className="flex-1 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
            >
              Save Preferences
            </button>
            <button
              onClick={closePreferences}
              className="border border-gray-200 hover:border-gray-300 text-gray-600 font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Banner
  if (showBanner) {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-[60]">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-200/80 p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
              <Cookie size={16} className="text-[#F97316]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">Cookies &amp; Privacy</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                We use essential cookies to operate the website and optional analytics/marketing cookies to understand performance and improve our services.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex gap-2">
              <button
                onClick={() => setConsent('accepted')}
                className="flex-1 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Check size={12} /> Accept All
              </button>
              <button
                onClick={() => setConsent('rejected')}
                className="flex-1 border border-gray-200 hover:border-gray-300 text-gray-600 font-semibold py-2 rounded-lg text-xs transition-colors"
              >
                Reject Optional
              </button>
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={openPreferences}
                className="text-xs text-gray-500 hover:text-[#F97316] font-semibold flex items-center gap-1 transition-colors"
              >
                <Settings size={11} /> Preferences
              </button>
              <Link to="/cookie-policy" className="text-xs text-gray-400 hover:text-[#F97316] transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
