import { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Minus, Plus, Trash2, Check, Loader2, CheckCircle, AlertCircle, CreditCard, ClipboardPaste, Lock } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useCart } from '../context/CartContext';
import { useCheckout, type PlacementRequirement } from '../context/CheckoutContext';
import { payWithWayForPay } from '../lib/wayforpay';
import { trackEvent, trackMetaEvent } from '../lib/analytics';

type Step = 1 | 2 | 3 | 4;
const STEPS = ['Cart', 'Requirements', 'Review', 'Payment'] as const;

const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#F97316]/60 focus:ring-2 focus:ring-[#F97316]/10 transition-all';
const labelCls = 'block text-xs font-semibold text-gray-500 mb-1.5';

function OrderSummary() {
  const { items, total } = useCart();
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Order Summary</h3>
      <div className="flex flex-col gap-2 mb-4">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{item.quantity} × {item.name}</span>
            <span className="font-semibold text-gray-900">${(item.unitPrice * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-sm font-semibold text-gray-500">Total</span>
        <span className="text-xl font-black text-gray-900">${total.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400">
        <Lock size={11} /> Secure payment
      </div>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const active = stepNum === step;
        const done = stepNum < step;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${active ? 'bg-[#F97316] text-white' : done ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-400'}`}>
              {done ? <Check size={11} /> : stepNum}
            </div>
            <span className={`text-xs font-semibold hidden sm:inline ${active ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
            {i < STEPS.length - 1 && <div className="w-6 h-px bg-gray-200 mx-1" />}
          </div>
        );
      })}
    </div>
  );
}

export default function CheckoutPage() {
  const { items, total, itemCount, updateQuantity, removeItem, clear } = useCart();
  const { data, update } = useCheckout();
  const [step, setStep] = useState<Step>(itemCount === 0 ? 1 : 2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [outcome, setOutcome] = useState<'approved' | 'declined' | 'pending' | null>(null);
  const [paidOrderRef, setPaidOrderRef] = useState('');
  const [paidOrderNumber, setPaidOrderNumber] = useState('');
  const [paidRequirementsToken, setPaidRequirementsToken] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [showBulk, setShowBulk] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const initiateCheckoutFired = useRef(false);

  // Generate placement requirements from cart items
  const placementReqs = useMemo<PlacementRequirement[]>(() => {
    if (data.placementRequirements.length > 0) return data.placementRequirements;
    const reqs: PlacementRequirement[] = [];
    for (const item of items) {
      for (let i = 0; i < item.quantity; i++) {
        reqs.push({
          cartItemId: `${item.productId}-${i}`,
          packageLabel: item.name,
          targetUrl: '',
          anchor: '',
          letVladenzaRecommend: false,
          notes: '',
        });
      }
    }
    return reqs;
  }, [items, data.placementRequirements]);

  const providedCount = placementReqs.filter((r) => r.targetUrl.trim()).length;

  // Step 1: Cart
  if (itemCount === 0 && step !== 4) {
    return (
      <div className="bg-white min-h-screen">
        <Navigation />
        <div className="pt-[88px] max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-gray-400 text-sm mb-4">Your cart is empty.</p>
          <Link to="/services/niche-edits#packages" className="text-sm font-semibold text-[#F97316] hover:underline">
            Browse Niche Edit Packages
          </Link>
        </div>
      </div>
    );
  }

  const updatePlacementReq = (idx: number, patch: Partial<PlacementRequirement>) => {
    const newReqs = [...placementReqs];
    newReqs[idx] = { ...newReqs[idx], ...patch };
    update({ placementRequirements: newReqs });
  };

  const parseBulk = () => {
    const lines = bulkText.trim().split('\n').filter((l) => l.trim());
    const parsed: { url: string; anchor: string }[] = [];
    for (const line of lines) {
      const parts = line.split('|').map((p) => p.trim());
      if (parts[0]) parsed.push({ url: parts[0], anchor: parts[1] || '' });
    }
    if (parsed.length === 0) { setError('No valid rows found. Use: URL | Anchor'); return; }
    const newReqs = [...placementReqs];
    for (let i = 0; i < Math.min(parsed.length, newReqs.length); i++) {
      newReqs[i] = { ...newReqs[i], targetUrl: parsed[i].url, anchor: parsed[i].anchor };
    }
    update({ placementRequirements: newReqs });
    setShowBulk(false);
    setBulkText('');
    setError('');
  };

  const handleContinueFromRequirements = () => {
    if (data.requirementsChoice === 'later') {
      update({ placementRequirements: [] });
    }
    trackEvent('requirements_completed', { status: data.requirementsChoice === 'later' ? 'pending' : 'provided', count: providedCount });
    setStep(3);
  };

  const handleContinueFromReview = () => {
    setStep(4);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.customerName.trim() || !data.customerEmail.trim()) {
      setError('Name and email are required.');
      return;
    }
    if (!agreedToTerms) {
      setError('Please agree to the Terms & Conditions, Privacy Policy and Refund Policy to continue.');
      return;
    }
    setError('');
    setLoading(true);
    setOutcome(null);

    const cartItems = items.map((i) => ({ productId: i.productId, name: i.name, unitPrice: i.unitPrice, quantity: i.quantity }));
    trackEvent('add_payment_info', { total, itemCount });

    try {
      const result = await payWithWayForPay({
        items: cartItems,
        name: data.customerName,
        email: data.customerEmail,
        website: data.customerWebsite,
        company: data.customerCompany,
        requirements: data.requirementsChoice === 'later' ? null : placementReqs,
        requirementsStatus: data.requirementsChoice === 'later' ? 'pending' : 'provided',
      });
      setOutcome(result.outcome);
      setPaidOrderRef(result.orderRef);
      setPaidOrderNumber(result.orderNumber);
      setPaidRequirementsToken(result.requirementsToken);
      if (result.outcome === 'approved') {
        trackEvent('purchase', { value: total, currency: 'USD', transaction_id: result.orderNumber, items: items.length });
        trackMetaEvent('Purchase', {
          value: total,
          currency: 'USD',
          content_ids: items.map((i) => i.productId),
          content_type: 'product',
          num_items: itemCount,
          contents: items.map((i) => ({ id: i.productId, quantity: i.quantity, item_price: i.unitPrice })),
        });
        clear();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment could not be started. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (outcome === 'approved') {
    return (
      <div className="bg-white min-h-screen">
        <Navigation />
        <div className="pt-[88px] max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed</h1>
          <p className="text-gray-400 text-sm mb-1">Order #{paidOrderNumber || paidOrderRef}</p>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            We've received your order. {data.requirementsChoice === 'later'
              ? "We still need your link requirements — add them below or we'll reach out by email."
              : "We've received your link requirements and will review them before sourcing placements."}
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 max-w-md mx-auto mb-6 text-left">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">What happens next?</h3>
            <ul className="flex flex-col gap-2">
              {["We review your website and requirements", "We source placements within the selected metrics", "Placements are manually checked before delivery", "You'll receive the completed links in your order report"].map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={14} className="text-green-500 flex-shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {data.requirementsChoice === 'later' && paidRequirementsToken && (
              <Link to={`/order/${paidRequirementsToken}`} className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-5 py-3 rounded-lg text-sm transition-colors">
                Add Requirements
              </Link>
            )}
            <Link to="/services/niche-edits" className="border border-gray-200 hover:border-gray-300 text-gray-600 font-semibold px-5 py-3 rounded-lg text-sm transition-colors">
              Back to Niche Edits
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Declined / pending screens
  if (outcome === 'declined' || outcome === 'pending') {
    return (
      <div className="bg-white min-h-screen">
        <Navigation />
        <div className="pt-[88px] max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${outcome === 'declined' ? 'bg-red-50' : 'bg-orange-50'}`}>
            {outcome === 'declined' ? <AlertCircle size={32} className="text-red-500" /> : <Loader2 size={32} className="text-[#F97316] animate-spin" />}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{outcome === 'declined' ? 'Payment declined' : 'Payment processing'}</h1>
          <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
            {outcome === 'declined' ? "Your card wasn't charged. You can try again." : `We'll email you at ${data.customerEmail} as soon as it's confirmed.`}
          </p>
          {outcome === 'declined' && (
            <button onClick={() => setOutcome(null)} className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors">
              Try again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Navigation />
      <div className="pt-[88px]">
        {/* Header with stepper */}
        <div className="border-b border-gray-100 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
            <Link to="/services/niche-edits" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mr-4">
              <ArrowLeft size={12} /> Back
            </Link>
            <Stepper step={step} />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid lg:grid-cols-[1fr_300px] gap-8">
            {/* LEFT: current step */}
            <div>
              {/* Step 1: Cart */}
              {step === 1 && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>
                  <div className="flex flex-col gap-3 mb-8">
                    {items.map((item) => (
                      <div key={item.productId} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-400">{item.description}</div>
                          </div>
                          <button onClick={() => { removeItem(item.productId); trackEvent('remove_from_cart', { product_id: item.productId }); }} className="text-gray-300 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#F97316] hover:text-[#F97316] transition-colors">
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-semibold text-gray-900 w-8 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#F97316] hover:text-[#F97316] transition-colors">
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="text-sm font-bold text-gray-900">${(item.unitPrice * item.quantity).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => {
                    if (!initiateCheckoutFired.current) {
                      initiateCheckoutFired.current = true;
                      trackMetaEvent('InitiateCheckout', {
                        value: total,
                        currency: 'USD',
                        num_items: itemCount,
                        content_ids: items.map((i) => i.productId),
                        content_type: 'product',
                        contents: items.map((i) => ({ id: i.productId, quantity: i.quantity, item_price: i.unitPrice })),
                      });
                    }
                    setStep(2);
                    trackEvent('begin_checkout', { total, itemCount });
                  }} className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-3.5 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-orange-200">
                    Continue to Requirements <ArrowRight size={15} />
                  </button>
                </div>
              )}

              {/* Step 2: Requirements */}
              {step === 2 && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Tell Us Where the Links Should Point</h1>
                  <p className="text-gray-500 text-sm mb-6">Add your target URLs and preferred anchors now, or send the requirements after checkout.</p>

                  {/* Two choices */}
                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    <button
                      onClick={() => update({ requirementsChoice: 'now' })}
                      className={`border-2 rounded-xl p-4 text-left transition-all ${data.requirementsChoice === 'now' ? 'border-[#F97316] bg-orange-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${data.requirementsChoice === 'now' ? 'border-[#F97316] bg-[#F97316]' : 'border-gray-300'}`}>
                          {data.requirementsChoice === 'now' && <Check size={11} className="text-white" />}
                        </div>
                        <span className="text-sm font-bold text-gray-900">Add Requirements Now</span>
                      </div>
                      <p className="text-xs text-gray-400 ml-7">Fill in target URLs and anchors for each placement.</p>
                    </button>
                    <button
                      onClick={() => update({ requirementsChoice: 'later' })}
                      className={`border-2 rounded-xl p-4 text-left transition-all ${data.requirementsChoice === 'later' ? 'border-[#F97316] bg-orange-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${data.requirementsChoice === 'later' ? 'border-[#F97316] bg-[#F97316]' : 'border-gray-300'}`}>
                          {data.requirementsChoice === 'later' && <Check size={11} className="text-white" />}
                        </div>
                        <span className="text-sm font-bold text-gray-900">I'll Send Them Later</span>
                      </div>
                      <p className="text-xs text-gray-400 ml-7">Checkout now, provide requirements after payment.</p>
                    </button>
                  </div>

                  {/* Requirements form */}
                  {data.requirementsChoice === 'now' && (
                    <>
                      {/* Bulk paste */}
                      <div className="mb-4">
                        {!showBulk ? (
                          <button onClick={() => setShowBulk(true)} className="inline-flex items-center gap-2 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
                            <ClipboardPaste size={14} /> Ordering multiple links? Paste Requirements
                          </button>
                        ) : (
                          <div className="border border-gray-200 rounded-xl p-4">
                            <label className={labelCls}>Paste rows: URL | Anchor (one per line)</label>
                            <textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} rows={5} placeholder="https://site.com/page1 | CRM software&#10;https://site.com/page2 | marketing automation" className={inputCls} />
                            <div className="flex gap-2 mt-2">
                              <button onClick={parseBulk} className="text-xs font-semibold bg-[#F97316] hover:bg-[#EA580C] text-white px-3 py-2 rounded-lg transition-colors">Apply</button>
                              <button onClick={() => setShowBulk(false)} className="text-xs font-semibold text-gray-400 hover:text-gray-600 px-3 py-2">Cancel</button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Per-placement compact rows */}
                      <div className="flex flex-col gap-2 mb-4">
                        {placementReqs.map((req, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-3.5">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Link {idx + 1}</span>
                              <span className="text-[10px] font-semibold text-gray-300">{req.packageLabel}</span>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-2.5">
                              <div>
                                <label className={labelCls}>Target URL *</label>
                                <input type="url" value={req.targetUrl} onChange={(e) => updatePlacementReq(idx, { targetUrl: e.target.value })} placeholder="https://example.com/page" className={inputCls} />
                              </div>
                              <div>
                                <label className={labelCls}>Preferred Anchor</label>
                                <input type="text" value={req.anchor} onChange={(e) => updatePlacementReq(idx, { anchor: e.target.value, letVladenzaRecommend: false })} placeholder="best crm software" disabled={req.letVladenzaRecommend} className={`${inputCls} ${req.letVladenzaRecommend ? 'opacity-50' : ''}`} />
                                <label className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400 cursor-pointer">
                                  <input type="checkbox" checked={req.letVladenzaRecommend} onChange={(e) => updatePlacementReq(idx, { letVladenzaRecommend: e.target.checked })} className="accent-[#F97316]" />
                                  Let Vladenza recommend the anchor
                                </label>
                              </div>
                            </div>
                            <div className="mt-2">
                              <input type="text" value={req.notes} onChange={(e) => updatePlacementReq(idx, { notes: e.target.value })} placeholder="Notes (optional)" className={inputCls} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Campaign notes */}
                      <div className="mb-6">
                        <label className={labelCls}>Campaign Notes</label>
                        <textarea value={data.campaignNotes} onChange={(e) => update({ campaignNotes: e.target.value })} rows={2} placeholder="Competitors, preferred pages, anchor restrictions, niche requirements, countries, or anything else we should know." className={inputCls} />
                      </div>
                    </>
                  )}

                  {data.requirementsChoice === 'later' && (
                    <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 mb-6">
                      <p className="text-sm text-gray-500">{"You'll be able to add requirements after payment. We'll also email you a link to submit them."}</p>
                    </div>
                  )}

                  {error && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">{error}</p>}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="border border-gray-200 hover:border-gray-300 text-gray-600 font-semibold px-5 py-3 rounded-lg text-sm transition-colors">
                      <span className="inline-flex items-center gap-1.5"><ArrowLeft size={14} /> Edit Cart</span>
                    </button>
                    <button onClick={handleContinueFromRequirements} disabled={!data.requirementsChoice} className="flex-1 flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-all">
                      Continue to Review <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Review Your Order</h1>

                  {/* Items */}
                  <div className="border border-gray-200 rounded-xl p-5 mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Order Items</h2>
                    <div className="flex flex-col gap-2 mb-4">
                      {items.map((item) => (
                        <div key={item.productId} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{item.name}<br /><span className="text-xs text-gray-400">{item.description}</span></span>
                          <div className="text-right">
                            <div className="text-xs text-gray-400">Qty: {item.quantity}</div>
                            <div className="font-semibold text-gray-900">${(item.unitPrice * item.quantity).toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-sm font-semibold text-gray-500">Total</span>
                      <span className="text-xl font-black text-gray-900">${total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Requirements summary */}
                  <div className="border border-gray-200 rounded-xl p-5 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Requirements</h2>
                      <button onClick={() => setStep(2)} className="text-xs font-semibold text-[#F97316] hover:underline">Edit</button>
                    </div>
                    {data.requirementsChoice === 'later' ? (
                      <p className="text-sm text-gray-500">Will be provided after checkout</p>
                    ) : (
                      <p className="text-sm text-gray-500">{providedCount} target URL{providedCount !== 1 ? 's' : ''} provided{data.campaignNotes ? ' · campaign notes included' : ''}</p>
                    )}
                  </div>

                  {/* Customer info */}
                  <div className="border border-gray-200 rounded-xl p-5 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Contact Details</h2>
                      <button onClick={() => setStep(2)} className="text-xs font-semibold text-[#F97316] hover:underline">Edit</button>
                    </div>
                    <p className="text-sm text-gray-600">{data.customerName || '(not set)'}<br />{data.customerEmail}</p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="border border-gray-200 hover:border-gray-300 text-gray-600 font-semibold px-5 py-3 rounded-lg text-sm transition-colors">
                      <span className="inline-flex items-center gap-1.5"><ArrowLeft size={14} /> Back</span>
                    </button>
                    <button onClick={handleContinueFromReview} className="flex-1 flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-3 rounded-xl text-sm transition-all">
                      Continue to Payment <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Payment */}
              {step === 4 && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment</h1>

                  {/* What happens next */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">What happens next?</h3>
                    <ol className="flex flex-col gap-2">
                      {["Complete payment", "We review your requirements", "Website selection / approval where applicable", "Placements go live", "Receive your final report"].map((t, i) => (
                        <li key={t} className="flex items-center gap-2.5 text-sm text-gray-600">
                          <span className="w-5 h-5 rounded-full bg-[#F97316] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                          {t}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <form onSubmit={handlePay} className="flex flex-col gap-4">
                    <div>
                      <label className={labelCls}>Name *</label>
                      <input type="text" required value={data.customerName} onChange={(e) => update({ customerName: e.target.value })} placeholder="Jane Doe" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Email *</label>
                      <input type="email" required value={data.customerEmail} onChange={(e) => update({ customerEmail: e.target.value })} placeholder="you@company.com" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Company</label>
                      <input type="text" value={data.customerCompany} onChange={(e) => update({ customerCompany: e.target.value })} placeholder="Acme Inc." className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Website</label>
                      <input type="url" value={data.customerWebsite} onChange={(e) => update({ customerWebsite: e.target.value })} placeholder="https://yoursite.com" className={inputCls} />
                    </div>

                    {error && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

                    {/* Consent checkbox */}
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#F97316] flex-shrink-0"
                      />
                      <span className="text-xs text-gray-500 leading-relaxed">
                        I agree to the{' '}
                        <Link to="/terms" className="text-[#F97316] hover:underline font-semibold">Terms &amp; Conditions</Link>,{' '}
                        <Link to="/privacy-policy" className="text-[#F97316] hover:underline font-semibold">Privacy Policy</Link>, and{' '}
                        <Link to="/refund-policy" className="text-[#F97316] hover:underline font-semibold">Refund Policy</Link>.
                      </span>
                    </label>

                    <button type="submit" disabled={loading || !agreedToTerms} className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-orange-200">
                      {loading ? <><Loader2 size={15} className="animate-spin" /> Processing...</> : <><CreditCard size={15} /> Pay ${total.toLocaleString()} Securely</>}
                    </button>
                    <p className="text-center text-xs text-gray-400">Secure checkout via WayForPay</p>
                  </form>

                  <button onClick={() => setStep(3)} className="mt-4 inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors">
                    <ArrowLeft size={12} /> Back to Review
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT: sticky order summary (desktop) */}
            <div className="hidden lg:block">
              <div className="sticky top-28">
                <OrderSummary />
              </div>
            </div>

            {/* Mobile order summary (collapsible) */}
            <details className="lg:hidden border border-gray-200 rounded-xl">
              <summary className="px-4 py-3 text-sm font-semibold text-gray-700 cursor-pointer">Order Summary — ${total.toLocaleString()}</summary>
              <div className="px-4 pb-4"><OrderSummary /></div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
