import LegalPageLayout, { LegalSection } from '../components/LegalPageLayout';
import { useLocale } from '../context/LocaleContext';

const tr = (en: string, uk: string, isUk: boolean) => isUk ? uk : en;

export default function PrivacyPolicyPage() {
  const { locale, localizePath } = useLocale();
  const isUk = locale === 'uk';
  const toc = [
    { id: 'information-we-collect', label: tr('Information We Collect', 'Інформація, яку ми збираємо', isUk) },
    { id: 'how-we-use', label: tr('How We Use Your Information', 'Як ми використовуємо вашу інформацію', isUk) },
    { id: 'payment', label: tr('Payment Information', 'Платіжна інформація', isUk) },
    { id: 'cookies', label: tr('Cookies & Analytics', 'Файли cookie та аналітика', isUk) },
    { id: 'service-providers', label: tr('Service Providers', 'Постачальники послуг', isUk) },
    { id: 'data-retention', label: tr('Data Retention', 'Зберігання даних', isUk) },
    { id: 'data-security', label: tr('Data Security', 'Безпека даних', isUk) },
    { id: 'user-rights', label: tr('Your Rights', 'Ваші права', isUk) },
    { id: 'international', label: tr('International Users', 'Користувачі з інших країн', isUk) },
    { id: 'contact', label: tr('Contact', 'Контакти', isUk) },
  ];

  return (
    <LegalPageLayout
      title={tr('Privacy Policy', 'Політика конфіденційності', isUk)}
      description={tr('How Vladenza collects, uses and protects your information when you use our link-building services.', 'Як Vladenza збирає, використовує та захищає вашу інформацію під час користування нашими послугами з лінкбілдингу.', isUk)}
      canonical={`https://vladenza.com${isUk ? '/uk' : ''}/privacy-policy`}
      lastUpdated={tr('August 25, 2026', '25 серпня 2026 року', isUk)}
      tableOfContents={toc}
    >
      <LegalSection id="overview" title={tr('Overview', 'Огляд', isUk)}>
        <p>{tr('Vladenza (“we”, “us”) operates vladenza.com and provides digital link-building services including niche edits, guest posts, and crowd/community links. This Privacy Policy explains what information we collect, how we use it, and the choices you have.', 'Vladenza («ми», «нас») керує сайтом vladenza.com і надає цифрові послуги з лінкбілдингу, зокрема тематичні вставки посилань, гостьові публікації та посилання з форумів і спільнот. Ця Політика конфіденційності пояснює, яку інформацію ми збираємо, як її використовуємо та які можливості вибору ви маєте.', isUk)}</p>
      </LegalSection>

      <LegalSection id="information-we-collect" title={tr('Information We Collect', 'Інформація, яку ми збираємо', isUk)}>
        <p><strong>{tr('Information you provide directly:', 'Інформація, яку ви надаєте безпосередньо:', isUk)}</strong></p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li><strong>{tr('Contact information', 'Контактна інформація', isUk)}</strong> &mdash; {tr('name, email address, company name, and website URL.', 'ім’я, адреса електронної пошти, назва компанії та URL-адреса вебсайту.', isUk)}</li>
          <li><strong>{tr('Order information', 'Інформація про замовлення', isUk)}</strong> &mdash; {tr('purchased services, quantities, package details, and order references.', 'придбані послуги, кількість, деталі пакета та реквізити замовлення.', isUk)}</li>
          <li><strong>{tr('Project URLs', 'URL-адреси проєкту', isUk)}</strong> &mdash; {tr('target URLs you submit for link-building campaigns.', 'цільові URL-адреси, які ви надаєте для кампаній з лінкбілдингу.', isUk)}</li>
          <li><strong>{tr('Campaign requirements', 'Вимоги до кампанії', isUk)}</strong> &mdash; {tr('preferred anchor text, niche requirements, competitor references, and campaign notes.', 'бажаний анкорний текст, вимоги до тематики, дані про конкурентів і примітки до кампанії.', isUk)}</li>
          <li><strong>{tr('Quote requests', 'Запити на розрахунок вартості', isUk)}</strong> &mdash; {tr('information submitted through our contact or link-plan forms, including budget and project scope.', 'інформація, надана через контактні форми або форми плану посилань, зокрема бюджет і обсяг проєкту.', isUk)}</li>
        </ul>
        <p><strong>{tr('Information collected automatically:', 'Інформація, яку ми збираємо автоматично:', isUk)}</strong></p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>{tr('Device and browser information (browser type, screen resolution, operating system).', 'Інформація про пристрій і браузер (тип браузера, роздільна здатність екрана, операційна система).', isUk)}</li>
          <li>{tr('Usage data (pages visited, time on site, referral source).', 'Дані про використання (відвідані сторінки, час на сайті, джерело переходу).', isUk)}</li>
          <li>{tr('IP address, used for security and basic analytics.', 'IP-адреса, яку ми використовуємо для безпеки та базової аналітики.', isUk)}</li>
        </ul>
      </LegalSection>

      <LegalSection id="how-we-use" title={tr('How We Use Your Information', 'Як ми використовуємо вашу інформацію', isUk)}>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>{tr('To process and fulfill your orders, including sourcing placements and delivering reports.', 'Для обробки та виконання ваших замовлень, зокрема пошуку майданчиків і надання звітів.', isUk)}</li>
          <li>{tr('To communicate with you about your order, campaign progress, and service updates.', 'Для зв’язку з вами щодо замовлення, перебігу кампанії та оновлень послуг.', isUk)}</li>
          <li>{tr('To review your website and backlink profile when providing recommendations or custom link plans.', 'Для аналізу вашого вебсайту та профілю зворотних посилань під час підготовки рекомендацій або індивідуальних планів посилань.', isUk)}</li>
          <li>{tr('To maintain order records and manage our CRM.', 'Для ведення записів про замовлення та керування нашою CRM-системою.', isUk)}</li>
          <li>{tr('To improve our website, services, and customer experience.', 'Для вдосконалення нашого сайту, послуг і клієнтського досвіду.', isUk)}</li>
          <li>{tr('To detect and prevent fraud, abuse, and security incidents.', 'Для виявлення та запобігання шахрайству, зловживанням і інцидентам безпеки.', isUk)}</li>
        </ul>
      </LegalSection>

      <LegalSection id="payment" title={tr('Payment Information', 'Платіжна інформація', isUk)}>
        <p>{tr('We do not directly store your full card numbers or sensitive payment details. Payment information is processed by our payment provider (WayForPay) when you complete a checkout. We receive a transaction reference and confirmation of payment status, but the card data itself is handled entirely by the payment processor.', 'Ми не зберігаємо безпосередньо повні номери ваших карток або конфіденційні платіжні дані. Платіжна інформація обробляється нашим платіжним провайдером (WayForPay) під час оформлення замовлення. Ми отримуємо ідентифікатор транзакції та підтвердження статусу платежу, але самі дані картки повністю обробляє платіжний оператор.', isUk)}</p>
        <p>{tr('Order records in our system contain the payment amount, currency, order reference, and payment status (e.g., paid, pending, failed).', 'Записи про замовлення в нашій системі містять суму платежу, валюту, реквізити замовлення та статус платежу (наприклад, сплачено, очікується, неуспішний).', isUk)}</p>
      </LegalSection>

      <LegalSection id="cookies" title={tr('Cookies & Analytics', 'Файли cookie та аналітика', isUk)}>
        <p>{tr('We use cookies and similar technologies for the following purposes:', 'Ми використовуємо файли cookie та подібні технології з такими цілями:', isUk)}</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li><strong>{tr('Essential cookies', 'Необхідні cookie', isUk)}</strong> &mdash; {tr('required for the website to function (e.g., maintaining your cart and checkout state).', 'потрібні для роботи сайту (наприклад, для збереження стану кошика та оформлення замовлення).', isUk)}</li>
          <li><strong>{tr('Analytics cookies', 'Аналітичні cookie', isUk)}</strong> &mdash; {tr('used to understand how visitors interact with the website (e.g., Google Analytics). These are only loaded after you provide consent.', 'використовуються, щоб зрозуміти, як відвідувачі взаємодіють із сайтом (наприклад, Google Analytics). Вони завантажуються лише після вашої згоди.', isUk)}</li>
          <li><strong>{tr('Marketing cookies', 'Маркетингові cookie', isUk)}</strong> &mdash; {tr('used to measure advertising effectiveness (e.g., Google Ads conversion tracking). These are only loaded after you provide consent.', 'використовуються для вимірювання ефективності реклами (наприклад, відстеження конверсій Google Ads). Вони завантажуються лише після вашої згоди.', isUk)}</li>
        </ul>
        <p>{tr('You can manage your cookie preferences at any time using the cookie consent panel. See our', 'Ви можете будь-коли керувати налаштуваннями cookie за допомогою панелі згоди. Докладніше дивіться в нашій', isUk)} <a href={localizePath('/cookie-policy')} className="text-[#F97316] hover:underline">{tr('Cookie Policy', 'Політиці використання файлів cookie', isUk)}</a>.</p>
      </LegalSection>

      <LegalSection id="service-providers" title={tr('Service Providers', 'Постачальники послуг', isUk)}>
        <p>{tr('We work with third-party service providers to operate our business:', 'Для роботи нашого бізнесу ми співпрацюємо зі сторонніми постачальниками послуг:', isUk)}</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li><strong>Supabase</strong> &mdash; {tr('database hosting, authentication, and order management.', 'хостинг бази даних, автентифікація та керування замовленнями.', isUk)}</li>
          <li><strong>WayForPay</strong> &mdash; {tr('payment processing.', 'обробка платежів.', isUk)}</li>
          <li><strong>Google Analytics / Google Ads</strong> &mdash; {tr('website analytics and conversion tracking (loaded only with consent).', 'аналітика сайту та відстеження конверсій (завантажуються лише за згодою).', isUk)}</li>
          <li><strong>Telegram</strong> &mdash; {tr('internal team notifications for new paid orders.', 'внутрішні сповіщення команди про нові оплачені замовлення.', isUk)}</li>
        </ul>
        <p>{tr('Each provider processes data under its own privacy policy and only to the extent necessary to provide the service we use them for.', 'Кожен постачальник обробляє дані відповідно до власної політики конфіденційності й лише в обсязі, необхідному для надання послуги, для якої ми його залучаємо.', isUk)}</p>
      </LegalSection>

      <LegalSection id="data-retention" title={tr('Data Retention', 'Зберігання даних', isUk)}>
        <p>{tr('We retain order and campaign data for as long as necessary to provide our services and meet legal or accounting requirements. Order records, including submitted URLs and requirements, are typically retained for the duration of the service relationship plus a reasonable period for record-keeping.', 'Ми зберігаємо дані про замовлення та кампанії стільки, скільки необхідно для надання послуг і виконання юридичних або бухгалтерських вимог. Записи про замовлення, зокрема надані URL-адреси та вимоги, зазвичай зберігаються протягом дії відносин щодо послуг і додатковий розумний строк для ведення обліку.', isUk)}</p>
        <p>{tr('Quote requests and lead submissions that do not result in a paid order are retained for a shorter period and may be deleted upon request.', 'Запити на розрахунок вартості та заявки, які не призвели до оплаченого замовлення, зберігаються коротший строк і можуть бути видалені на ваш запит.', isUk)}</p>
      </LegalSection>

      <LegalSection id="data-security" title={tr('Data Security', 'Безпека даних', isUk)}>
        <p>{tr('We take reasonable technical and organizational measures to protect your data, including encrypted database storage, access controls, and secure payment processing. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.', 'Ми вживаємо обґрунтованих технічних та організаційних заходів для захисту ваших даних, зокрема шифруємо зберігання в базі даних, застосовуємо контроль доступу та безпечну обробку платежів. Водночас жоден спосіб передавання чи зберігання не є повністю безпечним, тому ми не можемо гарантувати абсолютну безпеку.', isUk)}</p>
      </LegalSection>

      <LegalSection id="user-rights" title={tr('Your Rights', 'Ваші права', isUk)}>
        <p>{tr('Depending on your jurisdiction, you may have the right to:', 'Залежно від вашої юрисдикції ви можете мати право:', isUk)}</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>{tr('Request access to the personal data we hold about you.', 'запитувати доступ до ваших персональних даних, якими ми володіємо.', isUk)}</li>
          <li>{tr('Request correction or deletion of your personal data.', 'запитувати виправлення або видалення ваших персональних даних.', isUk)}</li>
          <li>{tr('Object to or restrict certain processing of your data.', 'заперечувати проти певної обробки ваших даних або вимагати її обмеження.', isUk)}</li>
          <li>{tr('Withdraw consent for optional cookies and analytics at any time.', 'будь-коли відкликати згоду на необов’язкові cookie та аналітику.', isUk)}</li>
          <li>{tr('Request a copy of your data in a portable format.', 'запитувати копію ваших даних у машиночитному форматі.', isUk)}</li>
        </ul>
        <p>{tr('To exercise any of these rights, contact us at', 'Щоб скористатися будь-яким із цих прав, напишіть нам на адресу', isUk)} <a href="mailto:sales@vladenza.com" className="text-[#F97316] hover:underline">sales@vladenza.com</a>.</p>
      </LegalSection>

      <LegalSection id="international" title={tr('International Users', 'Користувачі з інших країн', isUk)}>
        <p>{tr('Vladenza serves clients globally. If you access our services from outside the country where our infrastructure is hosted, your data may be transferred to and processed in that country. By using our services, you consent to such transfers where applicable.', 'Vladenza обслуговує клієнтів у всьому світі. Якщо ви користуєтеся нашими послугами за межами країни, де розміщена наша інфраструктура, ваші дані можуть бути передані до цієї країни та оброблятися там. Користуючись нашими послугами, ви погоджуєтеся на такі передачі, якщо це застосовно.', isUk)}</p>
      </LegalSection>

      <LegalSection id="contact" title={tr('Contact', 'Контакти', isUk)}>
        <p>{tr('If you have questions about this Privacy Policy or how we handle your data, contact us at', 'Якщо у вас є запитання щодо цієї Політики конфіденційності або обробки ваших даних, напишіть нам на адресу', isUk)} <a href="mailto:sales@vladenza.com" className="text-[#F97316] hover:underline">sales@vladenza.com</a>.</p>
      </LegalSection>
    </LegalPageLayout>
  );
}
