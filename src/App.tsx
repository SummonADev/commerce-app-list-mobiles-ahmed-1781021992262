import { Route, Routes } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import ProductPage from '@/pages/ProductPage';
import VendorsPage from '@/pages/VendorsPage';
import CartPage from '@/pages/CartPage';
import VendorPortalPage from '@/pages/VendorPortalPage';
import AdminPage from '@/pages/AdminPage';
import PlanPage from '@/pages/PlanPage';
import { StoreProvider } from '@/lib/store';

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/vendor" element={<VendorPortalPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/plan" element={<PlanPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </StoreProvider>
  );
}
