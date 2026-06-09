import { Route, Routes, Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import ProductPage from '@/pages/ProductPage';
import VendorsPage from '@/pages/VendorsPage';
import CartPage from '@/pages/CartPage';
import VendorPortalPage from '@/pages/VendorPortalPage';
import AdminPage from '@/pages/AdminPage';
import PlanPage from '@/pages/PlanPage';
import AuthPage from '@/pages/AuthPage';
import { StoreProvider } from '@/lib/store';
import { AuthProvider, useAuth } from '@/lib/auth';

function ProtectedRoute({ children, require: req }: { children: React.ReactNode; require: 'vendor' | 'admin' }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center text-slate-500">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (req === 'admin' && user.role !== 'admin') return <Navigate to="/" replace />;
  if (req === 'vendor' && user.role !== 'vendor' && user.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/vendors" element={<VendorsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/vendor"
            element={
              <ProtectedRoute require="vendor">
                <VendorPortalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute require="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/plan" element={<PlanPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppRoutes />
      </StoreProvider>
    </AuthProvider>
  );
}
