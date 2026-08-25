import LegalPageLayout, { LegalSection } from '../components/LegalPageLayout';

const toc = [
  { id: 'information-we-collect', label: 'Information We Collect' },
  { id: 'how-we-use', label: 'How We Use Your Information' },
  { id: 'payment', label: 'Payment Information' },
  { id: 'cookies', label: 'Cookies & Analytics' },
  { id: 'service-providers', label: 'Service Providers' },
  { id: 'data-retention', label: 'Data Retention' },
  { id: 'data-security', label: 'Data Security' },
  { id: 'user-rights', label: 'Your Rights' },
  { id: 'international', label: 'International Users' },
  { id: 'contact', label: 'Contact' },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="How Vladenza collects, uses and protects your information when you use our link-building services."
      canonical="https://vladenza.com/privacy-policy"
      lastUpdated="August 25, 2026"
      tableOfContents={toc}
    >
      <LegalSection id="overview" title="Overview">
        <p>
          Vladenza (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates vladenza.com and provides digital link-building services including niche edits, guest posts, and crowd/community links. This Privacy Policy explains what information we collect, how we use it, and the choices you have.
        </p>
      </LegalSection>

      <LegalSection id="information-we-collect" title="Information We Collect">
        <p><strong>Information you provide directly:</strong></p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li><strong>Contact information</strong> &mdash; name, email address, company name, and website URL.</li>
          <li><strong>Order information</strong> &mdash; purchased services, quantities, package details, and order references.</li>
          <li><strong>Project URLs</strong> &mdash; target URLs you submit for link-building campaigns.</li>
          <li><strong>Campaign requirements</strong> &mdash; preferred anchor text, niche requirements, competitor references, and campaign notes.</li>
          <li><strong>Quote requests</strong> &mdash; information submitted through our contact or link-plan forms, including budget and project scope.</li>
        </ul>
        <p><strong>Information collected automatically:</strong></p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Device and browser information (browser type, screen resolution, operating system).</li>
          <li>Usage data (pages visited, time on site, referral source).</li>
          <li>IP address, used for security and basic analytics.</li>
        </ul>
      </LegalSection>

      <LegalSection id="how-we-use" title="How We Use Your Information">
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>To process and fulfill your orders, including sourcing placements and delivering reports.</li>
          <li>To communicate with you about your order, campaign progress, and service updates.</li>
          <li>To review your website and backlink profile when providing recommendations or custom link plans.</li>
          <li>To maintain order records and manage our CRM.</li>
          <li>To improve our website, services, and customer experience.</li>
          <li>To detect and prevent fraud, abuse, and security incidents.</li>
        </ul>
      </LegalSection>

      <LegalSection id="payment" title="Payment Information">
        <p>
          We do not directly store your full card numbers or sensitive payment details. Payment information is processed by our payment provider (WayForPay) when you complete a checkout. We receive a transaction reference and confirmation of payment status, but the card data itself is handled entirely by the payment processor.
        </p>
        <p>
          Order records in our system contain the payment amount, currency, order reference, and payment status (e.g., paid, pending, failed).
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="Cookies & Analytics">
        <p>
          We use cookies and similar technologies for the following purposes:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li><strong>Essential cookies</strong> &mdash; required for the website to function (e.g., maintaining your cart and checkout state).</li>
          <li><strong>Analytics cookies</strong> &mdash; used to understand how visitors interact with the website (e.g., Google Analytics). These are only loaded after you provide consent.</li>
          <li><strong>Marketing cookies</strong> &mdash; used to measure advertising effectiveness (e.g., Google Ads conversion tracking). These are only loaded after you provide consent.</li>
        </ul>
        <p>
          You can manage your cookie preferences at any time using the cookie consent panel. See our <a href="/cookie-policy" className="text-[#F97316] hover:underline">Cookie Policy</a> for more details.
        </p>
      </LegalSection>

      <LegalSection id="service-providers" title="Service Providers">
        <p>We work with third-party service providers to operate our business:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li><strong>Supabase</strong> &mdash; database hosting, authentication, and order management.</li>
          <li><strong>WayForPay</strong> &mdash; payment processing.</li>
          <li><strong>Google Analytics / Google Ads</strong> &mdash; website analytics and conversion tracking (loaded only with consent).</li>
          <li><strong>Telegram</strong> &mdash; internal team notifications for new paid orders.</li>
        </ul>
        <p>Each provider processes data under its own privacy policy and only to the extent necessary to provide the service we use them for.</p>
      </LegalSection>

      <LegalSection id="data-retention" title="Data Retention">
        <p>
          We retain order and campaign data for as long as necessary to provide our services and meet legal or accounting requirements. Order records, including submitted URLs and requirements, are typically retained for the duration of the service relationship plus a reasonable period for record-keeping.
        </p>
        <p>
          Quote requests and lead submissions that do not result in a paid order are retained for a shorter period and may be deleted upon request.
        </p>
      </LegalSection>

      <LegalSection id="data-security" title="Data Security">
        <p>
          We take reasonable technical and organizational measures to protect your data, including encrypted database storage, access controls, and secure payment processing. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection id="user-rights" title="Your Rights">
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Request access to the personal data we hold about you.</li>
          <li>Request correction or deletion of your personal data.</li>
          <li>Object to or restrict certain processing of your data.</li>
          <li>Withdraw consent for optional cookies and analytics at any time.</li>
          <li>Request a copy of your data in a portable format.</li>
        </ul>
        <p>To exercise any of these rights, contact us at sales@vladenza.com.</p>
      </LegalSection>

      <LegalSection id="international" title="International Users">
        <p>
          Vladenza serves clients globally. If you access our services from outside the country where our infrastructure is hosted, your data may be transferred to and processed in that country. By using our services, you consent to such transfers where applicable.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>
          If you have questions about this Privacy Policy or how we handle your data, contact us at <a href="mailto:sales@vladenza.com" className="text-[#F97316] hover:underline">sales@vladenza.com</a>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
