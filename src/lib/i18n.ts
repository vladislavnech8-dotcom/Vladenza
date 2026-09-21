// ─── i18n Translation Dictionary ────────────────────────────────
// Central dictionary for all UI strings. Each key has EN and UK values.
// Pages and components pull strings from here via useLocale().

export type Locale = 'en' | 'uk';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  uk: 'UA',
};

export interface TranslationKey {
  // Navigation
  'nav.services': string;
  'nav.packages': string;
  'nav.caseStudies': string;
  'nav.blog': string;
  'nav.pricing': string;
  'nav.faq': string;
  'nav.getQuote': string;
  'nav.getPackage': string;
  'nav.explore': string;
  'nav.linkPackages': string;
  'nav.toggleMenu': string;
  'nav.openCart': string;
  'nav.brand': string;
  'nav.agency': string;
  'nav.languageSwitch': string;

  // Services dropdown
  'nav.svc.seoAudit': string;
  'nav.svc.seoAuditDesc': string;
  'nav.svc.guestPosting': string;
  'nav.svc.guestPostingDesc': string;
  'nav.svc.nicheEdits': string;
  'nav.svc.nicheEditsDesc': string;
  'nav.svc.crowdLinks': string;
  'nav.svc.crowdLinksDesc': string;
  'nav.svc.aiLlm': string;
  'nav.svc.aiLlmDesc': string;
  'nav.svc.localSeo': string;
  'nav.svc.localSeoDesc': string;
  'nav.svc.linkedinPersonal': string;
  'nav.svc.linkedinPersonalDesc': string;
  'nav.svc.linkedinCompany': string;
  'nav.svc.linkedinCompanyDesc': string;
  'nav.svc.whiteLabel': string;
  'nav.svc.whiteLabelDesc': string;

  // Niche packages
  'nav.pkg.igaming': string;
  'nav.pkg.igamingDesc': string;
  'nav.pkg.saas': string;
  'nav.pkg.saasDesc': string;
  'nav.pkg.auto': string;
  'nav.pkg.autoDesc': string;
  'nav.pkg.health': string;
  'nav.pkg.healthDesc': string;
  'nav.pkg.proxy': string;
  'nav.pkg.proxyDesc': string;
  'nav.pkg.renovations': string;
  'nav.pkg.renovationsDesc': string;

  // Footer
  'footer.tagline': string;
  'footer.linkBuilding': string;
  'footer.company': string;
  'footer.resources': string;
  'footer.legal': string;
  'footer.customPlan': string;
  'footer.about': string;
  'footer.reviews': string;
  'footer.howItWorks': string;
  'footer.contact': string;
  'footer.realPlacements': string;
  'footer.terms': string;
  'footer.privacy': string;
  'footer.refund': string;
  'footer.cookiePolicy': string;
  'footer.rights': string;
  'footer.cookiePrefs': string;

  // Cookie banner
  'cookie.title': string;
  'cookie.body': string;
  'cookie.acceptAll': string;
  'cookie.rejectOptional': string;
  'cookie.preferences': string;
  'cookie.policy': string;
  'cookie.prefsTitle': string;
  'cookie.prefsBody': string;
  'cookie.essential': string;
  'cookie.essentialDesc': string;
  'cookie.alwaysOn': string;
  'cookie.analytics': string;
  'cookie.analyticsDesc': string;
  'cookie.savePrefs': string;
  'cookie.cancel': string;
  'cookie.toggleAnalytics': string;

  // Lead form
  'form.title': string;
  'form.subtitle': string;
  'form.email': string;
  'form.emailPlaceholder': string;
  'form.website': string;
  'form.websitePlaceholder': string;
  'form.whatsapp': string;
  'form.whatsappPlaceholder': string;
  'form.telegram': string;
  'form.telegramPlaceholder': string;
  'form.budget': string;
  'form.budgetPlaceholder': string;
  'form.budget1': string;
  'form.budget2': string;
  'form.budget3': string;
  'form.budget4': string;
  'form.submit': string;
  'form.sending': string;
  'form.noSpam': string;
  'form.privacyPolicy': string;
  'form.errorEmail': string;
  'form.errorGeneric': string;
  'form.successTitle': string;
  'form.successBody': string;
  'form.services.guestPosting': string;
  'form.services.nicheEdits': string;
  'form.services.crowdLinks': string;
  'form.services.linkPackages': string;
  'form.services.seoAudit': string;
  'form.services.aiLlm': string;
  'form.services.localSeo': string;

