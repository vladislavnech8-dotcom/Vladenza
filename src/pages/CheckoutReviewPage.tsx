import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import CheckoutLayout from '../components/CheckoutLayout';
import { useCart } from '../context/CartContext';
import { useCheckout } from '../context/CheckoutContext';
import { payWithWayForPay } from '../lib/wayforpay';
import { trackEvent } from '../lib/analytics';

const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#F97316]/60 focus:ring-2 focus:ring-[#F97316]/10 transition-all';

export default function CheckoutReviewPage() {
  const { items, total, itemCount, clear } = useCart();
  const { data } = useCheckout();

  const [name, setName] = useState(data.customerName);
  const [email, setEmail] = useState(data.customerEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [outcome, setOutcome] = useState<'approved' | 'declined' | 'pending' | null>(null);

  if (itemCount === 0) {
    return (
      <CheckoutLayout step={3}>
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
          <p className="text-gray-400 text-sm">Your cart is empty.</p>
          <Link to="/services/niche-edits#packages" className="text-sm font-semibold text-[#F97316] hover:underline">
            Browse Packages
          </Link>
        </div>
      </CheckoutLayout>
    );
  }

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required.');
      return;
    }

    setError('');
    setLoading(true);
    setOutcome(null);

    const cartItems = items.map((i) => ({
      productId: i.productId,
      name: i.name,
      unitPrice: i.unitPrice,
      quantity: i.quantity,
    }));

    trackEvent('payment_started', { total, itemCount });

    try {
      const result = await payWithWayForPay({
        items: cartItems,
        name,
        email,
        website: data.targets[0]?.url || '',
      });

      setOutcome(result);

      if (result === 'approved') {
        trackEvent('purchase', { total, itemCount, items: items.length });
        clear();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment could not be started. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (outcome === 'approved') {
    return (
      <CheckoutLayout step={3}>
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle size={28} className="text-green-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Payment received!</h1>
          <p className="text-gray-400 text-sm max-w-sm">
            Your campaign starts within 5 business days. A confirmation is on its way to {email}.
          </p>
          <Link to="/services/niche-edits" className="text-sm font-semibold text-[#F97316] hover:underline">
            Back to Niche Edits
          </Link>
        </div>
      </CheckoutLayout>
    );
  }

  if (outcome === 'declined') {
    return (
      <CheckoutLayout step={3}>
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle size={28} className="text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Payment declined</h1>
          <p className="text-gray-400 text-sm max-w-sm">
            Your card wasn't charged. You can try again.
          </p>
          <button
            onClick={() => setOutcome(null)}
            className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
          >
            Try again
          </button>
        </div>
      </CheckoutLayout>
    );
  }

  if (outcome === 'pending') {
    return (
      <CheckoutLayout step={3}>
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
          <Loader2 size={28} className="text-[#F97316] animate-spin" />
          <h1 className="text-xl font-bold text-gray-900">Payment processing</h1>
          <p className="text-gray-400 text-sm max-w-sm">
            We'll email you at {email} as soon as it's confirmed — usually within a few minutes.
          </p>
        </div>
      </CheckoutLayout>
    );
  }

  return (
    <CheckoutLayout step={3}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Review & Pay</h1>

      {/* Order items */}
      <div className="border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Order Items</h2>
        <div className="flex flex-col gap-2 mb-4">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{item.name} × {item.quantity}</span>
              <span className="font-semibold text-gray-900">${(item.unitPrice * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-sm font-semibold text-gray-500">Total</span>
          <span className="text-xl font-black text-gray-900">${total.toLocaleString()}</span>
        </div>
      </div>

      {/* Requirements summary */}
      <div className="border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Requirements</h2>
        {data.provideLater ? (
          <p className="text-sm text-gray-500">Requirements status: <span className="font-semibold text-orange-600">Pending</span> — you chose to send them after payment.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {data.targets.map((t, i) => (
              <div key={i} className="text-sm">
                <div className="text-gray-700 font-medium">{t.url || '(no URL)'}</div>
                <div className="text-xs text-gray-400">
                  {t.quantity} placement{t.quantity !== 1 ? 's' : ''}{t.anchor ? ` · anchor: "${t.anchor}"` : ''}{t.niche ? ` · ${t.niche}` : ''}{t.country ? ` · ${t.country}` : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer info + pay */}
      <form onSubmit={handlePay} className="flex flex-col gap-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Your Details</h2>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className={inputCls}
          />
        </div>

        {error && (
          <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-orange-200"
        >
          {loading ? (
            <><Loader2 size={15} className="animate-spin" /> Processing...</>
          ) : (
            <><CreditCard size={15} /> Pay ${total.toLocaleString()} Now</>
          )}
        </button>
        <p className="text-center text-xs text-gray-400">Secure checkout via WayForPay</p>
      </form>
    </CheckoutLayout>
  );
}
