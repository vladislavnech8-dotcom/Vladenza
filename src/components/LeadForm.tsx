import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { trackLeadConversion } from '../lib/gtag';
import { useLocale } from '../context/LocaleContext';

const defaultInputCls = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#F97316]/60 focus:ring-2 focus:ring-[#F97316]/10 transition-all';
const contactInputCls = 'w-full border-0 border-b-2 border-ink/20 bg-transparent px-0 py-3 text-base text-ink placeholder-ink/35 focus:border-signal focus:outline-none transition-colors';

const DISPOSABLE_DOMAINS = [
  'mailinator.com','guerrillamail.com','10minutemail.com','trashmail.com','yopmail.com','tempmail.com','throwam.com','sharklasers.com','guerrillamailblock.com','grr.la','guerrillamail.info','guerrillamail.biz','guerrillamail.de','guerrillamail.net','guerrillamail.org','spam4.me','fakeinbox.com','dispostable.com',
];

function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase() ?? '';
  return DISPOSABLE_DOMAINS.includes(domain);
}

interface LeadFormProps {
  defaultService?: string;
  variant?: 'default' | 'contact';
}

export default function LeadForm({ defaultService, variant = 'default' }: LeadFormProps) {
  const { t, locale } = useLocale();
  const contact = variant === 'contact';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [telegram, setTelegram] = useState('');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');
  const [service, setService] = useState(() => {
    if (!defaultService) return '';
    const lower = defaultService.toLowerCase();
    const ids = ['guest-posting','niche-edits','crowd-links','link-packages','seo-audit','ai-llm','local-seo'];
    return ids.find((id) => lower.includes(id)) ?? '';
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const serviceIds = contact ? ['link-building', 'seo', 'digital-marketing', 'everything', 'not-sure'] as const : ['guest-posting','niche-edits','crowd-links','link-packages','seo-audit','ai-llm','local-seo'] as const;
  const serviceLabels: Record<string, string> = contact
    ? (locale === 'uk' ? { 'link-building': 'Лінкбілдинг', seo: 'SEO', 'digital-marketing': 'Діджитал-маркетинг', everything: 'Потроху всього', 'not-sure': 'Ще не знаю' } : { 'link-building': 'Link Building', seo: 'SEO', 'digital-marketing': 'Digital Marketing', everything: 'A bit of everything', 'not-sure': 'Not sure yet' })
    : {
      'guest-posting': t['form.services.guestPosting'], 'niche-edits': t['form.services.nicheEdits'], 'crowd-links': t['form.services.crowdLinks'], 'link-packages': t['form.services.linkPackages'], 'seo-audit': t['form.services.seoAudit'], 'ai-llm': t['form.services.aiLlm'], 'local-seo': t['form.services.localSeo'],
    };
  const budgetOptions = [
    { value: '$500–1,000', label: t['form.budget1'] }, { value: '$1,000–3,000', label: t['form.budget2'] }, { value: '$3,000+', label: t['form.budget3'] }, { value: 'Not sure', label: t['form.budget4'] },
  ];
  const inputCls = contact ? contactInputCls : defaultInputCls;
  const labelCls = contact ? 'mb-1.5 block text-[11px] font-bold uppercase tracking-[.14em] text-ink/45' : 'mb-1.5 block text-xs font-medium text-gray-500';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (honeypot) return;
    if (isDisposableEmail(email)) { setError(t['form.errorEmail']); return; }
    if (!email || (!contact && !website) || (contact && !name)) return;
    setLoading(true);

    const serviceLabel = serviceLabels[service] ?? defaultService ?? (contact ? (locale === 'uk' ? 'Загальний запит' : 'General Inquiry') : 'General Inquiry');
    const messenger = [whatsapp && `WhatsApp: ${whatsapp}`, telegram && `Telegram: ${telegram}`].filter(Boolean).join(' | ');
    const details = [
      `Service: ${serviceLabel}`,
      budget ? `Budget: ${budget}` : '',
      message ? `Message: ${message}` : '',
      messenger ? `Messenger: ${messenger}` : '',
      `Language: ${locale === 'uk' ? 'Ukrainian' : 'English'}`,
    ].filter(Boolean).join(' | ');

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/inbound-lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
      body: JSON.stringify({
        name: name || '',
        email,
        messenger: messenger || '',
        website: website || '',
        budget: budget || '',
        service: serviceLabel,
        packageName: 'Quote Request',
        packageDetails: details,
        source: 'vladenza.com',
        _ts: Date.now() - 5000,
      }),
    });

    if (!response.ok) {
      console.error('Lead submission failed:', response.status);
      setError(t['form.errorGeneric']);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSent(true);
    trackLeadConversion();
  };

  const successTitle = contact ? (locale === 'uk' ? 'ОТРИМАЛИ' : 'GOT IT') : t['form.successTitle'];
  const successBody = contact ? (locale === 'uk' ? <>Ви закінчили.<br />Тепер наша черга.<br /><span className="text-ink/55">Все переглянемо та повернемося до вас.</span></> : <>You&apos;re done.<br />We&apos;re not.<br /><span className="text-ink/55">We&apos;ll take a look and get back to you.</span></>) : t['form.successBody'];

  return (
    <div className={contact ? 'border-t-2 border-ink bg-cream' : 'overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm'}>
      {!contact && <div className="border-b border-gray-100 px-6 pb-4 pt-6"><h2 className="mb-0.5 text-xl font-bold text-gray-900">{t['form.title']}</h2><p className="text-sm text-gray-400">{t['form.subtitle']}</p></div>}
      {sent ? (
        <div className={contact ? 'flex flex-col gap-4 border-b-2 border-ink py-10' : 'flex flex-col items-center gap-3 px-6 py-10 text-center'}>
          {contact && <p className="text-xs font-bold uppercase tracking-[.18em] text-signal">{successTitle}</p>}
          {!contact && <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-green-50"><Check size={24} className="text-green-500" /></div>}
          {!contact && <p className="text-base font-semibold text-gray-900">{successTitle}</p>}
          <p className={contact ? 'font-display text-3xl leading-tight text-ink' : 'text-sm text-gray-400'}>{successBody}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={contact ? 'flex flex-col gap-5 border-b-2 border-ink py-6' : 'flex flex-col gap-4 px-6 py-5'}>
          <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden="true" tabIndex={-1}><input type="text" name="website_url" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} autoComplete="off" tabIndex={-1} /></div>
          {contact && <div><label className={labelCls}>{locale === 'uk' ? 'ВАШЕ ІМʼЯ' : 'YOUR NAME'} <span className="text-signal">*</span></label><input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} /></div>}
          <div><label className={labelCls}>{contact ? 'EMAIL' : t['form.email']} <span className="text-signal">*</span></label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={contact ? 'you@company.com' : t['form.emailPlaceholder']} className={inputCls} /></div>
          <div><label className={labelCls}>{contact ? (locale === 'uk' ? 'ВАШ САЙТ' : 'YOUR WEBSITE') : t['form.website']}{!contact && <span className="text-red-400"> *</span>}</label><input type="url" required={!contact} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder={contact ? 'https://yourwebsite.com' : t['form.websitePlaceholder']} className={inputCls} /></div>
          {contact && <div><label className={labelCls}>{locale === 'uk' ? 'ЩО ВАМ ПОТРІБНО?' : 'WHAT DO YOU NEED?'}</label><div className="flex flex-wrap gap-2 pt-1">{serviceIds.map((id) => <button key={id} type="button" onClick={() => setService(service === id ? '' : id)} className={`border-2 px-3 py-1.5 text-xs font-bold transition-colors ${service === id ? 'border-signal bg-signal text-white' : 'border-ink/15 text-ink/55 hover:border-signal hover:text-signal'}`}>{serviceLabels[id]}</button>)}</div></div>}
          {contact && <div><label className={labelCls}>{locale === 'uk' ? 'ЩО ВІДБУВАЄТЬСЯ?' : "WHAT'S GOING ON?"}</label><textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={locale === 'uk' ? 'Коротко — достатньо.' : 'The short version is fine.'} rows={3} className={`${inputCls} resize-none`} /></div>}
          {!contact && <><div><p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500">{t['form.selectService']}</p><div className="flex flex-wrap gap-2">{serviceIds.map((id) => <button key={id} type="button" onClick={() => setService(service === id ? '' : id)} className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${service === id ? 'border-[#F97316] bg-[#F97316] text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-[#F97316]/50 hover:text-[#F97316]'}`}>{serviceLabels[id]}</button>)}</div></div><div className="grid grid-cols-2 gap-3"><div><label className={labelCls}>{t['form.whatsapp']}</label><input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder={t['form.whatsappPlaceholder']} className={inputCls} /></div><div><label className={labelCls}>{t['form.telegram']}</label><input type="text" value={telegram} onChange={(e) => setTelegram(e.target.value)} placeholder={t['form.telegramPlaceholder']} className={inputCls} /></div></div><div><label className={labelCls}>{t['form.budget']}</label><select value={budget} onChange={(e) => setBudget(e.target.value)} className={`${inputCls} cursor-pointer`}><option value="">{t['form.budgetPlaceholder']}</option>{budgetOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div></>}
          {error && <p className={contact ? 'border-l-2 border-red-500 bg-red-50 px-3 py-2 text-xs text-red-600' : 'rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-500'}>{error}</p>}
          <button type="submit" disabled={loading} className={contact ? 'editorial-focus mt-1 inline-flex min-h-14 w-full items-center justify-center gap-2 bg-signal px-5 text-sm font-bold text-white transition-colors hover:bg-[#EA580C] disabled:opacity-70' : 'group mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F97316] py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#ea6c0a] hover:shadow-lg hover:shadow-orange-200 disabled:cursor-not-allowed disabled:opacity-70'}>{loading ? t['form.sending'] : (contact ? (locale === 'uk' ? 'НАДІСЛАТИ' : 'SEND IT') : t['form.submit'])}{!loading && <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />}</button>
          {!contact && <p className="-mt-1 text-center text-xs text-gray-400">{t['form.noSpam']} <a href="#" className="text-[#F97316] hover:underline">{t['form.privacyPolicy']}</a></p>}
        </form>
      )}
    </div>
  );
}
