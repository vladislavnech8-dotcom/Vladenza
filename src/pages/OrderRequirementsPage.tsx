import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Loader2, AlertCircle, ArrowRight, Clock, ArrowLeft } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import Turnstile from '../components/Turnstile';
import { useLocale } from '../context/LocaleContext';

const content = {
  en: {
    loading: 'Loading your order...',
    backToHome: 'Back to Home',
    contactSupport: 'Contact Support',
    invalidTitle: 'Link Invalid or Expired',
    invalidBody: 'This requirements link is no longer valid. If you believe this is an error, please contact us at',
    savedTitle: 'Requirements Saved',
    orderPrefix: 'Order #',
    somePending: 'Some placements are still pending',
    somePendingBody: 'You marked one or more placements as "will provide later." You can return to this page anytime using the same link from your email to complete them.',
    whatHappensNext: 'What happens next?',
    next1: 'We review your website and requirements',
    next2: 'We source placements within the selected metrics',
    next3: 'Placements are manually checked before delivery',
    next4: "You'll receive the completed links in your order report",
    continueEditing: 'Continue Editing',
    errorTitle: 'Something Went Wrong',
    errorFallback: 'An unexpected error occurred.',
    tryAgain: 'Try Again',
    addTitle: 'Add Your Link Requirements',
    addBody: 'Tell us where each link should point. Fill in the target URL, preferred anchor text, and website niche for each placement below.',
    completed: 'completed',
    pendingInfo: (n: number) => `${n} placement${n > 1 ? 's' : ''} still need${n === 1 ? 's' : ''} information. Complete them now or check "will provide later" to return later.`,
    placement: (n: number) => `Placement ${n}`,
    saved: 'Saved',
    pending: 'Pending',
    targetUrl: 'Target URL *',
    anchorText: 'Preferred Anchor Text',
    niche: 'Website Niche / Topic',
    notes: 'Additional Notes',
    willProvideLater: 'I will provide details for this placement later',
    saving: 'Saving...',
    saveRequirements: 'Save Requirements',
    needHelp: 'Need help? Email us at',
    loadError: 'Could not load order details. Please try again or contact support.',
    saveError: 'Could not save requirements. Please try again or contact support.',
    back: 'Back',
  },
  uk: {
    loading: 'Завантаження вашого замовлення...',
    backToHome: 'На головну',
    contactSupport: "Зв'язатися з підтримкою",
    invalidTitle: 'Посилання недійсне або термін ді минув',
    invalidBody: 'Це посилання для вимог більше не дійсне. Якщо ви вважаєте, що це помилка, зверніться до нас за адресою',
    savedTitle: 'Вимоги збережено',
    orderPrefix: 'Замовлення №',
    somePending: 'Деякі розміщення ще очікують',
    somePendingBody: 'Ви позначили одне або кілька розміщень як «надам пізніше». Ви можете повернутися до цієї сторінки у будь-який час, використовуючи те саме посилання з вашого email, щоб завершити їх.',
    whatHappensNext: 'Що далі?',
    next1: 'Ми переглядаємо ваш сайт і вимоги',
    next2: 'Ми підбираємо розміщення за обраними метриками',
    next3: 'Розміщення перевіряються вручну перед доставкою',
    next4: 'Ви отримаєте готові посилання у звіті про замовлення',
    continueEditing: 'Продовжити редагування',
    errorTitle: 'Сталася помилка',
    errorFallback: 'Сталася неочікувана помилка.',
    tryAgain: 'Спробувати знову',
    addTitle: 'Додайте вимоги до ваших посилань',
    addBody: 'Вкажіть, куди має вести кожне посилання. Заповніть цільовий URL, бажаний якірний текст та ніше сайту для кожного розміщення нижче.',
    completed: 'заповлено',
    pendingInfo: (n: number) => `${n} розміщен${n > 1 ? 'ь' : n === 1 ? 'я' : 'я'} все ще потребує інформації. Заповніть їх зараз або позначте «надам пізніше», щоб повернутися пізніше.`,
    placement: (n: number) => `Розміщення ${n}`,
    saved: 'Збережено',
    pending: 'Очікує',
    targetUrl: 'Цільовий URL *',
    anchorText: 'Бажаний якірний текст',
    niche: 'Ніша / тема сайту',
    notes: 'Додаткові нотатки',
    willProvideLater: 'Я надам деталі для цього розміщення пізніше',
    saving: 'Збереження...',
    saveRequirements: 'Зберегти вимоги',
    needHelp: 'Потрібна допомога? Напишіть нам на',
    loadError: 'Не вдалося завантажити деталі замовлення. Спробуйте ще раз або зверніться до підтримки.',
    saveError: 'Не вдалося зберегти вимоги. Спробуйте ще раз або зверніться до підтримки.',
    back: 'Назад',
  },
} as const;

