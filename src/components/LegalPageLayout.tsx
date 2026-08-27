import { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { useSEO } from '../hooks/useSEO';

interface LegalPageLayoutProps {
  title: string;
  description: string;
  canonical: string;
  lastUpdated: string;
  tableOfContents?: { id: string; label: string }[];
  children: ReactNode;
}

export default function LegalPageLayout({
  title,
  description,
  canonical,
  lastUpdated,
  tableOfContents,
  children,
}: LegalPageLayoutProps) {
  useSEO({ title: `${title} | Vladenza`, description, canonical });

  return (
    <div className="bg-white min-h-screen">
      <Navigation />
      <div className="pt-[88px]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-400 text-xs mb-8">Last updated: {lastUpdated}</p>

          {tableOfContents && tableOfContents.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Contents</p>
              <ul className="flex flex-col gap-1.5">
                {tableOfContents.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="text-sm text-gray-600 hover:text-[#F97316] transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-6">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

interface SectionProps {
  id?: string;
  title: string;
  children: ReactNode;
}

export function LegalSection({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
      <div className="flex flex-col gap-3 text-sm text-gray-600 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

interface SubSectionProps {
  title: string;
  children: ReactNode;
}

export function LegalSubSection({ title, children }: SubSectionProps) {
  return (
    <div>
      <h3 className="text-sm font-bold text-gray-900 mb-2">{title}</h3>
      <div className="flex flex-col gap-2 text-sm text-gray-600 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
