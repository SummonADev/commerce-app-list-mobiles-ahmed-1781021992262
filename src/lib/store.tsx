import { createContext, useCallback, useContext, useMemo } from 'react';
import type { CartItem, Order, Product, Vendor } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { seedProducts, seedVendors } from '@/lib/seed';
import { PLATFORM_FEE_PERCENT } from '@/lib/constants';

type StoreCtx = {
  vendors: Vendor[];
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  addVendor: (v: Omit<Vendor, 'id' | 'joinedAt' | 'rating'>) => Vendor;
  addProduct: (p: Omit<Product, 'id' | 'createdAt' | 'rating'>) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  checkout: (buyerName: string) => Order | null;
};

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [vendors, setVendors] = useLocalStorage<Vendor[]>('mh_vendors', seedVendors);
  const [products, setProducts] = useLocalStorage<Product[]>('mh_products', seedProducts);
  const [cart, setCart] = useLocalStorage<CartItem[]>('mh_cart', []);
  const [orders, setOrders] = useLocalStorage<Order[]>('mh_orders', []);

  const addVendor = useCallback(
    (v: Omit<Vendor, 'id' | 'joinedAt' | 'rating'>): Vendor => {
      const newV: Vendor = {
        ...v,
        id: 'v_' + Date.now().toString(36),
        joinedAt: new Date().toISOString().slice(0, 10),
        rating: 5,
      };
      setVendors([...vendors, newV]);
      return newV;
    },
    [vendors, setVendors]
  );

  const addProduct = useCallback(
    (p: Omit<Product, 'id' | 'createdAt' | 'rating'>) => {
      const newP: Product = {
        ...p,
        id: 'p_' + Date.now().toString(36),
        createdAt: new Date().toISOString().slice(0, 10),
        rating: 4.5,
      };
      setProducts([newP, ...products]);
    },
    [products, setProducts]
  );

  const updateProduct = useCallback(
    (id: string, patch: Partial<Product>) => {
      setProducts(products.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    },
    [products, setProducts]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      setProducts(products.filter((p) => p.id !== id));
    },
    [products, setProducts]
  );

  const addToCart = useCallback(
    (productId: string) => {
      const found = cart.find((c) => c.productId === productId);
      if (found) {
        setCart(cart.map((c) => (c.productId === productId ? { ...c, quantity: c.quantity + 1 } : c)));
      } else {
        setCart([...cart, { productId, quantity: 1 }]);
      }
    },
    [cart, setCart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart(cart.filter((c) => c.productId !== productId));
    },
    [cart, setCart]
  );

  const updateCartQty = useCallback(
    (productId: string, qty: number) => {
      if (qty <= 0) {
        setCart(cart.filter((c) => c.productId !== productId));
      } else {
        setCart(cart.map((c) => (c.productId === productId ? { ...c, quantity: qty } : c)));
      }
    },
    [cart, setCart]
  );

  const clearCart = useCallback(() => setCart([]), [setCart]);

  const checkout = useCallback(
    (buyerName: string): Order | null => {
      if (cart.length === 0) return null;
      const items = cart.map((c) => {
        const prod = products.find((p) => p.id === c.productId);
        return {
          productId: c.productId,
          quantity: c.quantity,
          price: prod ? prod.price : 0,
          vendorId: prod ? prod.vendorId : '',
        };
      });
      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const platformFee = +(subtotal * (PLATFORM_FEE_PERCENT / 100)).toFixed(2);
      const order: Order = {
        id: 'o_' + Date.now().toString(36),
        items,
        total: subtotal,
        platformFee,
        buyerName,
        createdAt: new Date().toISOString(),
        status: 'paid',
      };
      setOrders([order, ...orders]);
      setCart([]);
      return order;
    },
    [cart, products, orders, setOrders, setCart]
  );

  const value = useMemo<StoreCtx>(
    () => ({
      vendors,
      products,
      cart,
      orders,
      addVendor,
      addProduct,
      updateProduct,
      deleteProduct,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      checkout,
    }),
    [vendors, products, cart, orders, addVendor, addProduct, updateProduct, deleteProduct, addToCart, removeFromCart, updateCartQty, clearCart, checkout]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): StoreCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