  // Error boundary
  'error.title': string;
  'error.body': string;
  'error.backHome': string;

  // Page loader
  'loader.loading': string;

  // Common
  'common.refresh': string;
  'common.back': string;
  'common.save': string;
  'common.cancel': string;
  'common.delete': string;
  'common.edit': string;
  'common.search': string;
  'common.loading': string;
  'common.noResults': string;
}

export const translations: Record<Locale, TranslationKey> = {
  en: {
    // Navigation
    'nav.services': 'Services & Packages',
    'nav.packages': 'Link Packages',
    'nav.caseStudies': 'Case Studies',
    'nav.blog': 'Blog',
    'nav.pricing': 'Pricing',
    'nav.faq': 'FAQ',
    'nav.getQuote': 'Get a Custom Quote',
    'nav.getPackage': 'Get a Custom Package',
    'nav.explore': 'Explore:',
    'nav.linkPackages': 'Link Packages',
    'nav.toggleMenu': 'Toggle menu',
    'nav.openCart': 'Open cart',
    'nav.brand': 'Vladen',
    'nav.agency': 'za',
    'nav.languageSwitch': 'Switch language',

    // Services dropdown
    'nav.svc.seoAudit': 'SEO Audit',
    'nav.svc.seoAuditDesc': 'Full technical & strategic audit',
    'nav.svc.guestPosting': 'Guest Posting',
    'nav.svc.guestPostingDesc': 'Editorial links on real traffic sites',
    'nav.svc.nicheEdits': 'Niche Edits',
    'nav.svc.nicheEditsDesc': 'Links inserted in aged, indexed content',
    'nav.svc.crowdLinks': 'Crowd Links',
    'nav.svc.crowdLinksDesc': 'Forum & community link building',
    'nav.svc.aiLlm': 'AI & LLM SEO',
    'nav.svc.aiLlmDesc': 'Get cited by ChatGPT & Perplexity',
    'nav.svc.localSeo': 'Local SEO Links',
    'nav.svc.localSeoDesc': 'Map pack & local organic rankings',
    'nav.svc.linkedinPersonal': 'LinkedIn Personal',
    'nav.svc.linkedinPersonalDesc': 'Personal brand & profile growth',
    'nav.svc.linkedinCompany': 'LinkedIn Company',
    'nav.svc.linkedinCompanyDesc': 'Company page management & B2B leads',
    'nav.svc.whiteLabel': 'White Label',
    'nav.svc.whiteLabelDesc': 'Silent fulfilment for agencies',

    // Niche packages
    'nav.pkg.igaming': 'iGaming Links',
    'nav.pkg.igamingDesc': 'Casino, sports betting, poker',
    'nav.pkg.saas': 'SaaS Links',
    'nav.pkg.saasDesc': 'B2B tech & software',
    'nav.pkg.auto': 'Automotive Links',
    'nav.pkg.autoDesc': 'Dealerships, parts, reviews',
    'nav.pkg.health': 'Health Links',
    'nav.pkg.healthDesc': 'Supplements, fitness, medical',
    'nav.pkg.proxy': 'Proxy & VPN Links',
    'nav.pkg.proxyDesc': 'VPN, proxy, cybersecurity',
    'nav.pkg.renovations': 'Home Reno Links',
    'nav.pkg.renovationsDesc': 'Plumbing, contractors, HVAC',

    // Footer
    'footer.tagline': 'Link building for brands and agencies. Niche edits, guest posts and community links backed by manual review.',
    'footer.linkBuilding': 'Link Building',
    'footer.company': 'Company',
    'footer.resources': 'Resources',
    'footer.legal': 'Legal',
    'footer.customPlan': 'Custom Link Plan',
    'footer.about': 'About',
    'footer.reviews': 'Reviews',
    'footer.howItWorks': 'How It Works',
    'footer.contact': 'Contact',
    'footer.realPlacements': 'Real Placements',
    'footer.terms': 'Terms & Conditions',
    'footer.privacy': 'Privacy Policy',
    'footer.refund': 'Refund Policy',
    'footer.cookiePolicy': 'Cookie Policy',
    'footer.rights': 'All rights reserved.',
    'footer.cookiePrefs': 'Cookies',

    // Cookie banner
    'cookie.title': 'Cookies & Privacy',
    'cookie.body': 'We use essential cookies to operate the website and optional analytics/marketing cookies to understand performance and improve our services.',
    'cookie.acceptAll': 'Accept All',
    'cookie.rejectOptional': 'Reject Optional',
    'cookie.preferences': 'Preferences',
    'cookie.policy': 'Cookie Policy',
    'cookie.prefsTitle': 'Cookie Preferences',
    'cookie.prefsBody': 'Choose which categories of cookies you allow. Essential cookies are always enabled.',
    'cookie.essential': 'Essential',
    'cookie.essentialDesc': 'Required for the website to function',
    'cookie.alwaysOn': 'Always on',
    'cookie.analytics': 'Analytics & Marketing',
    'cookie.analyticsDesc': 'Google Analytics & Google Ads',
    'cookie.savePrefs': 'Save Preferences',
    'cookie.cancel': 'Cancel',
    'cookie.toggleAnalytics': 'Toggle analytics cookies',

    // Lead form
    'form.title': 'Get a Custom Link Building Quote',
    'form.subtitle': 'Share your domain and niche — we\u2019ll prepare a tailored quote within 24 h.',
    'form.email': 'Work email',
    'form.emailPlaceholder': 'you@company.com',
    'form.website': 'Website URL',
    'form.websitePlaceholder': 'https://yoursite.com',
    'form.whatsapp': 'WhatsApp',
    'form.whatsappPlaceholder': '+1 234 567 8900',
    'form.telegram': 'Telegram',
    'form.telegramPlaceholder': '@username',
    'form.budget': 'Monthly Budget',
    'form.budgetPlaceholder': 'Select budget range\u2026',
    'form.budget1': '$500\u20131,000',
    'form.budget2': '$1,000\u20133,000',
    'form.budget3': '$3,000+',
    'form.budget4': 'Not sure yet',
    'form.submit': 'Get a Custom Quote',
    'form.sending': 'Sending...',
    'form.noSpam': 'No spam. No credit card.',
    'form.privacyPolicy': 'Privacy Policy',
    'form.errorEmail': 'Please use a real work email address.',
    'form.errorGeneric': 'Something went wrong. Please try again.',
    'form.successTitle': 'You\u2019re on the list!',
    'form.successBody': 'We\u2019ll be in touch within 24 hours with your custom plan.',
    'form.services.guestPosting': 'Guest Posting',
    'form.services.nicheEdits': 'Niche Edits',
    'form.services.crowdLinks': 'Crowd Links',
    'form.services.linkPackages': 'Link Packages',
    'form.services.seoAudit': 'SEO Audit',
    'form.services.aiLlm': 'AI / LLM',
    'form.services.localSeo': 'Local SEO',

    // Error boundary
    'error.title': 'Something went wrong',
    'error.body': 'An unexpected error occurred. Please try refreshing the page.',
    'error.backHome': 'Back to Home',

    // Page loader
    'loader.loading': 'Loading',

    // Common
    'common.refresh': 'Refresh',
    'common.back': 'Back',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.search': 'Search',
    'common.loading': 'Loading',
    'common.noResults': 'No results found.',
  },

  uk: {
    // Navigation
    'nav.services': 'Послуги та пакети',
    'nav.packages': 'Пакети лінкбілдингу',
    'nav.caseStudies': 'Кейси',
    'nav.blog': 'Блог',
    'nav.pricing': 'Ціни',
    'nav.faq': 'FAQ',
    'nav.getQuote': 'Отримати пропозицію',
    'nav.getPackage': 'Отримати пакет',
    'nav.explore': 'Розділи:',
    'nav.linkPackages': 'Пакети лінкбілдингу',
    'nav.toggleMenu': 'Відкрити меню',
    'nav.openCart': 'Відкрити кошик',
    'nav.brand': 'Vladen',
    'nav.agency': 'za',
    'nav.languageSwitch': 'Змінити мову',

    // Services dropdown
    'nav.svc.seoAudit': 'SEO-аудит',
    'nav.svc.seoAuditDesc': 'Повний технічний та стратегічний аудит',
    'nav.svc.guestPosting': 'Гостьові публікації',
    'nav.svc.guestPostingDesc': 'Редакційні посилання на сайтах з реальним трафіком',
    'nav.svc.nicheEdits': 'Розміщення посилань у готових статтях',
    'nav.svc.nicheEditsDesc': 'Посилання в існуючих проіндексованих статтях',
    'nav.svc.crowdLinks': 'Крауд-маркетинг',
    'nav.svc.crowdLinksDesc': 'Лінкбілдинг на форумах та спільнотах',
    'nav.svc.aiLlm': 'Видимість в AI та LLM',
    'nav.svc.aiLlmDesc': 'Цитування в ChatGPT та Perplexity',
    'nav.svc.localSeo': 'Локальний лінкбілдинг',
    'nav.svc.localSeoDesc': 'Просування в локальній видачі та на картах',
    'nav.svc.linkedinPersonal': 'LinkedIn Personal',
    'nav.svc.linkedinPersonalDesc': 'Просування особистого бренду та профілю',
    'nav.svc.linkedinCompany': 'LinkedIn Company',
    'nav.svc.linkedinCompanyDesc': 'Управління сторінкою компанії та B2B-ліди',
    'nav.svc.whiteLabel': 'White Label',
    'nav.svc.whiteLabelDesc': 'Тиха реалізація для агенцій',

    // Niche packages
    'nav.pkg.igaming': 'iGaming посилання',
    'nav.pkg.igamingDesc': 'Казино, ставки на спорт, покер',
    'nav.pkg.saas': 'SaaS посилання',
    'nav.pkg.saasDesc': 'B2B-технології та програмне забезпечення',
    'nav.pkg.auto': 'Автомобільні посилання',
    'nav.pkg.autoDesc': 'Дилери, запчастини, відгуки',
    'nav.pkg.health': 'Медичні посилання',
    'nav.pkg.healthDesc': 'Добавки, фітнес, медицина',
    'nav.pkg.proxy': 'Proxy та VPN посилання',
    'nav.pkg.proxyDesc': 'VPN, проксі, кібербезпека',
    'nav.pkg.renovations': 'Посилання для ремонту',
    'nav.pkg.renovationsDesc': 'Сантехніка, підрядники, опалення',

    // Footer
    'footer.tagline': 'Лінкбілдинг для брендів та агенцій. Гостьові публікації, розміщення посилань та крауд-маркетинг з ручною перевіркою.',
    'footer.linkBuilding': 'Лінкбілдинг',
    'footer.company': 'Компанія',
    'footer.resources': 'Ресурси',
    'footer.legal': 'Юридичне',
    'footer.customPlan': 'Індивідуальний план',
    'footer.about': 'Про нас',
    'footer.reviews': 'Відгуки',
    'footer.howItWorks': 'Як ми працюємо',
    'footer.contact': 'Контакти',
    'footer.realPlacements': 'Приклади розміщень',
    'footer.terms': 'Умови використання',
    'footer.privacy': 'Політика конфіденційності',
    'footer.refund': 'Політика повернення',
    'footer.cookiePolicy': 'Політика cookie',
    'footer.rights': 'Усі права захищені.',
    'footer.cookiePrefs': 'Cookie',

    // Cookie banner
    'cookie.title': 'Cookie та конфіденційність',
    'cookie.body': 'Ми використовуємо технічні cookie для роботи сайту та аналітичні/маркетингові cookie для оцінки ефективності та покращення сервісів.',
    'cookie.acceptAll': 'Прийняти все',
    'cookie.rejectOptional': 'Відхилити необов\u2019язкові',
    'cookie.preferences': 'Налаштування',
    'cookie.policy': 'Політика cookie',
    'cookie.prefsTitle': 'Налаштування cookie',
    'cookie.prefsBody': 'Оберіть, які категорії cookie ви дозволяєте. Технічні cookie завжди увімкнені.',
    'cookie.essential': 'Технічні',
    'cookie.essentialDesc': 'Необхідні для роботи сайту',
    'cookie.alwaysOn': 'Завжди увімкнено',
    'cookie.analytics': 'Аналітика та маркетинг',
    'cookie.analyticsDesc': 'Google Analytics та Google Ads',
    'cookie.savePrefs': 'Зберегти налаштування',
    'cookie.cancel': 'Скасувати',
    'cookie.toggleAnalytics': 'Перемикнути аналітичні cookie',

    // Lead form
    'form.title': 'Отримати індивідуальну пропозицію',
    'form.subtitle': 'Вкажіть ваш домен та нішу — ми підготуємо пропозицію протягом 24 годин.',
    'form.email': 'Робочий email',
    'form.emailPlaceholder': 'you@company.com',
    'form.website': 'URL сайту',
    'form.websitePlaceholder': 'https://yoursite.com',
    'form.whatsapp': 'WhatsApp',
    'form.whatsappPlaceholder': '+1 234 567 8900',
    'form.telegram': 'Telegram',
    'form.telegramPlaceholder': '@username',
    'form.budget': 'Місячний бюджет',
    'form.budgetPlaceholder': 'Оберіть бюджет\u2026',
    'form.budget1': '$500\u20131,000',
    'form.budget2': '$1,000\u20133,000',
    'form.budget3': '$3,000+',
    'form.budget4': 'Поки не визначено',
    'form.submit': 'Отримати пропозицію',
    'form.sending': 'Надсилання...',
    'form.noSpam': 'Без спаму. Без кредитної картки.',
    'form.privacyPolicy': 'Політика конфіденційності',
    'form.errorEmail': 'Введіть реальну робочу адресу email.',
    'form.errorGeneric': 'Сталася помилка. Спробуйте ще раз.',
    'form.successTitle': 'Ви в списку!',
    'form.successBody': 'Ми зв\u2019яжемося з вами протягом 24 годин з індивідуальним планом.',
    'form.services.guestPosting': 'Гостьові публікації',
    'form.services.nicheEdits': 'Розміщення посилань',
    'form.services.crowdLinks': 'Крауд-маркетинг',
    'form.services.linkPackages': 'Пакети посилань',
    'form.services.seoAudit': 'SEO-аудит',
    'form.services.aiLlm': 'AI / LLM',
    'form.services.localSeo': 'Локальне SEO',

    // Error boundary
    'error.title': 'Сталася помилка',
    'error.body': 'Сталася неочікувана помилка. Спробуйте оновити сторінку.',
    'error.backHome': 'На головну',

    // Page loader
    'loader.loading': 'Завантаження',

    // Common
    'common.refresh': 'Оновити',
    'common.back': 'Назад',
    'common.save': 'Зберегти',
    'common.cancel': 'Скасувати',
    'common.delete': 'Видалити',
    'common.edit': 'Редагувати',
    'common.search': 'Пошук',
    'common.loading': 'Завантаження',
    'common.noResults': 'Результатів не знайдено.',
  },
};

// ─── URL helpers ────────────────────────────────────────────────

export function getLocaleFromPath(pathname: string): Locale {
  return pathname.startsWith('/uk/') || pathname === '/uk' ? 'uk' : 'en';
}

export function localizePath(path: string, locale: Locale): string {
  // If already has /uk/ prefix, strip it first
  let cleanPath = path;
  if (cleanPath.startsWith('/uk/')) cleanPath = cleanPath.slice(3);
  else if (cleanPath === '/uk') cleanPath = '/';

  if (locale === 'uk') {
    if (cleanPath === '/') return '/uk';
    return '/uk' + cleanPath;
  }
  return cleanPath;
}

export function getOtherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'uk' : 'en';
}
