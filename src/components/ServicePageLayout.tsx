import { ReactNode, useState } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import OrderModal, { Package } from './OrderModal';

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
      <Navigation onOpenModal={openModal} />
      <div className="pt-[88px]">
        {children}
      </div>

      <Footer onOpenModal={openModal} />
      <OrderModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />
    </div>
  );
}
