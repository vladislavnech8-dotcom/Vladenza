import LegalPageLayout, { LegalSection } from '../components/LegalPageLayout';

const toc = [
  { id: 'what-are-cookies', label: 'What Are Cookies' },
  { id: 'types-of-cookies', label: 'Types of Cookies We Use' },
  { id: 'essential', label: 'Essential Cookies' },
  { id: 'analytics', label: 'Analytics & Marketing Cookies' },
  { id: 'managing-preferences', label: 'Managing Your Preferences' },
  { id: 'third-party', label: 'Third-Party Cookies' },
  { id: 'changes', label: 'Changes to This Policy' },
  { id: 'contact', label: 'Contact' },
];

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      description="How Vladenza uses cookies and similar technologies on vladenza.com."
      canonical="https://vladenza.com/cookie-policy"
      lastUpdated="August 25, 2026"
      tableOfContents={toc}
    >
      <LegalSection id="what-are-cookies" title="What Are Cookies">
        <p>
          Cookies are small text files stored on your device when you visit a website. They allow the site to remember your actions and preferences over time. We use cookies to operate the website, understand how it is used, and measure the effectiveness of our marketing.
        </p>
      </LegalSection>

      <LegalSection id="types-of-cookies" title="Types of Cookies We Use">
        <p>We categorize cookies into two groups:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li><strong>Essential cookies</strong> &mdash; required for the website to function. These cannot be disabled.</li>
          <li><strong>Optional cookies</strong> &mdash; analytics and marketing cookies that help us improve. These are only loaded after you provide consent.</li>
        </ul>
      </LegalSection>

      <LegalSection id="essential" title="Essential Cookies">
        <p>
          Essential cookies are necessary for core website functionality. They enable features such as:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Maintaining your shopping cart and checkout state.</li>
          <li>Remembering your cookie consent decision.</li>
          <li>Securing the website against abuse.</li>
        </ul>
        <p>These cookies do not require consent and cannot be disabled.</p>
      </LegalSection>

      <LegalSection id="analytics" title="Analytics & Marketing Cookies">
        <p>
          We use the following optional tools, loaded only after you consent:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li><strong>Google Analytics</strong> &mdash; collects anonymized usage data (page views, session duration, traffic source).</li>
          <li><strong>Google Ads</strong> &mdash; conversion tracking to measure the effectiveness of our advertising.</li>
        </ul>
        <p>
          If you reject optional cookies, these scripts will not be loaded and no analytics or marketing data will be collected from your visit.
        </p>
      </LegalSection>

      <LegalSection id="managing-preferences" title="Managing Your Preferences">
        <p>
          When you first visit vladenza.com, you will see a cookie consent panel. You can choose to:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li><strong>Accept All</strong> &mdash; enables both essential and optional cookies.</li>
          <li><strong>Reject Optional</strong> &mdash; enables only essential cookies.</li>
          <li><strong>Preferences</strong> &mdash; review and customize which categories are enabled.</li>
        </ul>
        <p>
          Your decision is stored and the banner will not be shown again. You can reopen cookie preferences at any time by clicking &ldquo;Cookies&rdquo; in the footer.
        </p>
      </LegalSection>

      <LegalSection id="third-party" title="Third-Party Cookies">
        <p>
          Our analytics and marketing tools (Google Analytics, Google Ads) may set their own cookies on your device. These are governed by the respective providers&rsquo; privacy policies. We only load these tools after you have consented to optional cookies.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes to This Policy">
        <p>
          We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>
          Questions about cookies? Contact us at <a href="mailto:sales@vladenza.com" className="text-[#F97316] hover:underline">sales@vladenza.com</a>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
