import { useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { trackConversion } from '../lib/gtag';

const services = [
  { id: 'guest-posting',   label: 'Guest Posting' },
  { id: 'niche-edits',     label: 'Niche Edits' },
  { id: 'crowd-links',     label: 'Crowd Links' },
  { id: 'link-packages',   label: 'Link Packages' },
  { id: 'seo-audit',       label: 'SEO Audit' },
  { id: 'ai-llm',          label: 'AI / LLM' },
  { id: 'local-seo',       label: 'Local SEO' },
];

const budgetOptions = [
  { value: '$500–1,000',  label: '$500 – $1,000' },
  { value: '$1,000–3,000', label: '$1,000 – $3,000' },
  { value: '$3,000+',     label: '$3,000+' },
  { value: 'Not sure',    label: 'Not sure yet' },
];

const inputCls =
  'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#F97316]/60 focus:ring-2 focus:ring-[#F97316]/10 transition-all';

const DISPOSABLE_DOMAINS = [
  'mailinator.com','guerrillamail.com','10minutemail.com','trashmail.com',
  'yopmail.com','tempmail.com','throwam.com','sharklasers.com','guerrillamailblock.com',
  'grr.la','guerrillamail.info','guerrillamail.biz','guerrillamail.de','guerrillamail.net',
  'guerrillamail.org','spam4.me','fakeinbox.com','dispostable.com',
];

function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase() ?? '';
  return DISPOSABLE_DOMAINS.includes(domain);
}

interface LeadFormProps {
  defaultService?: string;
  title?: string;
  subtitle?: string;
}

function resolveServiceId(defaultService?: string): string {
  if (!defaultService) return '';
  const lower = defaultService.toLowerCase();
  const match = services.find(
    (s) => s.id === lower || s.label.toLowerCase() === lower || lower.includes(s.id) || lower.includes(s.label.toLowerCase())
  );
  return match?.id ?? '';
}

export default function LeadForm({
  defaultService,
  title = 'Get a Custom Link Building Quote',
  subtitle = 'Share your domain and niche — we\'ll prepare a tailored quote within 24 h.',
}: LeadFormProps) {
  const [email,    setEmail]    = useState('');
  const [website,  setWebsite]  = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [telegram, setTelegram] = useState('');
  const [budget,   setBudget]   = useState('');
  const [service,  setService]  = useState(() => resolveServiceId(defaultService));
  const [sent,     setSent]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // Honeypot: hidden field bots fill in
  const [honeypot, setHoneypot] = useState('');
  // Time-gate: track when form was first rendered
  const renderTime = useRef(Date.now());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Honeypot check
    if (honeypot) return;

    // Disposable email check
    if (isDisposableEmail(email)) {
      setError('Please use a real work email address.');
      return;
    }

    if (!email || !website) return;
    setLoading(true);

    const serviceLabel = services.find(s => s.id === service)?.label ?? defaultService ?? 'General Inquiry';
    const messenger = [
      whatsapp && `WhatsApp: ${whatsapp}`,
      telegram && `Telegram: ${telegram}`,
    ].filter(Boolean).join(' | ');

    const { error: dbError } = await supabase.from('leads').insert({
      email,
      messenger: messenger || '',
      website: website || '',
      service: serviceLabel,
      package: 'Quote Request',
      package_details: `Service: ${serviceLabel}${budget ? ` | Budget: ${budget}` : ''}`,
      source: 'vladenza.com',
    });

    if (dbError) {
      console.error('Lead insert error:', dbError);
      setError('Something went wrong. Please try again.');
      setLoading(false);
      return;
    }

    await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/inbound-lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        email,
        messenger: messenger || undefined,
        website: website || undefined,
        budget: budget || undefined,
        message: [
          `Custom Link Building Quote — ${serviceLabel}`,
          budget ? `Budget: ${budget}` : '',
          messenger ? `Messenger: ${messenger}` : '',
          website ? `Website: ${website}` : '',
        ].filter(Boolean).join('\n'),
        source: 'vladenza.com',
        service: serviceLabel,
        _ts: Date.now() - 5000,
      }),
    }).catch(() => {});

    setLoading(false);
    setSent(true);
    trackConversion();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <h2 className="text-gray-900 font-bold text-xl mb-0.5">{title}</h2>
        <p className="text-gray-400 text-sm">{subtitle}</p>
      </div>

      {sent ? (
        <div className="px-6 py-10 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-gray-900 font-semibold text-base">You're on the list!</p>
          <p className="text-gray-400 text-sm">We'll be in touch within 24 hours with your custom plan.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {/* Honeypot — hidden from real users, visible to bots */}
          <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true" tabIndex={-1}>
            <input
              type="text"
              name="website_url"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              autoComplete="off"
              tabIndex={-1}
            />
          </div>

          {/* Service chips */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Select service</p>
            <div className="flex flex-wrap gap-2">
              {services.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setService(service === s.id ? '' : s.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                    service === s.id
                      ? 'bg-[#F97316] border-[#F97316] text-white shadow-sm'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-[#F97316]/50 hover:text-[#F97316]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                Work email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className={inputCls}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                Website URL <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                required
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yoursite.com"
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1.5 block">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12.004 0C5.374 0 0 5.373 0 11.998c0 2.118.554 4.1 1.522 5.822L.057 23.998l6.304-1.654A11.954 11.954 0 0012.004 24C18.629 24 24 18.626 24 12.002 24 5.374 18.629 0 12.004 0zm0 21.818a9.818 9.818 0 01-5.002-1.37l-.359-.213-3.722.976.993-3.628-.233-.373A9.79 9.79 0 012.18 12c0-5.415 4.407-9.82 9.824-9.82 5.418 0 9.824 4.405 9.824 9.82 0 5.416-4.406 9.818-9.824 9.818z"/></svg>
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+1 234 567 8900"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1.5 block">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#229ED9"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  Telegram
                </label>
                <input
                  type="text"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="@username"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                Monthly Budget
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className={`${inputCls} cursor-pointer`}
              >
                <option value="">Select budget range…</option>
                {budgetOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#ea6c0a] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-orange-200 group mt-1"
          >
            {loading ? 'Sending...' : 'Get a Custom Quote'}
            {!loading && <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />}
          </button>

          <p className="text-center text-xs text-gray-400 -mt-1">
            No spam. No credit card.{' '}
            <a href="#" className="text-[#F97316] hover:underline">Privacy Policy</a>
          </p>
        </form>
      )}
    </div>
  );
}
