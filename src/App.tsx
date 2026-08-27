import { lazy, Suspense, Component, ErrorInfo, ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import CartDrawer from './components/CartDrawer';
import CookieConsentBanner from './components/CookieConsentBanner';
import { CartProvider } from './context/CartContext';
import { CheckoutProvider } from './context/CheckoutContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CookieConsentProvider } from './context/CookieConsentContext';
import HomePage from './pages/HomePage';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('App error boundary:', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center max-w-md px-6">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-500 text-sm mb-6">An unexpected error occurred. Please try refreshing the page.</p>
            <a href="/" className="text-sm font-semibold text-[#F97316] hover:underline">Back to Home</a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
const OrderRequirementsPage = lazy(() => import('./pages/OrderRequirementsPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage'));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'));
const PlacementsPage = lazy(() => import('./pages/PlacementsPage'));

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
        <CookieConsentProvider>
          <CartDrawer />
          <CookieConsentBanner />
          <Suspense fallback={<PageLoader />}>
            <ErrorBoundary>
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
              <Route path="/order/:token" element={<OrderRequirementsPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/refund-policy" element={<RefundPolicyPage />} />
              <Route path="/cookie-policy" element={<CookiePolicyPage />} />
              <Route path="/placements" element={<PlacementsPage />} />
            </Routes>
            </ErrorBoundary>
          </Suspense>
        </CookieConsentProvider>
      </CheckoutProvider>
    </CartProvider>
  );
}
