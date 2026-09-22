import { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Minus, Plus, Trash2, Check, Loader2, CheckCircle, AlertCircle, CreditCard, ClipboardPaste, Lock } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useCart } from '../context/CartContext';
import { useCheckout, type PlacementRequirement } from '../context/CheckoutContext';
import { useLocale } from '../context/LocaleContext';
import { payWithWayForPay } from '../lib/wayforpay';
import { trackEvent, trackMetaEvent } from '../lib/analytics';

const content = {
  en: {
    steps: ['Cart', 'Requirements', 'Review', 'Payment'] as const,
    orderSummary: 'Order Summary',
    total: 'Total',
    securePayment: 'Secure payment',
    cartEmpty: 'Your cart is empty.',
    browsePackages: 'Browse Niche Edit Packages',
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
    backToLinkInsertions: 'Back to Link Insertions',
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
    next1Payment: 'Complete payment',
    next2Payment: 'We review your requirements',
    next3Payment: 'Website selection / approval where applicable',
    next4Payment: 'Placements go live',
    next5Payment: 'Receive your final report',
    name: 'Name *',
    email: 'Email *',
    company: 'Company',
    website: 'Website',
    agreeTo: 'I agree to the',
    and: 'and',
    terms: 'Terms & Conditions',
    privacyPolicy: 'Privacy Policy',
    refundPolicy: 'Refund Policy',
    processing: 'Processing...',
    paySecurely: (total: string) => `Pay ${total} Securely`,
    secureCheckout: 'Secure checkout via WayForPay',
    backToReview: 'Back to Review',
    noValidRows: 'No valid rows found. Use: URL | Anchor',
    nameEmailRequired: 'Name and email are required.',
    agreeRequired: 'Please agree to the Terms & Conditions, Privacy Policy and Refund Policy to continue.',
    paymentError: 'Payment could not be started. Please try again.',
  },
  uk: {
    steps: ['Кошик', 'Вимоги', 'Перевірка', 'Оплата'] as const,
    orderSummary: 'Підсумок замовлення',
    total: 'Разом',
    securePayment: 'Безпечна оплата',
    cartEmpty: 'Ваш кошик порожній.',
    browsePackages: 'Переглянути пакети Link Insertions',
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
    backToLinkInsertions: 'Назад до Link Insertions',
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
    next1Payment: 'Завершіть оплату',
    next2Payment: 'Ми переглядаємо ваші вимоги',
    next3Payment: 'Вибір сайту / погодження, де застосовно',
    next4Payment: 'Розміщення публікуються',
    next5Payment: 'Ви отримуєте фінальний звіт',
    name: 'Ім\u2019я *',
    email: 'Email *',
    company: 'Компанія',
    website: 'Сайт',
    agreeTo: 'Я погоджуюся з',
    and: 'та',
    terms: 'Умовами використання',
    privacyPolicy: 'Політикою конфіденційності',
    refundPolicy: 'Політикою повернення',
    processing: 'Обробка...',
    paySecurely: (total: string) => `Сплатити ${total} безпечно`,
    secureCheckout: 'Безпечна оплата через WayForPay',
    backToReview: 'Назад до перевірки',
    noValidRows: 'Не знайдено дійсних рядків. Використовуйте: URL | Якір',
    nameEmailRequired: 'Ім\u2019я та email обов\u2019язкові.',
    agreeRequired: 'Будь ласка, погодьтеся з Умовами використання, Політикою конфіденційності та Політикою повернення, щоб продовжити.',
    paymentError: 'Не вдалося ініціювати платіж. Спробуйте ще раз.',
  },
} as const;

type Step = 1 | 2 | 3 | 4;

const inputCls = 'w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#F97316]/60 focus:ring-2 focus:ring-[#F97316]/10 transition-all';
const labelCls = 'block text-xs font-semibold text-gray-500 mb-1.5';

