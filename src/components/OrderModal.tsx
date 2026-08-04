import { useState, useEffect } from 'react';
import { X, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { trackConversion } from '../lib/gtag';

export interface Package {
  name: string;
  price: string;
  links: string;
  service?: string;
}

interface OrderModalProps {
  pkg: Package | null;
  onClose: () => void;
}

const BUDGET_OPTIONS = [
  { value: '$500–1,000', label: '$500 – $1,000' },
  { value: '$1,000–3,000', label: '$1,000 – $3,000' },
  { value: '$3,000+', label: '$3,000+' },
  { value: 'Not sure', label: 'Not sure yet' },
];

export default function OrderModal({ pkg, onClose }: OrderModalProps) {
  const [email, setEmail] = useState('');
  const [messenger, setMessenger] = useState('');
  const [website, setWebsite] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (pkg) {
      setEmail(''); setMessenger(''); setWebsite(''); setBudget('');
      setDone(false); setError('');
    }
  }, [pkg]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!pkg) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pkg) return;
    setError('');
    setLoading(true);

    try {
      const serviceLabel = pkg.service || pkg.name;

      const { error: dbError } = await supabase.from('leads').insert({
        email,
        messenger: messenger || '',
        website: website || '',
        service: serviceLabel,
        package: pkg.name,
        package_details: `${pkg.links} · ${pkg.price}`,
        budget: budget || 'Not specified',
        source: 'vladenza.com',
      });

      if (dbError) {
        setError(dbError.message || 'Something went wrong. Please try again.');
        return;
      }

      fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/inbound-lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email,
          messenger: messenger || undefined,
          website: website || undefined,
          source: 'vladenza.com',
          service: serviceLabel,
          message: `${serviceLabel} — ${pkg.name} (${pkg.links} · ${pkg.price})`,
          _ts: Date.now() - 5000,
        }),
      }).catch(() => {});

      setDone(true);
      trackConversion();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white w-full sm:max-w-[400px] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-950 px-5 pt-5 pb-4">
          <div className="flex items-start justify-between">
            <div>
              {pkg.service && <div className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-1">{pkg.service}</div>}
              <div className="text-white font-bold text-lg leading-tight">{pkg.name}</div>
              <div className="text-[#F97316] text-sm font-semibold mt-0.5">{pkg.links} &nbsp;·&nbsp; {pkg.price}</div>
            </div>
            <button onClick={onClose} className="mt-0.5 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        {done ? (
          <div className="px-5 py-9 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle size={24} className="text-green-500" />
            </div>
            <p className="font-bold text-gray-900">Request received!</p>
            <p className="text-gray-400 text-sm">We'll contact you within 1 business day.</p>
            <button onClick={onClose} className="mt-1 text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-5 space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Email *</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#F97316] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Telegram or WhatsApp <span className="normal-case font-normal text-gray-300">(optional)</span>
              </label>
              <input
                type="text" value={messenger} onChange={(e) => setMessenger(e.target.value)}
                placeholder="@username or +1 234 567 8900"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#F97316] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Website <span className="normal-case font-normal text-gray-300">(optional)</span>
              </label>
              <input
                type="text" value={website} onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yoursite.com"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#F97316] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Monthly Budget <span className="normal-case font-normal text-gray-300">(optional)</span>
              </label>
              <select
                value={budget} onChange={(e) => setBudget(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#F97316] transition-colors bg-white"
              >
                <option value="">Select budget range…</option>
                {BUDGET_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-colors mt-1"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <><span>Send Request</span><ArrowRight size={13} /></>}
            </button>
            <p className="text-center text-[11px] text-gray-400">We'll reply within 1 business day</p>
          </form>
        )}
      </div>
    </div>
  );
}