interface PlacementSection {
  placementId: string;
  packageLabel: string;
  productId: string;
}

interface RequirementForm {
  placementId: string;
  targetUrl: string;
  anchor: string;
  niche: string;
  notes: string;
  willProvideLater: boolean;
}

type PageState = 'loading' | 'form' | 'submitting' | 'success' | 'invalid' | 'error';

const inputCls = 'w-full bg-cream border border-ink/15 px-3.5 py-2.5 text-ink text-sm placeholder-ink/35 focus:outline-none focus:border-signal focus:ring-1 focus:ring-signal/30 transition-all';
const labelCls = 'block text-xs font-bold uppercase tracking-wider text-ink/50 mb-1.5';

function isComplete(r: RequirementForm): boolean {
  return !r.willProvideLater && !!r.targetUrl.trim() && (!!r.anchor.trim() || !!r.niche.trim());
}

export default function OrderRequirementsPage() {
  const { token } = useParams<{ token: string }>();
  const { locale, localizePath: lp } = useLocale();
  const c = content[locale];
  const [state, setState] = useState<PageState>('loading');
  const [orderNumber, setOrderNumber] = useState('');
  const [placements, setPlacements] = useState<PlacementSection[]>([]);
  const [forms, setForms] = useState<RequirementForm[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [allComplete, setAllComplete] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');

  const fetchOrder = useCallback(async () => {
    if (!token) {
      setState('invalid');
      return;
    }

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/order-requirements?token=${encodeURIComponent(token || '')}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        setState('invalid');
        return;
      }

      const pls = data.placements as PlacementSection[];
      const existing = (data.existingRequirements || []) as RequirementForm[];
      setPlacements(pls);
      setOrderNumber(data.orderNumber || '');

      const builtForms = pls.map((p) => {
        const existingEntry = existing.find((r: RequirementForm) => r.placementId === p.placementId) ?? existing[pls.indexOf(p)];
        if (existingEntry) {
          return {
            placementId: p.placementId,
            targetUrl: existingEntry.targetUrl || '',
            anchor: existingEntry.anchor || '',
            niche: existingEntry.niche || '',
            notes: existingEntry.notes || '',
            willProvideLater: existingEntry.willProvideLater || false,
          };
        }
        return {
          placementId: p.placementId,
          targetUrl: '',
          anchor: '',
          niche: '',
          notes: '',
          willProvideLater: false,
        };
      });

      setForms(builtForms);
      setState('form');
    } catch {
      setState('error');
      setErrorMsg(c.loadError);
    }
  }, [token]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const updateForm = (idx: number, patch: Partial<RequirementForm>) => {
    setForms((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('submitting');
    setErrorMsg('');

    try {
      const postUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/order-requirements?token=${encodeURIComponent(token || '')}`;
      const res = await fetch(postUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requirements: forms, turnstileToken }),
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        setState('error');
        setErrorMsg(data?.error || c.saveError);
        return;
      }

      setAllComplete(data.allComplete ?? false);
      setSuccessMsg(data.message || c.savedTitle);
      setState('success');
    } catch {
      setState('error');
      setErrorMsg(c.saveError);
    }
  };

  if (state === 'loading') {
    return (
      <div className="bg-cream min-h-screen">
        <Navigation />
        <div className="pt-[88px] max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
          <Loader2 size={32} className="text-signal animate-spin mx-auto mb-4" />
          <p className="text-ink/40 text-sm">{c.loading}</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (state === 'invalid') {
    return (
      <div className="bg-cream min-h-screen">
        <Navigation />
        <div className="pt-[88px] max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="w-16 h-16 border-2 border-red-500 bg-red-50 flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink mb-2">{c.invalidTitle}</h1>
          <p className="text-ink/50 text-sm max-w-sm mx-auto mb-6">
            {c.invalidBody}{' '}
            <a href="mailto:info@vladenza.com" className="text-signal font-bold">info@vladenza.com</a>.
          </p>
          <Link to={lp('/')} className="inline-flex items-center gap-2 border-2 border-ink text-ink hover:bg-ink hover:text-white font-bold px-5 py-3 text-sm transition-colors">
            <ArrowLeft size={14} /> {c.backToHome}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (state === 'success') {
    return (
      <div className="bg-cream min-h-screen">
        <Navigation />
        <div className="pt-[88px] max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="w-16 h-16 border-2 border-green-600 bg-green-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-bold text-ink mb-2">{c.savedTitle}</h1>
          {orderNumber && <p className="text-ink/40 text-sm mb-1">{c.orderPrefix}{orderNumber}</p>}
          <p className="text-ink/60 text-sm max-w-md mx-auto mb-8">{successMsg}</p>

          {!allComplete && (
            <div className="border-2 border-ink/15 bg-white p-4 max-w-md mx-auto mb-6 text-left">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-ink/50" />
                <span className="text-sm font-bold text-ink/70">{c.somePending}</span>
              </div>
              <p className="text-xs text-ink/50 leading-relaxed">{c.somePendingBody}</p>
            </div>
          )}

          {allComplete && (
            <div className="border-2 border-ink/15 bg-white p-5 max-w-md mx-auto mb-6 text-left">
              <h3 className="text-xs font-bold uppercase tracking-widest text-ink/40 mb-3">{c.whatHappensNext}</h3>
              <ul className="flex flex-col gap-2">
                {[c.next1, c.next2, c.next3, c.next4].map((t) => (
                  <li key={t} className="flex items-center gap-2 text-sm text-ink/70">
                    <CheckCircle size={14} className="text-green-600 flex-shrink-0" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-center">
            {!allComplete && (
              <button onClick={() => setState('form')} className="inline-flex items-center gap-2 bg-signal hover:bg-[#EA580C] text-white font-bold px-5 py-3 text-sm transition-colors">
                {c.continueEditing}
              </button>
            )}
            <Link to={lp('/')} className="inline-flex items-center gap-2 border-2 border-ink text-ink hover:bg-ink hover:text-white font-bold px-5 py-3 text-sm transition-colors">
              {c.backToHome}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="bg-cream min-h-screen">
        <Navigation />
        <div className="pt-[88px] max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="w-16 h-16 border-2 border-red-500 bg-red-50 flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink mb-2">{c.errorTitle}</h1>
          <p className="text-ink/50 text-sm max-w-sm mx-auto mb-6">{errorMsg || c.errorFallback}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => { setState('form'); setErrorMsg(''); }} className="inline-flex items-center gap-2 bg-signal hover:bg-[#EA580C] text-white font-bold px-5 py-3 text-sm transition-colors">
              {c.tryAgain}
            </button>
            <a href="mailto:info@vladenza.com" className="inline-flex items-center gap-2 border-2 border-ink/15 text-ink/60 hover:text-ink/80 font-bold px-5 py-3 text-sm transition-colors">
              {c.contactSupport}
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const submitting = state === 'submitting';
  const completedCount = forms.filter(isComplete).length;
  const pendingCount = forms.length - completedCount;

  return (
    <div className="bg-cream min-h-screen">
      <Navigation />
      <div className="pt-[88px]">
        <div className="bg-navy text-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
            <Link to={lp('/')} className="flex items-center gap-1.5 text-xs text-cream/50 hover:text-white transition-colors">
              <ArrowLeft size={12} /> {c.back}
            </Link>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="font-display text-3xl font-bold text-ink mb-2">{c.addTitle}</h1>
          {orderNumber && <p className="text-ink/40 text-sm mb-6">{c.orderPrefix}{orderNumber}</p>}
          <p className="text-ink/50 text-sm mb-6">{c.addBody}</p>

          {forms.length > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-2 bg-ink/10 overflow-hidden">
                <div className="h-full bg-signal transition-all duration-300" style={{ width: `${(completedCount / forms.length) * 100}%` }} />
              </div>
              <span className="text-xs font-bold text-ink/50 whitespace-nowrap">{completedCount}/{forms.length} {c.completed}</span>
            </div>
          )}

          {pendingCount > 0 && completedCount > 0 && (
            <div className="border-2 border-ink/15 bg-white px-4 py-3 mb-6 flex items-center gap-2">
              <Clock size={15} className="text-ink/50 flex-shrink-0" />
              <p className="text-xs text-ink/60">{c.pendingInfo(pendingCount)}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {placements.map((placement, idx) => {
              const form = forms[idx];
              const completed = form ? isComplete(form) : false;

              return (
                <div key={placement.placementId} className={`border-2 p-5 transition-colors ${completed ? 'border-green-200 bg-green-50/30' : 'border-ink/15 bg-white'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-ink/40">{c.placement(idx + 1)}</span>
                      {completed && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5">
                          <CheckCircle size={10} /> {c.saved}
                        </span>
                      )}
                      {form?.willProvideLater && !completed && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-ink/50 bg-cream border border-ink/15 px-2 py-0.5">
                          <Clock size={10} /> {c.pending}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-ink/30">{placement.packageLabel}</span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2.5 mb-3">
                    <div>
                      <label className={labelCls}>{c.targetUrl}</label>
                      <input type="url" value={form?.targetUrl || ''} onChange={(e) => updateForm(idx, { targetUrl: e.target.value })} placeholder="https://example.com/page" disabled={form?.willProvideLater || submitting} className={`${inputCls} ${form?.willProvideLater ? 'opacity-50' : ''}`} />
                    </div>
                    <div>
                      <label className={labelCls}>{c.anchorText}</label>
                      <input type="text" value={form?.anchor || ''} onChange={(e) => updateForm(idx, { anchor: e.target.value })} placeholder="best crm software" disabled={form?.willProvideLater || submitting} className={`${inputCls} ${form?.willProvideLater ? 'opacity-50' : ''}`} />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className={labelCls}>{c.niche}</label>
                    <input type="text" value={form?.niche || ''} onChange={(e) => updateForm(idx, { niche: e.target.value })} placeholder="e.g. SaaS, Marketing, Finance" disabled={form?.willProvideLater || submitting} className={`${inputCls} ${form?.willProvideLater ? 'opacity-50' : ''}`} />
                  </div>

                  <div className="mb-3">
                    <label className={labelCls}>{c.notes}</label>
                    <input type="text" value={form?.notes || ''} onChange={(e) => updateForm(idx, { notes: e.target.value })} placeholder="Optional: competitor pages, anchor restrictions, etc." disabled={form?.willProvideLater || submitting} className={`${inputCls} ${form?.willProvideLater ? 'opacity-50' : ''}`} />
                  </div>

                  <label className="flex items-center gap-2 text-xs text-ink/40 cursor-pointer">
                    <input type="checkbox" checked={form?.willProvideLater || false} onChange={(e) => updateForm(idx, { willProvideLater: e.target.checked })} disabled={submitting} className="accent-signal" />
                    {c.willProvideLater}
                  </label>
                </div>
              );
            })}

            {errorMsg && (
              <p className="text-red-600 text-xs bg-red-50 border-2 border-red-200 px-3 py-2">{errorMsg}</p>
            )}

            <Turnstile onToken={setTurnstileToken} className="mb-1" />

            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-signal hover:bg-[#EA580C] disabled:opacity-60 text-white font-bold py-4 text-sm transition-all duration-200">
              {submitting ? <><Loader2 size={16} className="animate-spin" /> {c.saving}</> : <>{c.saveRequirements} <ArrowRight size={15} /></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-ink/40">
              {c.needHelp}{' '}
              <a href="mailto:info@vladenza.com" className="text-signal font-bold">info@vladenza.com</a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
