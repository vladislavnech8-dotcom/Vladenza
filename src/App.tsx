import { lazy, Suspense, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import LogosBar from './components/LogosBar';
import Services from './components/Services';
import WhyUs from './components/WhyUs';
import CaseStudies from './components/CaseStudies';
import HowItWorks from './components/HowItWorks';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import OrderModal, { Package } from './components/OrderModal';
import ReviewsBar from './components/ReviewsBar';
import CartDrawer from './components/CartDrawer';
import { CartProvider } from './context/CartContext';
import { CheckoutProvider } from './context/CheckoutContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useSEO } from './hooks/useSEO';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const SeoAuditPage = lazy(() => import('./pages/SeoAuditPage'));
const GuestPostingPage = lazy(() => import('./pages/GuestPostingPage'));
const NicheEditsPage = lazy(() => import('./pages/NicheEditsPage'));
const CrowdLinksPage = lazy(() => import('./pages/CrowdLinksPage'));
const CrowdLinksLanguagePage = lazy(() => import('./pages/CrowdLinksLanguagePage'));
const AiLlmPage = lazy(() => import('./pages/AiLlmPage'));
const LinkPackagesPage = lazy(() => import('./pages/LinkPackagesPage'));
const LocalSeoLinksPage = lazy(() => import('./pages/LocalSeoLinksPage'));
const CaseStudiesPage = lazy(() => import('./pages/CaseStudiesPage'));
const CaseStudyDetailPage = lazy(() => import('./pages/CaseStudyDetailPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const LinkedInPersonalPage = lazy(() => import('./pages/LinkedInPersonalPage'));
const LinkedInCompanyPage = lazy(() => import('./pages/LinkedInCompanyPage'));
const SeoAuditSamplePage = lazy(() => import('./pages/SeoAuditSamplePage'));
const WhiteLabelPage = lazy(() => import('./pages/WhiteLabelPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const ClientAppPage = lazy(() => import('./pages/ClientAppPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <span className="w-6 h-6 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
  </div>
);

function AdminRoute() {
  const { session, loading } = useAuth();
  if (loading) return <PageLoader />;
  return session ? <AdminPage /> : <LoginPage />;
}

function HomePage() {
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);

  useSEO({
    title: 'Vladenza — SEO Link Building Agency & AI Visibility',
    description: 'Results-driven SEO agency for high-authority link building, guest posting, niche edits, and AI/LLM visibility. Grow organic traffic — no lock-ins.',
    canonical: 'https://vladenza.com/',
  });

  function openModal() {
    setSelectedPkg({ name: 'Custom Package', price: 'Custom', links: 'Get a quote', service: 'General Inquiry' });
  }

  return (
    <div className="bg-white min-h-screen">
      <Navigation onOpenModal={openModal} />
      <Hero onGetQuote={openModal} />
      <LogosBar />
      <Services onOrder={setSelectedPkg} />
      <WhyUs />
      <CaseStudies />
      <ReviewsBar />
      <HowItWorks />
      <FAQ />
      <Footer onOpenModal={openModal} />
      <OrderModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <CheckoutProvider>
        <CartDrawer />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AuthProvider><AdminRoute /></AuthProvider>} />
            <Route path="/app" element={<AuthProvider><ClientAppPage /></AuthProvider>} />
            <Route path="/services/seo-audit" element={<SeoAuditPage />} />
            <Route path="/services/guest-posting" element={<GuestPostingPage />} />
            <Route path="/services/niche-edits" element={<NicheEditsPage />} />
            <Route path="/services/crowd-links" element={<CrowdLinksPage />} />
            <Route path="/services/crowd-links/:language" element={<CrowdLinksLanguagePage />} />
            <Route path="/services/ai-llm" element={<AiLlmPage />} />
            <Route path="/services/link-packages/:niche" element={<LinkPackagesPage />} />
            <Route path="/services/local-seo-links" element={<LocalSeoLinksPage />} />
            <Route path="/case-studies" element={<CaseStudiesPage />} />
            <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/sitemap" element={<SitemapPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/services/linkedin-personal" element={<LinkedInPersonalPage />} />
            <Route path="/services/linkedin-company" element={<LinkedInCompanyPage />} />
            <Route path="/seo-audit-sample" element={<SeoAuditSamplePage />} />
            <Route path="/services/white-label" element={<WhiteLabelPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/checkout/requirements-form" element={<CheckoutPage />} />
          </Routes>
        </Suspense>
      </CheckoutProvider>
    </CartProvider>
  );
}
