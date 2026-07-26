import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Sparkles, ArrowLeft, Eye, EyeOff, LogIn, UserPlus, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AppShell from './app/AppShell';

export default function ClientAppPage() {
  const { session, loading } = useAuth();

  useEffect(() => {
    const el = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const prev = el?.getAttribute('content') ?? '';
    if (el) el.setAttribute('content', 'noindex, nofollow');
    return () => { if (el) el.setAttribute('content', prev); };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <Loader2 className="w-6 h-6 text-[#F97316] animate-spin" />
      </div>
    );
  }

  return session ? <AppShell /> : <AuthGate />;
}

function AuthGate() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    if (mode === 'login') {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
    } else {
      const { error } = await signUp(email, password);
      if (error) setError(error.message);
      else setConfirmSent(true);
    }
    setLoading(false);
  }

  if (confirmSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 p-6">
        <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#F97316]/15 flex items-center justify-center mx-auto mb-5">
            <Mail size={26} className="text-[#F97316]" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-1">We sent a confirmation link to</p>
          <p className="font-semibold text-white text-sm mb-4">{email}</p>
          <p className="text-gray-500 text-xs leading-relaxed mb-6">
            Click the link to activate your account, then sign in.
          </p>
          <button
            onClick={() => { setConfirmSent(false); setMode('login'); }}
            className="w-full bg-[#F97316] hover:bg-[#ea6c0a] text-white py-3 rounded-xl text-sm font-semibold transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-gray-950 border-r border-gray-800 p-10 flex-shrink-0">
        <div>
          <Link to="/" className="flex items-center gap-2.5 mb-12">
            <span className="w-8 h-8 rounded-xl bg-[#F97316] flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </span>
            <span className="font-black text-white text-lg tracking-tight">Vladenza</span>
          </Link>
          <h2 className="text-3xl font-bold text-white leading-tight mb-3">
            Your link building<br />command center
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Place orders, track every placement in real time, and grow organic traffic — all in one place.
          </p>
          <div className="mt-8 space-y-4">
            {[
              { t: 'Real-time order tracking', d: 'Status updates as your links go live' },
              { t: 'All services in one place', d: 'Forum, guest posts, niche edits & more' },
              { t: 'Transparent reporting', d: 'DR, URL and anchor for every placement' },
            ].map(f => (
              <div key={f.t} className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-[#F97316]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{f.t}</div>
                  <div className="text-gray-600 text-xs mt-0.5">{f.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-700 text-xs">© 2026 Vladenza Agency</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 min-h-screen">
        <div className="w-full max-w-[400px]">
          <Link to="/" className="lg:hidden inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm mb-6 transition-colors">
            <ArrowLeft size={14} /> Back to site
          </Link>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-7 pt-7 pb-5">
              <h1 className="text-xl font-bold text-gray-900 mb-0.5">
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </h1>
              <p className="text-gray-500 text-sm">
                {mode === 'login' ? 'Sign in to your client dashboard' : 'Get access to your orders dashboard'}
              </p>
            </div>

            <div className="px-7 pb-1">
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                {(['login', 'register'] as const).map(m => (
                  <button key={m} onClick={() => { setMode(m); setError(''); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                      mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                    }`}>
                    {m === 'login' ? 'Sign In' : 'Register'}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="px-7 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  autoComplete="email" placeholder="you@company.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition bg-gray-50 focus:bg-white" />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">{error}</div>
              )}

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#ea6c0a] text-white py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 mt-1">
                {loading ? <Loader2 size={16} className="animate-spin" /> : (mode === 'login' ? <LogIn size={16} /> : <UserPlus size={16} />)}
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="px-7 pb-6 text-center">
              <p className="text-gray-400 text-xs">
                Need help?{' '}
                <a href="mailto:hello@vladenza.com" className="text-[#F97316] hover:underline">Contact support</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
