import { useState, useEffect } from 'react';
import { X, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { trackConversion } from '../lib/gtag';

const BUDGET_OPTIONS = [
  { value: 'Under $500', label: 'Under $500' },
  { value: '$500–1,000', label: '$500 – $1,000' },
  { value: '$1,000–2,500', label: '$1,000 – $2,500' },
  { value: '$2,500–5,000', label: '$2,500 – $5,000' },
  { value: '$5,000+', label: '$5,000+' },
];

const GOAL_OPTIONS = [
  'Build referring domains',
  'Improve commercial pages',
  'Compete with stronger domains',
  'Build a mixed link profile',
  'Not sure',
];

const inputCls = 'w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F97316] transition-colors';

interface LinkPlanModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LinkPlanModal({ open, onClose }: LinkPlanModalProps) {
  const [website, setWebsite] = useState('');
  const [budget, setBudget] = useState('');
  const [goal, setGoal] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setWebsite(''); setBudget(''); setGoal(''); setEmail(''); setNotes('');
      setDone(false); setError('');
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!website.trim() || !email.trim()) return;

    setError('');
    setLoading(true);

    try {
      const { error: dbError } = await supabase.from('leads').insert({
        name: '',
        email,
        website,
        service: 'Niche Edits — Link Plan',
        package: 'Link Plan Request',
        package_details: `Budget: ${budget || 'Not specified'} | Goal: ${goal || 'Not specified'}`,
        budget: budget || 'Not specified',
        message: notes || '',
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
          website,
          message: `Link Plan Request — Budget: ${budget || 'N/A'} | Goal: ${goal || 'N/A'}${notes ? ` | Notes: ${notes}` : ''}`,
          source: 'vladenza.com',
          service: 'Niche Edits — Link Plan',
          _ts: Date.now() - 5000,
        }),
      }).catch(() => {});

      setDone(true);
      trackConversion();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white w-full sm:max-w-[420px] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gray-950 px-5 pt-5 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-white font-bold text-lg leading-tight">Get a Link Plan</div>
              <div className="text-gray-400 text-xs mt-0.5">We'll review your profile and suggest a link mix.</div>
            </div>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>

        {done ? (
          <div className="px-5 py-9 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="font-bold text-gray-900">Request received!</p>
            <p className="text-gray-400 text-sm">We'll review your site and send a link plan within 1 business day.</p>
            <button onClick={onClose} className="mt-1 text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-5 space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Website *</label>
              <input type="url" required value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yoursite.com" className={inputCls} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Budget</label>
              <select value={budget} onChange={(e) => setBudget(e.target.value)} className={`${inputCls} bg-white cursor-pointer`}>
                <option value="">Select budget range…</option>
                {BUDGET_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Main goal</label>
              <select value={goal} onChange={(e) => setGoal(e.target.value)} className={`${inputCls} bg-white cursor-pointer`}>
                <option value="">Select a goal (optional)…</option>
                {GOAL_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Email *</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className={inputCls} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Notes <span className="normal-case font-normal text-gray-300">(optional)</span></label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything we should know about your campaign" rows={2} className={inputCls} />
            </div>

            {error && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-colors mt-1">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <>Get My Link Plan <ArrowRight size={13} /></>}
            </button>
            <p className="text-center text-[11px] text-gray-400">No spam. No credit card. We'll reply within 1 business day.</p>
          </form>
        )}
      </div>
    </div>
  );
}
