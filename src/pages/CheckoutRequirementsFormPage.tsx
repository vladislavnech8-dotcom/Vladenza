import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Trash2, ArrowRight, Upload } from 'lucide-react';
import CheckoutLayout from '../components/CheckoutLayout';
import { useCart } from '../context/CartContext';
import { useCheckout, type TargetRequirement } from '../context/CheckoutContext';
import { trackEvent } from '../lib/analytics';

const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#F97316]/60 focus:ring-2 focus:ring-[#F97316]/10 transition-all';
const labelCls = 'block text-xs font-semibold text-gray-500 mb-1.5';

export default function CheckoutRequirementsFormPage() {
  const { items, itemCount } = useCart();
  const { data, update } = useCheckout();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [csvError, setCsvError] = useState('');

  const totalPlacements = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);

  if (itemCount === 0) {
    return (
      <CheckoutLayout step={2}>
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
          <p className="text-gray-400 text-sm">Your cart is empty.</p>
          <Link to="/services/niche-edits#packages" className="text-sm font-semibold text-[#F97316] hover:underline">
            Browse Packages
          </Link>
        </div>
      </CheckoutLayout>
    );
  }

  const allocated = data.targets.reduce((s, t) => s + (t.quantity || 0), 0);
  const remaining = totalPlacements - allocated;

  const updateTarget = (idx: number, patch: Partial<TargetRequirement>) => {
    const newTargets = [...data.targets];
    newTargets[idx] = { ...newTargets[idx], ...patch };
    update({ targets: newTargets });
  };

  const addTarget = () => {
    update({ targets: [...data.targets, { url: '', anchor: '', niche: '', country: '', notes: '', quantity: 0 }] });
  };

  const removeTarget = (idx: number) => {
    update({ targets: data.targets.filter((_, i) => i !== idx) });
  };

  const handleCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCsvError('');
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || '');
        const lines = text.split(/\r?\n/).filter((l) => l.trim());
        if (lines.length < 2) { setCsvError('CSV needs a header row and at least one data row.'); return; }
        const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
        const urlIdx = headers.indexOf('target url');
        const anchorIdx = headers.indexOf('anchor');
        const qtyIdx = headers.indexOf('quantity');
        const nicheIdx = headers.indexOf('niche');
        const countryIdx = headers.indexOf('country');
        const notesIdx = headers.indexOf('notes');
        if (urlIdx === -1) { setCsvError('CSV must have a "Target URL" column.'); return; }

        const parsed: TargetRequirement[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.trim());
          parsed.push({
            url: cols[urlIdx] || '',
            anchor: anchorIdx >= 0 ? cols[anchorIdx] || '' : '',
            quantity: qtyIdx >= 0 ? parseInt(cols[qtyIdx], 10) || 1 : 1,
            niche: nicheIdx >= 0 ? cols[nicheIdx] || '' : '',
            country: countryIdx >= 0 ? cols[countryIdx] || '' : '',
            notes: notesIdx >= 0 ? cols[notesIdx] || '' : '',
          });
        }
        update({ targets: parsed, provideLater: false });
      } catch {
        setCsvError('Could not parse CSV file.');
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (data.provideLater) {
      trackEvent('requirements_completed', { status: 'pending' });
      navigate('/checkout/review');
      return;
    }

    if (remaining !== 0) {
      setError(`Allocated quantities (${allocated}) must equal total placements (${totalPlacements}). ${remaining > 0 ? `${remaining} unallocated.` : `${Math.abs(remaining)} over-allocated.`}`);
      return;
    }

    const hasUrl = data.targets.some((t) => t.url.trim());
    if (!hasUrl) {
      setError('At least one target URL is required, or choose "send later".');
      return;
    }

    trackEvent('requirements_completed', { status: 'provided', targets: data.targets.length });
    navigate('/checkout/review');
  };

  return (
    <CheckoutLayout step={2}>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Requirements</h1>
      <p className="text-gray-500 text-sm mb-6">
        You're ordering <span className="font-semibold text-gray-900">{totalPlacements}</span> placement{totalPlacements !== 1 ? 's' : ''}. Allocate them across target URLs below.
      </p>

      {/* Provide later toggle */}
      <label className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 cursor-pointer hover:bg-gray-100/50 transition-colors">
        <input
          type="checkbox"
          checked={data.provideLater}
          onChange={(e) => update({ provideLater: e.target.checked })}
          className="w-4 h-4 rounded accent-[#F97316]"
        />
        <div>
          <div className="text-sm font-semibold text-gray-900">I'll send requirements later</div>
          <div className="text-xs text-gray-400">Checkout continues. We'll contact you after payment to collect details.</div>
        </div>
      </label>

      {!data.provideLater && (
        <>
          {/* CSV upload */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 font-semibold px-4 py-2.5 rounded-lg text-sm transition-all cursor-pointer">
                <Upload size={14} />
                Upload CSV
                <input type="file" accept=".csv" onChange={handleCsv} className="hidden" />
              </label>
              <span className="text-xs text-gray-400">Columns: Target URL, Anchor, Quantity, Niche, Country, Notes</span>
            </div>
            {csvError && <p className="text-red-500 text-xs mt-2">{csvError}</p>}
          </div>

          {/* Target URL cards */}
          <div className="flex flex-col gap-4 mb-6">
            {data.targets.map((target, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Target {idx + 1}</span>
                  {data.targets.length > 1 && (
                    <button onClick={() => removeTarget(idx)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Target URL *</label>
                    <input
                      type="url"
                      value={target.url}
                      onChange={(e) => updateTarget(idx, { url: e.target.value })}
                      placeholder="https://client.com/page"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Anchor text</label>
                    <input
                      type="text"
                      value={target.anchor}
                      onChange={(e) => updateTarget(idx, { anchor: e.target.value })}
                      placeholder="best accounting software"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Quantity for this URL</label>
                    <input
                      type="number"
                      min={1}
                      value={target.quantity || ''}
                      onChange={(e) => updateTarget(idx, { quantity: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Website / niche</label>
                    <input
                      type="text"
                      value={target.niche}
                      onChange={(e) => updateTarget(idx, { niche: e.target.value })}
                      placeholder="SaaS / accounting"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Target country</label>
                    <input
                      type="text"
                      value={target.country}
                      onChange={(e) => updateTarget(idx, { country: e.target.value })}
                      placeholder="United States"
                      className={inputCls}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Notes</label>
                    <textarea
                      value={target.notes}
                      onChange={(e) => updateTarget(idx, { notes: e.target.value })}
                      placeholder="Avoid casino-related sites. Prefer B2B/SaaS content."
                      rows={2}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addTarget}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors mb-6"
          >
            <Plus size={15} /> Add another target URL
          </button>

          {/* Allocation summary */}
          <div className={`rounded-xl p-4 mb-6 text-sm ${remaining === 0 ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
            {remaining === 0
              ? `All ${totalPlacements} placements allocated.`
              : remaining > 0
                ? `${remaining} of ${totalPlacements} placements still unallocated.`
                : `${Math.abs(remaining)} over-allocated. Reduce quantities to match ${totalPlacements} total.`
            }
          </div>
        </>
      )}

      {error && (
        <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-3.5 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-orange-200"
      >
        Continue to Review <ArrowRight size={15} />
      </button>
    </CheckoutLayout>
  );
}
