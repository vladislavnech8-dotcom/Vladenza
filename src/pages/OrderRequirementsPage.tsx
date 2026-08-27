import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import Navigation from '../components/Navigation';

interface PlacementSection {
  placementId: string;
  packageLabel: string;
  productId: string;
}

interface RequirementForm {
  targetUrl: string;
  anchor: string;
  niche: string;
  notes: string;
  willProvideLater: boolean;
}

type PageState = 'loading' | 'form' | 'submitting' | 'success' | 'already-submitted' | 'invalid' | 'error';

const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#F97316]/60 focus:ring-2 focus:ring-[#F97316]/10 transition-all';
const labelCls = 'block text-xs font-semibold text-gray-500 mb-1.5';

export default function OrderRequirementsPage() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<PageState>('loading');
  const [orderNumber, setOrderNumber] = useState('');
  const [placements, setPlacements] = useState<PlacementSection[]>([]);
  const [forms, setForms] = useState<RequirementForm[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOrder = useCallback(async () => {
    if (!token) {
      setState('invalid');
      return;
    }

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/order-requirements?token=${encodeURIComponent(token || '')}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        if (data?.error?.includes('already')) {
          setState('already-submitted');
          setOrderNumber(data.orderNumber || '');
          return;
        }
        setState('invalid');
        return;
      }

      if (data.alreadySubmitted) {
        setState('already-submitted');
        setOrderNumber(data.orderNumber || '');
        return;
      }

      const pls = data.placements as PlacementSection[];
      setPlacements(pls);
      setOrderNumber(data.orderNumber || '');
      setForms(
        pls.map(() => ({
          targetUrl: '',
          anchor: '',
          niche: '',
          notes: '',
          willProvideLater: false,
        }))
      );
      setState('form');
    } catch {
      setState('error');
      setErrorMsg('Could not load order details. Please try again or contact support.');
    }
  }, [token]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const updateForm = (idx: number, patch: Partial<RequirementForm>) => {
    setForms((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('submitting');
    setErrorMsg('');

    try {
      const postUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/order-requirements?token=${encodeURIComponent(token || '')}`;
      const res = await fetch(postUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requirements: forms }),
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        setState('error');
        setErrorMsg(data?.error || 'Could not save requirements. Please try again.');
        return;
      }

      setState('success');
    } catch {
      setState('error');
      setErrorMsg('Could not save requirements. Please try again or contact support.');
    }
  };

  // Loading state
  if (state === 'loading') {
    return (
      <div className="bg-white min-h-screen">
        <Navigation />
        <div className="pt-[88px] max-w-2xl mx-auto px-6 py-20 text-center">
          <Loader2 size={32} className="text-[#F97316] animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading your order...</p>
        </div>
      </div>
    );
  }

  // Invalid/expired token
  if (state === 'invalid') {
    return (
      <div className="bg-white min-h-screen">
        <Navigation />
        <div className="pt-[88px] max-w-2xl mx-auto px-6 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Invalid or Expired</h1>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
            This requirements link is no longer valid. If you believe this is an error, please contact us at{' '}
            <a href="mailto:info@vladenza.com" className="text-[#F97316] font-semibold">info@vladenza.com</a>.
          </p>
          <Link to="/" className="text-sm font-semibold text-[#F97316] hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  // Already submitted
  if (state === 'already-submitted') {
    return (
      <div className="bg-white min-h-screen">
        <Navigation />
        <div className="pt-[88px] max-w-2xl mx-auto px-6 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Requirements Already Submitted</h1>
          {orderNumber && <p className="text-gray-400 text-sm mb-1">Order #{orderNumber}</p>}
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
            We've already received your link requirements for this order. Our team is reviewing them now.
          </p>
          <Link to="/" className="text-sm font-semibold text-[#F97316] hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  // Success state
  if (state === 'success') {
    return (
      <div className="bg-white min-h-screen">
        <Navigation />
        <div className="pt-[88px] max-w-2xl mx-auto px-6 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Requirements Saved</h1>
          {orderNumber && <p className="text-gray-400 text-sm mb-1">Order #{orderNumber}</p>}
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            Thank you! We've received your link requirements. Our team will review them and begin sourcing placements shortly.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 max-w-md mx-auto mb-6 text-left">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">What happens next?</h3>
            <ul className="flex flex-col gap-2">
              {[
                'We review your website and requirements',
                'We source placements within the selected metrics',
                'Placements are manually checked before delivery',
                "You'll receive the completed links in your order report",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <Link to="/" className="text-sm font-semibold text-[#F97316] hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  // Error state
  if (state === 'error') {
    return (
      <div className="bg-white min-h-screen">
        <Navigation />
        <div className="pt-[88px] max-w-2xl mx-auto px-6 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">{errorMsg || 'An unexpected error occurred.'}</p>
          <button
            onClick={() => { setState('form'); setErrorMsg(''); }}
            className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors mr-3"
          >
            Try Again
          </button>
          <a href="mailto:info@vladenza.com" className="text-sm font-semibold text-gray-500 hover:text-gray-700">Contact Support</a>
        </div>
      </div>
    );
  }

  // Form state (includes submitting)
  const submitting = state === 'submitting';

  return (
    <div className="bg-white min-h-screen">
      <Navigation />
      <div className="pt-[88px]">
        <div className="border-b border-gray-100 bg-gray-50">
          <div className="max-w-3xl mx-auto px-6 py-4">
            <Link to="/" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Back to Home</Link>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Add Your Link Requirements</h1>
          {orderNumber && <p className="text-gray-400 text-sm mb-6">Order #{orderNumber}</p>}
          <p className="text-gray-500 text-sm mb-8">
            Tell us where each link should point. Fill in the target URL, preferred anchor text, and website niche for each placement below.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {placements.map((placement, idx) => (
              <div key={placement.placementId} className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Placement {idx + 1}</span>
                  <span className="text-xs font-semibold text-gray-300">{placement.packageLabel}</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className={labelCls}>Target URL *</label>
                    <input
                      type="url"
                      value={forms[idx]?.targetUrl || ''}
                      onChange={(e) => updateForm(idx, { targetUrl: e.target.value })}
                      placeholder="https://example.com/page"
                      disabled={forms[idx]?.willProvideLater || submitting}
                      className={`${inputCls} ${forms[idx]?.willProvideLater ? 'opacity-50' : ''}`}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Preferred Anchor Text *</label>
                    <input
                      type="text"
                      value={forms[idx]?.anchor || ''}
                      onChange={(e) => updateForm(idx, { anchor: e.target.value })}
                      placeholder="best crm software"
                      disabled={forms[idx]?.willProvideLater || submitting}
                      className={`${inputCls} ${forms[idx]?.willProvideLater ? 'opacity-50' : ''}`}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className={labelCls}>Website Niche / Topic *</label>
                  <input
                    type="text"
                    value={forms[idx]?.niche || ''}
                    onChange={(e) => updateForm(idx, { niche: e.target.value })}
                    placeholder="e.g. SaaS, Marketing, Finance"
                    disabled={forms[idx]?.willProvideLater || submitting}
                    className={`${inputCls} ${forms[idx]?.willProvideLater ? 'opacity-50' : ''}`}
                  />
                </div>

                <div className="mb-3">
                  <label className={labelCls}>Additional Notes</label>
                  <input
                    type="text"
                    value={forms[idx]?.notes || ''}
                    onChange={(e) => updateForm(idx, { notes: e.target.value })}
                    placeholder="Optional: competitor pages, anchor restrictions, etc."
                    disabled={forms[idx]?.willProvideLater || submitting}
                    className={`${inputCls} ${forms[idx]?.willProvideLater ? 'opacity-50' : ''}`}
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={forms[idx]?.willProvideLater || false}
                    onChange={(e) => updateForm(idx, { willProvideLater: e.target.checked })}
                    disabled={submitting}
                    className="accent-[#F97316]"
                  />
                  I will provide details for this placement later
                </label>
              </div>
            ))}

            {errorMsg && (
              <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-orange-200"
            >
              {submitting ? (
                <><Loader2 size={15} className="animate-spin" /> Saving...</>
              ) : (
                <>Save Requirements <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Need help? Email us at{' '}
              <a href="mailto:info@vladenza.com" className="text-[#F97316] font-semibold">info@vladenza.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