function OrderSummary({ c }: { c: typeof content.en }) {
  const { items, total } = useCart();
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{c.orderSummary}</h3>
      <div className="flex flex-col gap-2 mb-4">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{item.quantity} × {item.name}</span>
            <span className="font-semibold text-gray-900">${(item.unitPrice * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-sm font-semibold text-gray-500">{c.total}</span>
        <span className="text-xl font-black text-gray-900">${total.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400">
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
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${active ? 'bg-[#F97316] text-white' : done ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-400'}`}>
              {done ? <Check size={11} /> : stepNum}
            </div>
            <span className={`text-xs font-semibold hidden sm:inline ${active ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
            {i < steps.length - 1 && <div className="w-6 h-px bg-gray-200 mx-1" />}
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
  const [step, setStep] = useState<Step>(itemCount === 0 ? 1 : 2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [outcome, setOutcome] = useState<'approved' | 'declined' | 'pending' | null>(null);
  const [paidOrderRef, setPaidOrderRef] = useState('');
  const [paidOrderNumber, setPaidOrderNumber] = useState('');
  const [paidRequirementsToken, setPaidRequirementsToken] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [showBulk, setShowBulk] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const initiateCheckoutFired = useRef(false);

  // Generate placement requirements from cart items
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

  // Step 1: Cart
  if (itemCount === 0 && step !== 4) {
    return (
      <div className="bg-white min-h-screen">
        <Navigation />
        <div className="pt-[88px] max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-gray-400 text-sm mb-4">{c.cartEmpty}</p>
          <Link to={lp('/services/niche-edits#packages')} className="text-sm font-semibold text-[#F97316] hover:underline">
            {c.browsePackages}
          </Link>
        </div>
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
      update({ placementRequirements: [] });
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
      });
      setOutcome(result.outcome);
      setPaidOrderRef(result.orderRef);
      setPaidOrderNumber(result.orderNumber);
      setPaidRequirementsToken(result.requirementsToken);
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
        clear();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : c.paymentError);
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (outcome === 'approved') {
    return (
      <div className="bg-white min-h-screen">
        <Navigation />
        <div className="pt-[88px] max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{c.orderConfirmed}</h1>
          <p className="text-gray-400 text-sm mb-1">{c.orderPrefix}{paidOrderNumber || paidOrderRef}</p>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            {c.receivedOrder} {data.requirementsChoice === 'later'
              ? c.needReqsLater
              : c.receivedReqs}
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 max-w-md mx-auto mb-6 text-left">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{c.whatHappensNext}</h3>
            <ul className="flex flex-col gap-2">
              {[c.next1, c.next2, c.next3, c.next4].map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={14} className="text-green-500 flex-shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {data.requirementsChoice === 'later' && paidRequirementsToken && (
              <Link to={`/order/${paidRequirementsToken}`} className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-5 py-3 rounded-lg text-sm transition-colors">
                {c.addRequirements}
              </Link>
            )}
            <Link to={lp('/services/niche-edits')} className="border border-gray-200 hover:border-gray-300 text-gray-600 font-semibold px-5 py-3 rounded-lg text-sm transition-colors">
              {c.backToLinkInsertions}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Declined / pending screens
  if (outcome === 'declined' || outcome === 'pending') {
    return (
      <div className="bg-white min-h-screen">
        <Navigation />
        <div className="pt-[88px] max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${outcome === 'declined' ? 'bg-red-50' : 'bg-orange-50'}`}>
            {outcome === 'declined' ? <AlertCircle size={32} className="text-red-500" /> : <Loader2 size={32} className="text-[#F97316] animate-spin" />}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{outcome === 'declined' ? c.paymentDeclined : c.paymentProcessing}</h1>
          <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
            {outcome === 'declined' ? c.declinedMsg : c.processingMsg(data.customerEmail)}
          </p>
          {outcome === 'declined' && (
            <button onClick={() => setOutcome(null)} className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors">
              {c.tryAgain}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Navigation />
      <div className="pt-[88px]">
        {/* Header with stepper */}
        <div className="border-b border-gray-100 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
            <Link to={lp('/services/niche-edits')} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mr-4">
              <ArrowLeft size={12} /> {c.back}
            </Link>
            <Stepper step={step} c={c} />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid lg:grid-cols-[1fr_300px] gap-8">
            {/* LEFT: current step */}
            <div>
              {/* Step 1: Cart */}
              {step === 1 && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">{c.yourCart}</h1>
                  <div className="flex flex-col gap-3 mb-8">
                    {items.map((item) => (
                      <div key={item.productId} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-400">{item.description}</div>
                          </div>
                          <button onClick={() => { removeItem(item.productId); trackEvent('remove_from_cart', { product_id: item.productId }); }} className="text-gray-300 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#F97316] hover:text-[#F97316] transition-colors">
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-semibold text-gray-900 w-8 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#F97316] hover:text-[#F97316] transition-colors">
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="text-sm font-bold text-gray-900">${(item.unitPrice * item.quantity).toLocaleString()}</div>
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
                  }} className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-3.5 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-orange-200">
                    {c.continueToReqs} <ArrowRight size={15} />
                  </button>
                </div>
              )}

              {/* Step 2: Requirements */}
              {step === 2 && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{c.tellUsWhere}</h1>
                  <p className="text-gray-500 text-sm mb-6">{c.tellUsBody}</p>

                  {/* Two choices */}
                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    <button
                      onClick={() => update({ requirementsChoice: 'now' })}
                      className={`border-2 rounded-xl p-4 text-left transition-all ${data.requirementsChoice === 'now' ? 'border-[#F97316] bg-orange-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${data.requirementsChoice === 'now' ? 'border-[#F97316] bg-[#F97316]' : 'border-gray-300'}`}>
                          {data.requirementsChoice === 'now' && <Check size={11} className="text-white" />}
                        </div>
                        <span className="text-sm font-bold text-gray-900">{c.addNow}</span>
                      </div>
                      <p className="text-xs text-gray-400 ml-7">{c.addNowBody}</p>
                    </button>
                    <button
                      onClick={() => update({ requirementsChoice: 'later' })}
                      className={`border-2 rounded-xl p-4 text-left transition-all ${data.requirementsChoice === 'later' ? 'border-[#F97316] bg-orange-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${data.requirementsChoice === 'later' ? 'border-[#F97316] bg-[#F97316]' : 'border-gray-300'}`}>
                          {data.requirementsChoice === 'later' && <Check size={11} className="text-white" />}
                        </div>
                        <span className="text-sm font-bold text-gray-900">{c.sendLater}</span>
                      </div>
                      <p className="text-xs text-gray-400 ml-7">{c.sendLaterBody}</p>
                    </button>
                  </div>

                  {/* Requirements form */}
                  {data.requirementsChoice === 'now' && (
                    <>
                      {/* Bulk paste */}
                      <div className="mb-4">
                        {!showBulk ? (
                          <button onClick={() => setShowBulk(true)} className="inline-flex items-center gap-2 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
                            <ClipboardPaste size={14} /> {c.bulkPaste}
                          </button>
                        ) : (
                          <div className="border border-gray-200 rounded-xl p-4">
                            <label className={labelCls}>{c.pasteRows}</label>
                            <textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} rows={5} placeholder="https://site.com/page1 | CRM software&#10;https://site.com/page2 | marketing automation" className={inputCls} />
                            <div className="flex gap-2 mt-2">
                              <button onClick={parseBulk} className="text-xs font-semibold bg-[#F97316] hover:bg-[#EA580C] text-white px-3 py-2 rounded-lg transition-colors">{c.apply}</button>
                              <button onClick={() => setShowBulk(false)} className="text-xs font-semibold text-gray-400 hover:text-gray-600 px-3 py-2">{c.cancel}</button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Per-placement compact rows */}
                      <div className="flex flex-col gap-2 mb-4">
                        {placementReqs.map((req, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-3.5">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{c.link(idx + 1)}</span>
                              <span className="text-[10px] font-semibold text-gray-300">{req.packageLabel}</span>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-2.5">
                              <div>
                                <label className={labelCls}>{c.targetUrl}</label>
                                <input type="url" value={req.targetUrl} onChange={(e) => updatePlacementReq(idx, { targetUrl: e.target.value })} placeholder="https://example.com/page" className={inputCls} />
                              </div>
                              <div>
                                <label className={labelCls}>{c.preferredAnchor}</label>
                                <input type="text" value={req.anchor} onChange={(e) => updatePlacementReq(idx, { anchor: e.target.value, letVladenzaRecommend: false })} placeholder="best crm software" disabled={req.letVladenzaRecommend} className={`${inputCls} ${req.letVladenzaRecommend ? 'opacity-50' : ''}`} />
                                <label className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400 cursor-pointer">
                                  <input type="checkbox" checked={req.letVladenzaRecommend} onChange={(e) => updatePlacementReq(idx, { letVladenzaRecommend: e.target.checked })} className="accent-[#F97316]" />
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

                      {/* Campaign notes */}
                      <div className="mb-6">
                        <label className={labelCls}>{c.campaignNotes}</label>
                        <textarea value={data.campaignNotes} onChange={(e) => update({ campaignNotes: e.target.value })} rows={2} placeholder={c.campaignPlaceholder} className={inputCls} />
                      </div>
                    </>
                  )}

                  {data.requirementsChoice === 'later' && (
                    <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 mb-6">
                      <p className="text-sm text-gray-500">{c.laterInfo}</p>
                    </div>
                  )}

                  {error && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">{error}</p>}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="border border-gray-200 hover:border-gray-300 text-gray-600 font-semibold px-5 py-3 rounded-lg text-sm transition-colors">
                      <span className="inline-flex items-center gap-1.5"><ArrowLeft size={14} /> {c.editCart}</span>
                    </button>
                    <button onClick={handleContinueFromRequirements} disabled={!data.requirementsChoice} className="flex-1 flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-all">
                      {c.continueToReview} <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">{c.reviewOrder}</h1>

                  {/* Items */}
                  <div className="border border-gray-200 rounded-xl p-5 mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{c.orderItems}</h2>
                    <div className="flex flex-col gap-2 mb-4">
                      {items.map((item) => (
                        <div key={item.productId} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{item.name}<br /><span className="text-xs text-gray-400">{item.description}</span></span>
                          <div className="text-right">
                            <div className="text-xs text-gray-400">{c.qty}: {item.quantity}</div>
                            <div className="font-semibold text-gray-900">${(item.unitPrice * item.quantity).toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-sm font-semibold text-gray-500">{c.total}</span>
                      <span className="text-xl font-black text-gray-900">${total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Requirements summary */}
                  <div className="border border-gray-200 rounded-xl p-5 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">{c.requirements}</h2>
                      <button onClick={() => setStep(2)} className="text-xs font-semibold text-[#F97316] hover:underline">{c.edit}</button>
                    </div>
                    {data.requirementsChoice === 'later' ? (
                      <p className="text-sm text-gray-500">{c.willBeProvided}</p>
                    ) : (
                      <p className="text-sm text-gray-500">{c.reqsProvided(providedCount)}{data.campaignNotes ? c.campaignNotesIncluded : ''}</p>
                    )}
                  </div>

                  {/* Customer info */}
                  <div className="border border-gray-200 rounded-xl p-5 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">{c.contactDetails}</h2>
                      <button onClick={() => setStep(2)} className="text-xs font-semibold text-[#F97316] hover:underline">{c.edit}</button>
                    </div>
                    <p className="text-sm text-gray-600">{data.customerName || c.notSet}<br />{data.customerEmail}</p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="border border-gray-200 hover:border-gray-300 text-gray-600 font-semibold px-5 py-3 rounded-lg text-sm transition-colors">
                      <span className="inline-flex items-center gap-1.5"><ArrowLeft size={14} /> {c.backBtn}</span>
                    </button>
                    <button onClick={handleContinueFromReview} className="flex-1 flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-3 rounded-xl text-sm transition-all">
                      {c.continueToPayment} <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Payment */}
              {step === 4 && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{c.payment}</h1>

                  {/* What happens next */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{c.whatHappensNext}</h3>
                    <ol className="flex flex-col gap-2">
                      {[c.next1Payment, c.next2Payment, c.next3Payment, c.next4Payment, c.next5Payment].map((t, i) => (
                        <li key={t} className="flex items-center gap-2.5 text-sm text-gray-600">
                          <span className="w-5 h-5 rounded-full bg-[#F97316] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                          {t}
                        </li>
                      ))}
                    </ol>
                  </div>

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

                    {error && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}

                    {/* Consent checkbox */}
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[#F97316] flex-shrink-0"
                      />
                      <span className="text-xs text-gray-500 leading-relaxed">
                        {c.agreeTo}{' '}
                        <Link to={lp('/terms')} className="text-[#F97316] hover:underline font-semibold">{c.terms}</Link>,{' '}
                        <Link to={lp('/privacy-policy')} className="text-[#F97316] hover:underline font-semibold">{c.privacyPolicy}</Link>, {c.and}{' '}
                        <Link to={lp('/refund-policy')} className="text-[#F97316] hover:underline font-semibold">{c.refundPolicy}</Link>.
                      </span>
                    </label>

                    <button type="submit" disabled={loading || !agreedToTerms} className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-orange-200">
                      {loading ? <><Loader2 size={15} className="animate-spin" /> {c.processing}</> : <><CreditCard size={15} /> {c.paySecurely(total.toLocaleString())}</>}
                    </button>
                    <p className="text-center text-xs text-gray-400">{c.secureCheckout}</p>
                  </form>

                  <button onClick={() => setStep(3)} className="mt-4 inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors">
                    <ArrowLeft size={12} /> {c.backToReview}
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT: sticky order summary (desktop) */}
            <div className="hidden lg:block">
              <div className="sticky top-28">
                <OrderSummary c={c} />
              </div>
            </div>

            {/* Mobile order summary (collapsible) */}
            <details className="lg:hidden border border-gray-200 rounded-xl">
              <summary className="px-4 py-3 text-sm font-semibold text-gray-700 cursor-pointer">{c.orderSummary} — ${total.toLocaleString()}</summary>
              <div className="px-4 pb-4"><OrderSummary c={c} /></div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
