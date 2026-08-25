import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, total, itemCount, isOpen, closeCart, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeCart} />
      <div
        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
        style={{ animation: 'slideInRight 0.22s cubic-bezier(0.16,1,0.3,1)' }}
      >
        <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#F97316]" />
            <span className="font-bold text-gray-900">Cart</span>
            {itemCount > 0 && (
              <span className="text-xs font-semibold text-gray-400">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
            )}
          </div>
          <button onClick={closeCart} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag size={32} className="text-gray-200" />
            <p className="text-gray-400 text-sm">Your cart is empty.</p>
            <button
              onClick={closeCart}
              className="text-sm font-semibold text-[#F97316] hover:underline"
            >
              Browse packages
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
              {items.map((item) => (
                <div key={item.productId} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-400">{item.description}</div>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                      aria-label="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#F97316] hover:text-[#F97316] transition-colors"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="text-sm font-semibold text-gray-900 w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#F97316] hover:text-[#F97316] transition-colors"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      ${(item.unitPrice * item.quantity).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 py-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-500">Total</span>
                <span className="text-xl font-black text-gray-900">${total.toLocaleString()}</span>
              </div>
              <button
                onClick={() => {
                  closeCart();
                  navigate('/checkout');
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-3.5 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-orange-200"
              >
                Continue to Requirements <ArrowRight size={15} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
