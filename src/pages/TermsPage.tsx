import LegalPageLayout, { LegalSection } from '../components/LegalPageLayout';

const toc = [
  { id: 'service-description', label: 'Service Description' },
  { id: 'customer-responsibilities', label: 'Customer Responsibilities' },
  { id: 'order-acceptance', label: 'Order Acceptance & Payment' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'revisions', label: 'Revisions & Replacements' },
  { id: 'cancellations', label: 'Cancellations & Refunds' },
  { id: 'third-party', label: 'Third-Party Publishers' },
  { id: 'seo-disclaimer', label: 'SEO Performance Disclaimer' },
  { id: 'intellectual-property', label: 'Intellectual Property' },
  { id: 'prohibited-use', label: 'Prohibited Use' },
  { id: 'liability', label: 'Limitation of Liability' },
  { id: 'changes', label: 'Changes to These Terms' },
  { id: 'contact', label: 'Contact' },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      description="Terms and conditions for purchasing link-building services from Vladenza."
      canonical="https://vladenza.com/terms"
      lastUpdated="August 25, 2026"
      tableOfContents={toc}
    >
      <LegalSection id="overview" title="Overview">
        <p>
          These Terms &amp; Conditions govern your use of vladenza.com and the purchase of digital SEO and link-building services from Vladenza. By placing an order or using our website, you agree to these terms.
        </p>
      </LegalSection>

      <LegalSection id="service-description" title="Service Description">
        <p>Vladenza sells digital SEO and link-building services including:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li><strong>Niche edits</strong> &mdash; backlinks inserted into existing, relevant articles on third-party websites.</li>
          <li><strong>Guest posts</strong> &mdash; new articles written and published on third-party websites with your backlink included.</li>
          <li><strong>Crowd / community links</strong> &mdash; contextual mentions in forums, Q&amp;A sites, and online communities.</li>
          <li><strong>Custom link-building campaigns</strong> &mdash; combined packages tailored to your site, competitors, and budget.</li>
        </ul>
        <p>
          All placements are on third-party websites we do not own. We manually review each placement for relevance and quality before delivery.
        </p>
      </LegalSection>

      <LegalSection id="customer-responsibilities" title="Customer Responsibilities">
        <p>You are responsible for providing accurate and complete information when placing an order, including:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li><strong>Target URLs</strong> &mdash; the pages on your website that should receive backlinks.</li>
          <li><strong>Anchor text</strong> &mdash; preferred anchor text for each placement, or authorization for Vladenza to recommend anchors.</li>
          <li><strong>Content requirements</strong> &mdash; any niche, topic, or content restrictions for placements.</li>
          <li><strong>Website approval</strong> &mdash; where applicable, you may request to approve specific websites before placement. This must be indicated before outreach begins.</li>
        </ul>
        <p>
          If you choose to provide requirements after checkout, we will contact you by email. Delays in providing requirements may delay delivery.
        </p>
      </LegalSection>

      <LegalSection id="order-acceptance" title="Order Acceptance & Payment">
        <p>
          An order is created when you complete checkout and payment is successfully processed. Submitting requirements or adding items to your cart does not constitute a completed order. Only paid orders enter our fulfillment workflow.
        </p>
        <p>
          Prices are listed in USD unless otherwise stated. We verify all prices server-side before processing payment. Payment is processed by our payment provider (WayForPay).
        </p>
      </LegalSection>

      <LegalSection id="delivery" title="Delivery">
        <p>
          Delivery refers to the completion of the purchased link-building service and delivery of the final placement report. Typical delivery times vary by service:
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Niche edits: 3&ndash;7 days</li>
          <li>Guest posts: 10&ndash;21 days</li>
          <li>Crowd links: 5&ndash;10 days</li>
        </ul>
        <p>
          Delivery times are estimates and may vary based on niche, publisher response times, and whether website approval is required.
        </p>
      </LegalSection>

      <LegalSection id="revisions" title="Revisions & Replacements">
        <p>
          If a placement is removed by the third-party publisher within the coverage period, we will replace it with a comparable placement at no additional cost. Replacement is separate from refunds and is our standard remedy for removed links.
        </p>
        <p>
          Replacements are subject to availability of comparable websites within the originally selected DR and traffic range.
        </p>
      </LegalSection>

      <LegalSection id="cancellations" title="Cancellations & Refunds">
        <p>
          Cancellation and refund eligibility depend on the stage of work. See our <a href="/refund-policy" className="text-[#F97316] hover:underline">Refund Policy</a> for full details.
        </p>
        <p>
          Once a placement has been published and delivered, the service is considered complete and refunds are generally not available, except where a replacement cannot be provided.
        </p>
      </LegalSection>

      <LegalSection id="third-party" title="Third-Party Publishers & Website Availability">
        <p>
          All placements are on third-party websites we do not own or control. We carefully select and review each website, but we cannot guarantee that a third-party site will remain online, indexed, or unchanged indefinitely.
        </p>
        <p>
          Links may be removed, pages may be deindexed, or websites may change ownership. We provide replacement coverage for placements removed within the coverage period, but we are not liable for changes made by third-party publishers beyond our control.
        </p>
      </LegalSection>

      <LegalSection id="seo-disclaimer" title="SEO Performance Disclaimer">
        <p>
          <strong>Purchasing backlinks or link-building services does NOT guarantee:</strong>
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Specific Google rankings or position changes</li>
          <li>Increases in organic traffic</li>
          <li>Leads, sales, or revenue</li>
          <li>Specific SEO outcomes or timelines</li>
        </ul>
        <p>
          Search engine rankings depend on many factors outside our control, including algorithm updates, competitor activity, on-page SEO, content quality, and existing domain authority. We guarantee manual placement on real websites within the selected metrics, not search rankings.
        </p>
      </LegalSection>

      <LegalSection id="intellectual-property" title="Intellectual Property">
        <p>
          All content on vladenza.com, including text, graphics, logos, and design, is the property of Vladenza or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without permission.
        </p>
        <p>
          Guest post content created for your campaign is delivered to you as part of the service. You may use it as agreed, but the published article remains on the third-party publisher&rsquo;s website.
        </p>
      </LegalSection>

      <LegalSection id="prohibited-use" title="Prohibited Use">
        <p>You may not use our services for:</p>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          <li>Websites containing illegal content, malware, or phishing.</li>
          <li>Submitting URLs you do not own or control without authorization.</li>
          <li>Attempting to manipulate or reverse-engineer our pricing or placement process.</li>
          <li>Reselling our services without authorization (except under a white-label agreement).</li>
        </ul>
      </LegalSection>

      <LegalSection id="liability" title="Limitation of Liability">
        <p>
          To the maximum extent permitted by law, Vladenza shall not be liable for any indirect, incidental, consequential, or punitive damages arising from the use of our services. Our total liability for any claim shall not exceed the amount you paid for the specific order giving rise to the claim.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="Changes to These Terms">
        <p>
          We may update these Terms from time to time. Changes will be posted on this page with an updated &ldquo;Last updated&rdquo; date. Continued use of our services after changes constitutes acceptance of the updated terms.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>
          Questions about these Terms? Contact us at <a href="mailto:sales@vladenza.com" className="text-[#F97316] hover:underline">sales@vladenza.com</a>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
