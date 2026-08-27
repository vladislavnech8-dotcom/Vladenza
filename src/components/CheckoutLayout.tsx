import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navigation from './Navigation';
import { useCart } from '../context/CartContext';

interface Props {
  children: ReactNode;
  step: 1 | 2 | 3;
}

const steps = ['Cart', 'Requirements', 'Review & Pay'];

export default function CheckoutLayout({ children, step }: Props) {
  const { itemCount } = useCart();

  return (
    <div className="bg-white min-h-screen">
      <Navigation />
      <div className="pt-[88px]">
        {/* Step indicator */}
        <div className="border-b border-gray-100 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-2">
            <Link to="/services/niche-edits" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mr-4">
              <ArrowLeft size={12} /> Back
            </Link>
            {steps.map((label, i) => {
              const stepNum = i + 1;
              const active = stepNum === step;
              const done = stepNum < step;
              return (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    active ? 'bg-[#F97316] text-white' : done ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {done ? '✓' : stepNum}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:inline ${active ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
                  {i < steps.length - 1 && <div className="w-6 h-px bg-gray-200 mx-1" />}
                </div>
              );
            })}
            {itemCount > 0 && (
              <div className="ml-auto text-xs text-gray-400">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
              </div>
            )}
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          {children}
        </div>
      </div>
    </div>
  );
}
