import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { formatCurrency, PLATFORM_FEE_PERCENT } from '@/lib/constants';

export default function CartPage() {
  const { cart, products, updateCartQty, removeFromCart, checkout } = useStore();
  const navigate = useNavigate();
  const [buyerName, setBuyerName] = useState('');

  const lines = cart.map((c) => {
    const p = products.find((x) => x.id === c.productId);
    return { cart: c, product: p };
  });

  const subtotal = lines.reduce((s, l) => s + (l.product ? l.product.price * l.cart.quantity : 0), 0);
  const fee = +(subtotal * (PLATFORM_FEE_PERCENT / 100)).toFixed(2);

  const handleCheckout = () => {
    const name = buyerName.trim() || 'Guest Buyer';
    const order = checkout(name);
    if (order) navigate('/');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Your cart is empty</h1>
        <p className="text-slate-600 mt-2">Browse mobiles and add a few to your cart.</p>
        <Link to="/" className="mt-6 inline-block px-5 py-3 rounded-xl bg-indigo-600 text-white font-medium">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-3">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Your cart</h1>
        {lines.map(({ cart: c, product: p }) =>
          p ? (
            <div key={c.productId} className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-2xl">
              <img src={p.image} alt={p.title} className="w-20 h-20 rounded-xl object-cover bg-slate-100" />
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{p.title}</p>
                <p className="text-xs text-slate-500">{p.brand} · {p.storage}</p>
                <p className="mt-1 font-medium text-slate-900">{formatCurrency(p.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateCartQty(c.productId, c.quantity - 1)} className="w-8 h-8 grid place-items-center rounded-lg border border-slate-200 hover:bg-slate-100">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center font-medium">{c.quantity}</span>
                <button onClick={() => updateCartQty(c.productId, c.quantity + 1)} className="w-8 h-8 grid place-items-center rounded-lg border border-slate-200 hover:bg-slate-100">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <button onClick={() => removeFromCart(c.productId)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : null
        )}
      </div>

      <aside className="bg-white border border-slate-200 rounded-2xl p-5 h-fit sticky top-20">
        <h2 className="font-bold text-slate-900">Order summary</h2>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-slate-600">Subtotal</span><span className="font-medium">{formatCurrency(subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-slate-600">Platform fee ({PLATFORM_FEE_PERCENT}%)</span><span className="font-medium">{formatCurrency(fee)}</span></div>
          <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between text-base">
            <span className="font-semibold">Total</span>
            <span className="font-bold">{formatCurrency(subtotal)}</span>
          </div>
          <p className="text-xs text-slate-500">The platform fee is included in the product price and routed to the app owner.</p>
        </div>
        <input
          value={buyerName}
          onChange={(e: any) => setBuyerName(e.target.value)}
          placeholder="Your name"
          className="mt-4 w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button onClick={handleCheckout} className="mt-3 w-full px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
          Place order
        </button>
      </aside>
    </div>
  );
}
