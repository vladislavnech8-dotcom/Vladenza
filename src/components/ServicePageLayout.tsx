import { ReactNode, useState } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import OrderModal, { Package } from './OrderModal';
import { useLocale } from '../context/LocaleContext';

interface Props {
  children: ReactNode;
  defaultService?: string;
}

export default function ServicePageLayout({ children, defaultService }: Props) {
  const { locale } = useLocale();
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);

  const quoteLabel = locale === 'uk' ? 'Запит ціни' : 'Get a quote';

  function openModal() {
    setSelectedPkg({
      name: defaultService || 'Custom Package',
      price: 'Custom',
      links: quoteLabel,
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
