import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import CartDrawer from './components/CartDrawer';
import { CartProvider } from './context/CartContext';
import { CheckoutProvider } from './context/CheckoutContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';

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
