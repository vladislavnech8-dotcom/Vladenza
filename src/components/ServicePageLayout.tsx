import { ReactNode, useState } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import CTA from './CTA';
import OrderModal, { Package } from './OrderModal';
import LeadForm from './LeadForm';

interface Props {
  children: ReactNode;
  defaultService?: string;
}

export default function ServicePageLayout({ children, defaultService }: Props) {
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);

  function openModal() {
    setSelectedPkg({
      name: defaultService || 'Custom Package',
      price: 'Custom',
      links: 'Get a quote',
      service: defaultService || 'General Inquiry',
    });
  }

  return (
    <div className="bg-white min-h-screen">
      <Navigation />
      <div className="pt-[88px]">
        {children}
      </div>

      {/* Inline lead form — same style as homepage */}
      <section className="py-16 lg:py-20 border-t border-gray-100" style={{ background: 'linear-gradient(160deg, #ffffff 0%, #fff7f0 60%, #fef3e8 100%)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F97316]/20 bg-[#F97316]/8 text-[#F97316] text-xs font-semibold mb-5 tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
                Free Consultation
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-5">
                Ready to grow your<br />
                <span className="text-[#F97316]">organic traffic?</span>
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md">
                Drop your details and we'll build a custom strategy around your niche, goals, and budget — no commitment needed.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { title: 'Free SEO audit', desc: 'We review your site and spot quick wins' },
                  { title: 'Custom link plan', desc: 'Tailored to your niche and budget' },
                  { title: 'Reply within 24 h', desc: 'No waiting, no automated responses' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#F97316]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                      <div className="text-xs text-gray-400">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <LeadForm
                defaultService={defaultService}
                title="Get a Custom Link Building Quote"
                subtitle="Share your domain and niche — we'll prepare a tailored quote within 24 h."
              />
            </div>
          </div>
        </div>
      </section>

      <CTA onOpenModal={openModal} />
      <Footer />
      <OrderModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />
    </div>
  );
}
