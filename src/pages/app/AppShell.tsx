import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, User, HelpCircle, LogOut,
  Sparkles, Menu, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SectionDashboard from './SectionDashboard';
import SectionOrders from './SectionOrders';

type Section = 'dashboard' | 'orders' | 'profile';

const NAV: { id: Section; label: string; Icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Overview',  Icon: LayoutDashboard },
  { id: 'orders',    label: 'My Orders', Icon: Package },
  { id: 'profile',   label: 'Profile',   Icon: User },
];

export default function AppShell() {
  const { user, signOut } = useAuth();
  const [section, setSection] = useState<Section>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  function navigate(id: Section) { setSection(id); setMobileOpen(false); }

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-xl bg-[#F97316] flex items-center justify-center">
            <Sparkles size={13} className="text-white" />
          </span>
          <div>
            <div className="font-black text-white text-sm tracking-tight leading-none">Vladenza</div>
            <div className="text-gray-600 text-[10px] mt-0.5">Client Area</div>
          </div>
        </Link>
        <button onClick={() => setMobileOpen(false)} className="lg:hidden text-gray-500 hover:text-white">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => navigate(id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-all text-left ${
              section === id
                ? 'bg-[#F97316]/15 text-[#F97316]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}>
            <Icon size={16} className="flex-shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-white/5">
        <a href="mailto:hello@vladenza.com"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 w-full transition-all mb-1">
          <HelpCircle size={15} /> Support
        </a>
        <div className="px-3 py-2 mb-1">
          <div className="text-white text-xs font-medium truncate">{user?.email}</div>
        </div>
        <button onClick={() => signOut()}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-400/5 w-full transition-all">
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-gray-950 flex-shrink-0 sticky top-0 h-screen">
        {sidebar}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-56 bg-gray-950 flex flex-col z-10">{sidebar}</aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-10">
          <button onClick={() => setMobileOpen(true)} className="text-gray-600 hover:text-gray-900">
            <Menu size={20} />
          </button>
          <span className="font-bold text-gray-900 text-sm">{NAV.find(n => n.id === section)?.label}</span>
          <div className="w-5" />
        </header>

        <main className="flex-1">
          {section === 'dashboard' && <SectionDashboard onGoToOrders={() => setSection('orders')} />}
          {section === 'orders'    && <SectionOrders />}
          {section === 'profile'   && <SectionProfile />}
        </main>
      </div>
    </div>
  );
}

function SectionProfile() {
  const { user } = useAuth();
  return (
    <div className="p-6 lg:p-8 max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Profile</h1>
      <p className="text-gray-500 text-sm mb-6">Your account information</p>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
          <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900">{user?.email}</div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Account ID</label>
          <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-400 font-mono">
            {user?.id?.slice(0, 8)}…
          </div>
        </div>
        <div className="pt-2 border-t border-gray-100">
          <a href="mailto:hello@vladenza.com?subject=Account%20Support"
            className="text-sm text-[#F97316] hover:underline font-medium">
            Need changes? Contact support
          </a>
        </div>
      </div>
    </div>
  );
}
