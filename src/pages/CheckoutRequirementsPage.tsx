import { useNavigate, Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import CheckoutLayout from '../components/CheckoutLayout';
import { useCart } from '../context/CartContext';
import { trackEvent } from '../lib/analytics';

export default function CheckoutRequirementsPage() {
  const { items, total, itemCount, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (itemCount === 0) {
    return (
      <CheckoutLayout step={1}>
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
          <ShoppingBag size={40} className="text-gray-200" />
          <h1 className="text-xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="text-gray-400 text-sm">Add some placements before continuing to checkout.</p>
          <Link to="/services/niche-edits#packages" className="text-sm font-semibold text-[#F97316] hover:underline">
            Browse Niche Edit Packages
          </Link>
        </div>
      </CheckoutLayout>
    );
  }

  return (
    <CheckoutLayout step={1}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

      <div className="flex flex-col gap-3 mb-8">
        {items.map((item) => (
          <div key={item.productId} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                <div className="text-xs text-gray-400">{item.description}</div>
              </div>
              <button
                onClick={() => { removeItem(item.productId); trackEvent('remove_from_cart', { product_id: item.productId }); }}
                className="text-gray-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#F97316] hover:text-[#F97316] transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-semibold text-gray-900 w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#F97316] hover:text-[#F97316] transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              <div className="text-sm font-bold text-gray-900">
                ${item.unitPrice.toLocaleString()} × {item.quantity} = ${(item.unitPrice * item.quantity).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 pt-4 mb-8">
        <span className="text-base font-semibold text-gray-500">Total</span>
        <span className="text-2xl font-black text-gray-900">${total.toLocaleString()}</span>
      </div>

      <button
        onClick={() => { navigate('/checkout/requirements-form'); trackEvent('begin_checkout', { total, itemCount }); }}
        className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-3.5 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-orange-200"
      >
        Continue to Requirements <ArrowRight size={15} />
      </button>
    </CheckoutLayout>
  );
}
