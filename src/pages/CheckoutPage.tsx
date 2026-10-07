import { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Minus, Plus, Trash2, Check, Loader2, CheckCircle, AlertCircle, CreditCard, ClipboardPaste, Lock, ChevronDown, Mail } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useCheckout, type PlacementRequirement } from '../context/CheckoutContext';
import { useLocale } from '../context/LocaleContext';
import { useSEO } from '../hooks/useSEO';
import { payWithWayForPay } from '../lib/wayforpay';
import { trackEvent, trackMetaEvent } from '../lib/analytics';

function formatMoney(amount: number, currency = 'USD'): string {
  const symbol = currency === 'USD' ? '$' : '';
  return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

const content = {
  en: {
    steps: ['Cart', 'Requirements', 'Review', 'Payment'] as const,
    orderSummary: 'Order Summary',
    total: 'Total',
    securePayment: 'Secure payment',
    cartEmpty: 'Your cart is empty.',
    browseServices: 'Browse Services',
    orderConfirmed: 'Order Confirmed',
    orderPrefix: 'Order #',
    receivedOrder: "We've received your order.",
    needReqsLater: "We still need your link requirements — add them below or we'll reach out by email.",
    receivedReqs: "We've received your link requirements and will review them before sourcing placements.",
    whatHappensNext: 'What happens next?',
    next1: 'We review your website and requirements',
    next2: 'We source placements within the selected metrics',
    next3: 'Placements are manually checked before delivery',
    next4: "You'll receive the completed links in your order report",
    addRequirements: 'Add Requirements',
    backToHome: 'Back to Home',
    paymentDeclined: 'Payment declined',
    paymentProcessing: 'Payment processing',
    declinedMsg: "Your card wasn't charged. You can try again.",
    processingMsg: (email: string) => `We'll email you at ${email} as soon as it's confirmed.`,
    tryAgain: 'Try again',
    back: 'Back',
    yourCart: 'Your Cart',
    continueToReqs: 'Continue to Requirements',
    tellUsWhere: 'Tell Us Where the Links Should Point',
    tellUsBody: 'Add your target URLs and preferred anchors now, or send the requirements after checkout.',
    addNow: 'Add Requirements Now',
    addNowBody: 'Fill in target URLs and anchors for each placement.',
    sendLater: "I'll Send Them Later",
    sendLaterBody: 'Checkout now, provide requirements after payment.',
    bulkPaste: 'Ordering multiple links? Paste Requirements',
    pasteRows: 'Paste rows: URL | Anchor (one per line)',
    apply: 'Apply',
    cancel: 'Cancel',
    link: (n: number) => `Link ${n}`,
    targetUrl: 'Target URL *',
    preferredAnchor: 'Preferred Anchor',
    letRecommend: 'Let Vladenza recommend the anchor',
    notesOptional: 'Notes (optional)',
    campaignNotes: 'Campaign Notes',
    campaignPlaceholder: 'Competitors, preferred pages, anchor restrictions, niche requirements, countries, or anything else we should know.',
    laterInfo: "You'll be able to add requirements after payment. We'll also email you a link to submit them.",
    editCart: 'Edit Cart',
    continueToReview: 'Continue to Review',
    reviewOrder: 'Review Your Order',
    orderItems: 'Order Items',
    qty: 'Qty',
    requirements: 'Requirements',
    edit: 'Edit',
    willBeProvided: 'Will be provided after checkout',
    reqsProvided: (n: number) => `${n} target URL${n !== 1 ? 's' : ''} provided`,
    campaignNotesIncluded: ' · campaign notes included',
    contactDetails: 'Contact Details',
    notSet: '(not set)',
    backBtn: 'Back',
    continueToPayment: 'Continue to Payment',
    payment: 'Payment',
    nextStepsShort: 'After payment: we review your requirements, source placements, and deliver your report.',
    name: 'Name *',
    email: 'Email *',
    company: 'Company',
    website: 'Website',
    agreeTo: 'I agree to the',
    and: 'and',
    terms: 'Terms & Conditions',
    privacyPolicy: 'Privacy Policy',
    refundPolicy: 'Refund Policy',
    openingPayment: 'Opening secure payment…',
    paySecurely: (total: string) => `Pay ${total} securely`,
    secureCheckout: 'Secure checkout via WayForPay',
    backToReview: 'Back to Review',
    noValidRows: 'No valid rows found. Use: URL | Anchor',
    nameEmailRequired: 'Name and email are required.',
    agreeRequired: 'Please agree to the Terms & Conditions, Privacy Policy and Refund Policy to continue.',
    paymentError: "We couldn't start your payment. Please try again or contact info@vladenza.com.",
    perPost: 'includes',
    posts: 'publications',
    placements: 'placements',
  },
  uk: {
    steps: ['Кошик', 'Вимоги', 'Перевірка', 'Оплата'] as const,
    orderSummary: 'Підсумок замовлення',
    total: 'Разом',
    securePayment: 'Безпечна оплата',
    cartEmpty: 'Ваш кошик порожній.',
    browseServices: 'Переглянути послуги',
    orderConfirmed: 'Замовлення підтверджено',
    orderPrefix: 'Замовлення №',
    receivedOrder: 'Ми отримали ваше замовлення.',
    needReqsLater: 'Нам все ще потрібні ваші вимоги до посилань — додайте їх нижче або ми зв\u2019яжемося з вами через email.',
    receivedReqs: 'Ми отримали ваші вимоги до посилань і переглянемо їх перед підбором розміщень.',
    whatHappensNext: 'Що далі?',
    next1: 'Ми переглядаємо ваш сайт і вимоги',
    next2: 'Ми підбираємо розміщення за обраними метриками',
    next3: 'Розміщення перевіряються вручну перед доставкою',
    next4: 'Ви отримаєте готові посилання у звіті про замовлення',
    addRequirements: 'Додати вимоги',
    backToHome: 'На головну',
    paymentDeclined: 'Платіж відхилено',
    paymentProcessing: 'Платіж обробляється',
    declinedMsg: 'Вашу картку не було списано. Ви можете спробувати знову.',
    processingMsg: (email: string) => `Ми надішлемо вам email на ${email}, щойно він буде підтверджено.`,
    tryAgain: 'Спробувати знову',
    back: 'Назад',
    yourCart: 'Ваш кошик',
    continueToReqs: 'Продовжити до вимог',
    tellUsWhere: 'Куди мають вести посилання',
    tellUsBody: 'Додайте цільові URL та бажані якорі зараз, або надішліть вимоги після оформлення замовлення.',
    addNow: 'Додати вимоги зараз',
    addNowBody: 'Заповніть цільові URL та якорі для кожного розміщення.',
    sendLater: 'Надішлю пізніше',
    sendLaterBody: 'Оформіть замовлення зараз, надайте вимоги після оплати.',
    bulkPaste: 'Замовляєте кілька посилань? Вставте вимоги',
    pasteRows: 'Вставте рядки: URL | Якір (по одному на рядок)',
    apply: 'Застосувати',
    cancel: 'Скасувати',
    link: (n: number) => `Посилання ${n}`,
    targetUrl: 'Цільовий URL *',
    preferredAnchor: 'Бажаний якір',
    letRecommend: 'Дозволити Vladenza підібрати якір',
    notesOptional: 'Нотатки (необов\u2019язково)',
    campaignNotes: 'Нотатки кампанії',
    campaignPlaceholder: 'Конкуренти, бажані сторінки, обмеження якорів, вимоги до ніши, країни чи будь-що інше, що нам варто знати.',
    laterInfo: 'Ви зможете додати вимоги після оплати. Ми також надішлемо вам email посилання для їх надсилання.',
    editCart: 'Редагувати кошик',
    continueToReview: 'Продовжити до перевірки',
    reviewOrder: 'Перевірте ваше замовлення',
    orderItems: 'Позиції замовлення',
    qty: 'К-ть',
    requirements: 'Вимоги',
    edit: 'Редагувати',
    willBeProvided: 'Буде надано після оформлення замовлення',
    reqsProvided: (n: number) => `${n} цільов${n !== 1 ? 'их URL' : 'ий URL'} надано`,
    campaignNotesIncluded: ' · нотатки кампанії включено',
    contactDetails: 'Контактні дані',
    notSet: '(не вказано)',
    backBtn: 'Назад',
    continueToPayment: 'Продовжити до оплати',
    payment: 'Оплата',
    nextStepsShort: 'Після оплати: ми переглядаємо вимоги, підбираємо розміщення та надсилаємо звіт.',
    name: 'Ім\u2019я *',
    email: 'Email *',
    company: 'Компанія',
    website: 'Сайт',
    agreeTo: 'Я погоджуюся з',
    and: 'та',
    terms: 'Умовами використання',
    privacyPolicy: 'Політикою конфіденційності',
    refundPolicy: 'Політикою повернення',
    openingPayment: 'Відкриваємо безпечну оплату…',
    paySecurely: (total: string) => `Сплатити ${total} безпечно`,
    secureCheckout: 'Безпечна оплата через WayForPay',
    backToReview: 'Назад до перевірки',
    noValidRows: 'Не знайдено дійсних рядків. Використовуйте: URL | Якір',
    nameEmailRequired: 'Ім\u2019я та email обов\u2019язкові.',
    agreeRequired: 'Будь ласка, погодьтеся з Умовами використання, Політикою конфіденційності та Політикою повернення, щоб продовжити.',
    paymentError: 'Не вдалося ініціювати платіж. Спробуйте ще раз або напишіть на info@vladenza.com.',
    perPost: 'включає',
    posts: 'публікацій',
    placements: 'розміщень',
  },
} as const;

type Step = 1 | 2 | 3 | 4;

const inputCls = 'w-full bg-cream border border-ink/15 px-3.5 py-2.5 text-ink text-sm placeholder-ink/35 focus:outline-none focus:border-signal focus:ring-1 focus:ring-signal/30 transition-all';
const labelCls = 'block text-xs font-bold uppercase tracking-wider text-ink/50 mb-1.5';

function getItemSubtitle(item: { productId: string; description: string }, c: typeof content.en): string {
  if (item.productId.startsWith('guest-post-') && item.description) {
    return `${c.perPost} ${item.description.toLowerCase()}`;
  }
  return item.description;
}

function OrderSummary({ c, currency = 'USD' }: { c: typeof content.en; currency?: string }) {
  const { items, total } = useCart();
  return (
    <div className="border-2 border-ink/15 bg-white p-5">
      <h3 className="text-xs font-bold uppercase tracking-widest text-ink/40 mb-4">{c.orderSummary}</h3>
      <div className="flex flex-col gap-2.5 mb-4">
        {items.map((item) => (
          <div key={item.productId} className="flex items-start justify-between gap-3 text-sm">
            <div className="min-w-0">
              <span className="text-ink/70">{item.quantity} × {item.name}</span>
              {getItemSubtitle(item, c) && <p className="text-[11px] text-ink/40 mt-0.5">{getItemSubtitle(item, c)}</p>}
            </div>
            <span className="font-bold text-ink whitespace-nowrap">{formatMoney(item.unitPrice * item.quantity, currency)}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t-2 border-ink/10 pt-3">
        <span className="text-sm font-bold text-ink/50">{c.total}</span>
        <span className="font-display text-2xl font-bold text-ink">{formatMoney(total, currency)}</span>
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-xs text-ink/40">
        <Lock size={11} /> {c.securePayment}
      </div>
    </div>
  );
}

function Stepper({ step, c }: { step: Step; c: typeof content.en }) {
  const steps = c.steps;
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const active = stepNum === step;
        const done = stepNum < step;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-7 h-7 flex items-center justify-center text-xs font-bold border-2 transition-colors ${active ? 'border-signal bg-signal text-white' : done ? 'border-ink bg-ink text-white' : 'border-ink/20 bg-transparent text-ink/40'}`}>
              {done ? <Check size={12} /> : stepNum}
            </div>
            <span className={`text-xs font-bold hidden sm:inline ${active ? 'text-ink' : 'text-ink/40'}`}>{label}</span>
            {i < steps.length - 1 && <div className="w-5 h-px bg-ink/20 mx-0.5" />}
          </div>
        );
      })}
    </div>
  );
}

export default function CheckoutPage() {
  const { items, total, itemCount, updateQuantity, removeItem, clear } = useCart();
  const { data, update } = useCheckout();
  const { locale, localizePath: lp } = useLocale();
  const c = content[locale];
  const currency = 'USD';
  const [step, setStep] = useState<Step>(itemCount === 0 ? 1 : 2);

  useSEO({
    title: locale === 'uk' ? 'Оформлення замовлення | Vladenza' : 'Checkout | Vladenza',
    description: locale === 'uk'
      ? 'Безпечне оформлення замовлення на послуги лінкбілдингу. Оплата через WayForPay.'
      : 'Secure checkout for link building services. Payment via WayForPay.',
    canonical: locale === 'uk' ? 'https://vladenza.com/uk/checkout/' : 'https://vladenza.com/checkout/',
    noindex: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [outcome, setOutcome] = useState<'approved' | 'declined' | 'pending' | null>(null);
  const [paidOrderRef, setPaidOrderRef] = useState('');
  const [paidOrderNumber, setPaidOrderNumber] = useState('');
  const [paidRequirementsToken, setPaidRequirementsToken] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [showBulk, setShowBulk] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const initiateCheckoutFired = useRef(false);

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

  // Empty cart screen
  if (itemCount === 0 && step !== 4 && outcome !== 'approved') {
    return (
      <div className="bg-cream min-h-screen">
        <Navigation />
        <div className="pt-[88px] max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
          <p className="text-ink/40 text-sm mb-5">{c.cartEmpty}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to={lp('/services/niche-edits')} className="inline-flex items-center gap-2 bg-signal hover:bg-[#EA580C] text-white font-bold px-5 py-3 text-sm transition-colors">
              Link Insertions <ArrowRight size={15} />
            </Link>
            <Link to={lp('/services/guest-posting')} className="inline-flex items-center gap-2 border-2 border-ink text-ink hover:bg-ink hover:text-white font-bold px-5 py-3 text-sm transition-colors">
              Guest Posting
            </Link>
            <Link to={lp('/services/crowd-links')} className="inline-flex items-center gap-2 border-2 border-ink text-ink hover:bg-ink hover:text-white font-bold px-5 py-3 text-sm transition-colors">
              Crowd Marketing
            </Link>
          </div>
        </div>
        <Footer />
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
    if (parsed.length === 0) { setError(c.noValidRows); return; }
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
      update({ placementRequirements: [], paymentAttemptId: '' });
    } else {
      update({ paymentAttemptId: '' });
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
      setError(c.nameEmailRequired);
      return;
    }
    if (!agreedToTerms) {
      setError(c.agreeRequired);
      return;
    }
    setError('');
    setLoading(true);
    setOutcome(null);

    const checkoutAttemptId = data.paymentAttemptId || crypto.randomUUID();
    if (!data.paymentAttemptId) update({ paymentAttemptId: checkoutAttemptId });
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
        checkoutAttemptId,
      });
      setOutcome(result.outcome);
      setPaidOrderRef(result.orderRef);
      setPaidOrderNumber(result.orderNumber);
      setPaidRequirementsToken(result.requirementsToken);
      if (result.outcome === 'declined') {
        update({ paymentAttemptId: '' });
      }
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
        update({ paymentAttemptId: '' });
        clear();
      }
    } catch {
      setError(c.paymentError);
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (outcome === 'approved') {
    return (
      <div className="bg-cream min-h-screen">
        <Navigation />
        <div className="pt-[88px] max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="w-16 h-16 border-2 border-green-600 bg-green-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-bold text-ink mb-2">{c.orderConfirmed}</h1>
          <p className="text-ink/40 text-sm mb-1">{c.orderPrefix}{paidOrderNumber || paidOrderRef}</p>
          <p className="text-ink/60 text-sm max-w-md mx-auto mb-8">
            {c.receivedOrder} {data.requirementsChoice === 'later'
              ? c.needReqsLater
              : c.receivedReqs}
          </p>
          <div className="border-2 border-ink/15 bg-white p-5 max-w-md mx-auto mb-6 text-left">
            <h3 className="text-xs font-bold uppercase tracking-widest text-ink/40 mb-3">{c.whatHappensNext}</h3>
            <ul className="flex flex-col gap-2">
              {[c.next1, c.next2, c.next3, c.next4].map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-ink/70">
                  <Check size={14} className="text-green-600 flex-shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {data.requirementsChoice === 'later' && paidRequirementsToken && (
              <Link to={`/order/${paidRequirementsToken}`} className="inline-flex items-center gap-2 bg-signal hover:bg-[#EA580C] text-white font-bold px-5 py-3 text-sm transition-colors">
                {c.addRequirements}
              </Link>
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

  // Declined / pending screens
  if (outcome === 'declined' || outcome === 'pending') {
    return (
      <div className="bg-cream min-h-screen">
        <Navigation />
        <div className="pt-[88px] max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className={`w-16 h-16 border-2 flex items-center justify-center mx-auto mb-5 ${outcome === 'declined' ? 'border-red-500 bg-red-50' : 'border-signal bg-orange-50'}`}>
            {outcome === 'declined' ? <AlertCircle size={32} className="text-red-500" /> : <Loader2 size={32} className="text-signal animate-spin" />}
          </div>
          <h1 className="font-display text-2xl font-bold text-ink mb-2">{outcome === 'declined' ? c.paymentDeclined : c.paymentProcessing}</h1>
          <p className="text-ink/50 text-sm max-w-sm mx-auto mb-6">
            {outcome === 'declined' ? c.declinedMsg : c.processingMsg(data.customerEmail)}
          </p>
          {outcome === 'declined' && (
            <button onClick={() => setOutcome(null)} className="inline-flex items-center gap-2 bg-signal hover:bg-[#EA580C] text-white font-bold px-6 py-3 text-sm transition-colors">
              {c.tryAgain}
            </button>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <Navigation />
      <div className="pt-[88px]">
        {/* Header with stepper — solid navy bar */}
        <div className="bg-navy text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
            <Link to={lp('/')} className="flex items-center gap-1.5 text-xs text-cream/50 hover:text-white transition-colors mr-2">
              <ArrowLeft size={12} /> {c.back}
            </Link>
            <Stepper step={step} c={c} />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 pb-[calc(7rem+env(safe-area-inset-bottom)+env(keyboard-inset-height))] lg:pb-10">
          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            {/* LEFT: current step */}
            <div className="min-w-0">
              {/* Step 1: Cart */}
              {step === 1 && (
                <div>
                  <h1 className="font-display text-3xl font-bold text-ink mb-6">{c.yourCart}</h1>
                  <div className="flex flex-col gap-3 mb-8">
                    {items.map((item) => (
                      <div key={item.productId} className="border-2 border-ink/15 bg-white p-4">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-ink">{item.name}</div>
                            {getItemSubtitle(item, c) && <div className="text-xs text-ink/40 mt-0.5">{getItemSubtitle(item, c)}</div>}
                          </div>
                          <button onClick={() => { removeItem(item.productId); update({ paymentAttemptId: '' }); trackEvent('remove_from_cart', { product_id: item.productId }); }} className="text-ink/30 hover:text-red-500 transition-colors flex-shrink-0">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button onClick={() => { updateQuantity(item.productId, item.quantity - 1); update({ paymentAttemptId: '' }); }} className="w-8 h-8 border-2 border-ink/15 flex items-center justify-center text-ink/60 hover:border-signal hover:text-signal transition-colors">
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-bold text-ink w-8 text-center">{item.quantity}</span>
                            <button onClick={() => { updateQuantity(item.productId, item.quantity + 1); update({ paymentAttemptId: '' }); }} className="w-8 h-8 border-2 border-ink/15 flex items-center justify-center text-ink/60 hover:border-signal hover:text-signal transition-colors">
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="text-sm font-bold text-ink">{formatMoney(item.unitPrice * item.quantity, currency)}</div>
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
                  }} className="w-full flex items-center justify-center gap-2 bg-signal hover:bg-[#EA580C] text-white font-bold py-3.5 text-sm transition-all duration-200">
                    {c.continueToReqs} <ArrowRight size={15} />
                  </button>
                </div>
              )}

              {/* Step 2: Requirements */}
              {step === 2 && (
                <div>
                  <h1 className="font-display text-3xl font-bold text-ink mb-2">{c.tellUsWhere}</h1>
                  <p className="text-ink/50 text-sm mb-6">{c.tellUsBody}</p>

                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    <button
                      onClick={() => update({ requirementsChoice: 'now' })}
                      className={`border-2 p-4 text-left transition-all ${data.requirementsChoice === 'now' ? 'border-signal bg-orange-50/30' : 'border-ink/15 hover:border-ink/30 bg-white'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-5 h-5 border-2 flex items-center justify-center ${data.requirementsChoice === 'now' ? 'border-signal bg-signal' : 'border-ink/25'}`}>
                          {data.requirementsChoice === 'now' && <Check size={11} className="text-white" />}
                        </div>
                        <span className="text-sm font-bold text-ink">{c.addNow}</span>
                      </div>
                      <p className="text-xs text-ink/40 ml-7">{c.addNowBody}</p>
                    </button>
                    <button
                      onClick={() => update({ requirementsChoice: 'later' })}
                      className={`border-2 p-4 text-left transition-all ${data.requirementsChoice === 'later' ? 'border-signal bg-orange-50/30' : 'border-ink/15 hover:border-ink/30 bg-white'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-5 h-5 border-2 flex items-center justify-center ${data.requirementsChoice === 'later' ? 'border-signal bg-signal' : 'border-ink/25'}`}>
                          {data.requirementsChoice === 'later' && <Check size={11} className="text-white" />}
                        </div>
                        <span className="text-sm font-bold text-ink">{c.sendLater}</span>
                      </div>
                      <p className="text-xs text-ink/40 ml-7">{c.sendLaterBody}</p>
                    </button>
                  </div>

                  {data.requirementsChoice === 'now' && (
                    <>
                      <div className="mb-4">
                        {!showBulk ? (
                          <button onClick={() => setShowBulk(true)} className="inline-flex items-center gap-2 text-sm font-bold text-signal hover:text-[#EA580C] transition-colors">
                            <ClipboardPaste size={14} /> {c.bulkPaste}
                          </button>
                        ) : (
                          <div className="border-2 border-ink/15 bg-white p-4">
                            <label className={labelCls}>{c.pasteRows}</label>
                            <textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} rows={5} placeholder="https://site.com/page1 | CRM software&#10;https://site.com/page2 | marketing automation" className={inputCls} />
                            <div className="flex gap-2 mt-2">
                              <button onClick={parseBulk} className="text-xs font-bold bg-signal hover:bg-[#EA580C] text-white px-3 py-2 transition-colors">{c.apply}</button>
                              <button onClick={() => setShowBulk(false)} className="text-xs font-bold text-ink/40 hover:text-ink/60 px-3 py-2">{c.cancel}</button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 mb-4">
                        {placementReqs.map((req, idx) => (
                          <div key={idx} className="border-2 border-ink/15 bg-white p-3.5">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-ink/40">{c.link(idx + 1)}</span>
                              <span className="text-[10px] font-bold text-ink/30">{req.packageLabel}</span>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-2.5">
                              <div>
                                <label className={labelCls}>{c.targetUrl}</label>
                                <input type="url" value={req.targetUrl} onChange={(e) => updatePlacementReq(idx, { targetUrl: e.target.value })} placeholder="https://example.com/page" className={inputCls} />
                              </div>
                              <div>
                                <label className={labelCls}>{c.preferredAnchor}</label>
                                <input type="text" value={req.anchor} onChange={(e) => updatePlacementReq(idx, { anchor: e.target.value, letVladenzaRecommend: false })} placeholder="best crm software" disabled={req.letVladenzaRecommend} className={`${inputCls} ${req.letVladenzaRecommend ? 'opacity-50' : ''}`} />
                                <label className="flex items-center gap-1.5 mt-1.5 text-xs text-ink/40 cursor-pointer">
                                  <input type="checkbox" checked={req.letVladenzaRecommend} onChange={(e) => updatePlacementReq(idx, { letVladenzaRecommend: e.target.checked })} className="accent-signal" />
                                  {c.letRecommend}
                                </label>
                              </div>
                            </div>
                            <div className="mt-2">
                              <input type="text" value={req.notes} onChange={(e) => updatePlacementReq(idx, { notes: e.target.value })} placeholder={c.notesOptional} className={inputCls} />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mb-6">
                        <label className={labelCls}>{c.campaignNotes}</label>
                        <textarea value={data.campaignNotes} onChange={(e) => update({ campaignNotes: e.target.value })} rows={2} placeholder={c.campaignPlaceholder} className={inputCls} />
                      </div>
                    </>
                  )}

                  {data.requirementsChoice === 'later' && (
                    <div className="border-2 border-signal/30 bg-orange-50/20 p-4 mb-6">
                      <p className="text-sm text-ink/60">{c.laterInfo}</p>
                    </div>
                  )}

                  {error && <p className="text-red-600 text-xs bg-red-50 border-2 border-red-200 px-3 py-2 mb-4">{error}</p>}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="border-2 border-ink/15 hover:border-ink/30 text-ink/60 font-bold px-5 py-3 text-sm transition-colors bg-white">
                      <span className="inline-flex items-center gap-1.5"><ArrowLeft size={14} /> {c.editCart}</span>
                    </button>
                    <button onClick={handleContinueFromRequirements} disabled={!data.requirementsChoice} className="flex-1 flex items-center justify-center gap-2 bg-signal hover:bg-[#EA580C] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 text-sm transition-all">
                      {c.continueToReview} <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div>
                  <h1 className="font-display text-3xl font-bold text-ink mb-6">{c.reviewOrder}</h1>

                  <div className="border-2 border-ink/15 bg-white p-5 mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-ink/40 mb-3">{c.orderItems}</h2>
                    <div className="flex flex-col gap-2.5 mb-4">
                      {items.map((item) => (
                        <div key={item.productId} className="flex items-start justify-between gap-3 text-sm">
                          <div className="min-w-0">
                            <span className="text-ink/80">{item.name}</span>
                            {getItemSubtitle(item, c) && <span className="text-xs text-ink/40 block mt-0.5">{getItemSubtitle(item, c)}</span>}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xs text-ink/40">{c.qty}: {item.quantity}</div>
                            <div className="font-bold text-ink">{formatMoney(item.unitPrice * item.quantity, currency)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t-2 border-ink/10 pt-3">
                      <span className="text-sm font-bold text-ink/50">{c.total}</span>
                      <span className="font-display text-2xl font-bold text-ink">{formatMoney(total, currency)}</span>
                    </div>
                  </div>

                  <div className="border-2 border-ink/15 bg-white p-5 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xs font-bold uppercase tracking-widest text-ink/40">{c.requirements}</h2>
                      <button onClick={() => setStep(2)} className="text-xs font-bold text-signal hover:underline">{c.edit}</button>
                    </div>
                    {data.requirementsChoice === 'later' ? (
                      <p className="text-sm text-ink/60">{c.willBeProvided}</p>
                    ) : (
                      <p className="text-sm text-ink/60">{c.reqsProvided(providedCount)}{data.campaignNotes ? c.campaignNotesIncluded : ''}</p>
                    )}
                  </div>

                  <div className="border-2 border-ink/15 bg-white p-5 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xs font-bold uppercase tracking-widest text-ink/40">{c.contactDetails}</h2>
                      <button onClick={() => setStep(4)} className="text-xs font-bold text-signal hover:underline">{c.edit}</button>
                    </div>
                    <p className="text-sm text-ink/70">{data.customerName || c.notSet}<br />{data.customerEmail || c.notSet}</p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="border-2 border-ink/15 hover:border-ink/30 text-ink/60 font-bold px-5 py-3 text-sm transition-colors bg-white">
                      <span className="inline-flex items-center gap-1.5"><ArrowLeft size={14} /> {c.backBtn}</span>
                    </button>
                    <button onClick={handleContinueFromReview} className="flex-1 flex items-center justify-center gap-2 bg-signal hover:bg-[#EA580C] text-white font-bold py-3 text-sm transition-all">
                      {c.continueToPayment} <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Payment */}
              {step === 4 && (
                <div>
                  <h1 className="font-display text-3xl font-bold text-ink mb-1">{c.payment}</h1>
                  <p className="text-sm text-ink/45 mb-6">{c.nextStepsShort}</p>

                  <form onSubmit={handlePay} className="flex flex-col gap-4">
                    <div>
                      <label className={labelCls}>{c.name}</label>
                      <input type="text" required value={data.customerName} onChange={(e) => update({ customerName: e.target.value })} placeholder="Jane Doe" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>{c.email}</label>
                      <input type="email" required value={data.customerEmail} onChange={(e) => update({ customerEmail: e.target.value })} placeholder="you@company.com" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>{c.company}</label>
                      <input type="text" value={data.customerCompany} onChange={(e) => update({ customerCompany: e.target.value })} placeholder="Acme Inc." className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>{c.website}</label>
                      <input type="url" value={data.customerWebsite} onChange={(e) => update({ customerWebsite: e.target.value })} placeholder="https://yoursite.com" className={inputCls} />
                    </div>

                    {error && (
                      <p className="text-red-600 text-xs bg-red-50 border-2 border-red-200 px-3 py-2.5 flex items-start gap-2">
                        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" /> {error}
                      </p>
                    )}

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-0.5 w-4 h-4 border-ink/20 accent-signal flex-shrink-0"
                      />
                      <span className="text-xs text-ink/55 leading-relaxed">
                        {c.agreeTo}{' '}
                        <Link to={lp('/terms')} className="text-signal hover:underline font-bold">{c.terms}</Link>,{' '}
                        <Link to={lp('/privacy-policy')} className="text-signal hover:underline font-bold">{c.privacyPolicy}</Link>, {c.and}{' '}
                        <Link to={lp('/refund-policy')} className="text-signal hover:underline font-bold">{c.refundPolicy}</Link>.
                      </span>
                    </label>

                    <button type="submit" disabled={loading || !agreedToTerms} className="w-full flex items-center justify-center gap-2 bg-signal hover:bg-[#EA580C] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 text-sm transition-all duration-200">
                      {loading ? <><Loader2 size={16} className="animate-spin" /> {c.openingPayment}</> : <><CreditCard size={16} /> {c.paySecurely(formatMoney(total, currency))}</>}
                    </button>
                    <p className="text-center text-xs text-ink/40">{c.secureCheckout}</p>
                  </form>

                  <button onClick={() => setStep(3)} className="mt-4 inline-flex items-center gap-1.5 text-xs text-ink/40 hover:text-ink/70 transition-colors">
                    <ArrowLeft size={12} /> {c.backToReview}
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT: sticky order summary (desktop) */}
            <div className="hidden lg:block">
              <div className="sticky top-28">
                <OrderSummary c={c} currency={currency} />
              </div>
            </div>

            {/* Mobile order summary (collapsible) */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
                className="w-full flex items-center justify-between border-2 border-ink/15 bg-white px-4 py-3 text-sm font-bold text-ink"
              >
                <span>{c.orderSummary}</span>
                <span className="flex items-center gap-2">
                  {formatMoney(total, currency)}
                  <ChevronDown size={16} className={`transition-transform ${mobileSummaryOpen ? 'rotate-180' : ''}`} />
                </span>
              </button>
              {mobileSummaryOpen && (
                <div className="mt-2"><OrderSummary c={c} currency={currency} /></div>
              )}
              {/* Always-visible total bar at bottom on mobile */}
              {!mobileSummaryOpen && (
                <div className="fixed bottom-0 left-0 right-0 z-30 bg-navy text-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center justify-between lg:hidden" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px) + env(keyboard-inset-height, 0px))' }}>
                  <span className="text-sm font-bold text-cream/70">{c.total}</span>
                  <span className="font-display text-xl font-bold">{formatMoney(total, currency)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
