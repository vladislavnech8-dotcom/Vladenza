import LegalPageLayout, { LegalSection } from '../components/LegalPageLayout';

const toc = [
  { id: 'overview', label: 'Overview' },
  { id: 'before-work-starts', label: 'A. Before Work Has Started' },
  { id: 'research-started', label: 'B. Research/Outreach Has Started' },
  { id: 'website-approved', label: 'C. Website Has Been Approved' },
  { id: 'placement-ordered', label: 'D. Placement Ordered with Publisher' },
  { id: 'placement-published', label: 'E. Placement Already Published' },
  { id: 'publisher-costs', label: 'Third-Party Publisher Costs' },
  { id: 'replacements', label: 'Replacements vs Refunds' },
  { id: 'how-to-request', label: 'How to Request a Refund' },
  { id: 'contact', label: 'Contact' },
];

// TODO: Finalize exact refund percentages with business team before publishing.
// These values represent the current policy and may need adjustment.
const REFUND_PERCENTAGES = {
  beforeWorkStarted: 100,
  researchStarted: 70,
  websiteApproved: 40,
  placementOrdered: 0,
  placementPublished: 0,
};

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout
      title="Refund Policy"
      description="Refund policy for digital link-building services purchased from Vladenza."
      canonical="https://vladenza.com/refund-policy"
      lastUpdated="August 25, 2026"
      tableOfContents={toc}
    >
      <LegalSection id="overview" title="Overview">
        <p>
          Vladenza sells digital link-building services. Because our work involves research, outreach, and payments to third-party publishers, refund eligibility depends on how far the work has progressed at the time of your cancellation request.
        </p>
        <p>
          Only <strong>paid orders</strong> are eligible for refunds. Unpaid orders, abandoned checkouts, and quote requests are not charged and therefore not subject to refunds.
        </p>
      </LegalSection>

      <LegalSection id="before-work-starts" title="A. Order Submitted, Work Has Not Started">
        <p>
          If you request a cancellation before we have begun any research, outreach, or placement work, you are eligible for a <strong>{REFUND_PERCENTAGES.beforeWorkStarted}% refund</strong> of the order total.
        </p>
        <p>
          This typically applies to cancellations requested within 24 hours of payment, before our team has reviewed your requirements.
        </p>
      </LegalSection>

      <LegalSection id="research-started" title="B. Research or Outreach Has Started">
        <p>
          If we have begun researching placement opportunities or conducting outreach but no website has been confirmed or approved yet, you are eligible for a <strong>{REFUND_PERCENTAGES.researchStarted}% refund</strong> of the order total.
        </p>
        <p>
          This reflects the labor already invested in sourcing and evaluating potential placements.
        </p>
      </LegalSection>

      <LegalSection id="website-approved" title="C. Website Has Been Approved">
        <p>
          If a specific website has been confirmed or approved (by you or by us, depending on the approval flow), you are eligible for a <strong>{REFUND_PERCENTAGES.websiteApproved}% refund</strong> of the order total.
        </p>
        <p>
          At this stage, we have committed to a specific publisher and may have incurred non-recoverable costs.
        </p>
      </LegalSection>

      <LegalSection id="placement-ordered" title="D. Placement Ordered with Publisher">
        <p>
          Once a placement has been ordered and paid for with a third-party publisher, <strong>refunds are generally not available</strong> for that placement. Publisher payments become non-refundable after confirmation.
        </p>
        <p>
          See the &ldquo;Third-Party Publisher Costs&rdquo; section below for more details.
        </p>
      </LegalSection>

      <LegalSection id="placement-published" title="E. Placement Already Published">
        <p>
          Once a backlink or article has been published and delivered in your report, the service is considered complete. <strong>Refunds are not available</strong> for delivered placements.
        </p>
        <p>
          If a placement is removed by the publisher within the coverage period, you are entitled to a <strong>replacement</strong> rather than a refund. See the &ldquo;Replacements vs Refunds&rdquo; section below.
        </p>
      </LegalSection>

      <LegalSection id="publisher-costs" title="Third-Party Publisher Costs">
        <p>
          Many of our placements involve payments to third-party website owners or publishers. Once we have confirmed and paid for a placement with a publisher, that cost is typically non-refundable on the publisher&rsquo;s side.
        </p>
        <p>
          This is why refund percentages decrease as work progresses &mdash; we may have already committed funds to publishers that cannot be recovered.
        </p>
      </LegalSection>

      <LegalSection id="replacements" title="Replacements vs Refunds">
        <p>
          If a placement is removed by the third-party publisher within the coverage period, we will <strong>replace it</strong> with a comparable placement at no additional cost. This is the standard remedy for removed links and is separate from the refund process.
        </p>
        <p>
          Replacements are subject to the availability of comparable websites within the originally selected DR and traffic range. If a replacement cannot be provided after reasonable effort, a partial refund may be considered at our discretion.
        </p>
      </LegalSection>

      <LegalSection id="how-to-request" title="How to Request a Refund">
        <p>
          To request a cancellation or refund, email <a href="mailto:sales@vladenza.com" className="text-[#F97316] hover:underline">sales@vladenza.com</a> with your order number and the reason for your request. We will review the current status of your order and respond within 2 business days.
        </p>
        <p>
          Approved refunds will be processed back to the original payment method. Processing times depend on your payment provider and may take 5&ndash;10 business days.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="Contact">
        <p>
          Questions about refunds? Contact us at <a href="mailto:sales@vladenza.com" className="text-[#F97316] hover:underline">sales@vladenza.com</a>.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
