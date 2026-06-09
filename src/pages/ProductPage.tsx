import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Store } from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatCurrency } from '@/lib/constants';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, vendors, addToCart } = useStore();
  const product = products.find((p) => p.id === id);
  const vendor = product ? vendors.find((v) => v.id === product.vendorId) : undefined;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-600">Product not found.</p>
        <Link to="/" className="text-indigo-600 font-medium">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-sm text-slate-500">{product.brand}</p>
          <h1 className="text-3xl font-bold text-slate-900 mt-1">{product.title}</h1>
          <div className="flex items-center gap-2 mt-2 text-amber-500">
            <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
            <span className="font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-slate-500 text-sm">· {product.stock} in stock</span>
          </div>

          <p className="mt-4 text-slate-600 leading-relaxed">{product.description}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 max-w-md">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
              <p className="text-xs text-slate-500">RAM</p>
              <p className="font-semibold text-slate-900">{product.ram}</p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
              <p className="text-xs text-slate-500">Storage</p>
              <p className="font-semibold text-slate-900">{product.storage}</p>
            </div>
          </div>

          {vendor && (
            <Link to="/vendors" className="mt-6 inline-flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900">
              <Store className="w-4 h-4" /> Sold by <span className="font-semibold">{vendor.storeName}</span>
            </Link>
          )}

          <div className="mt-8 flex items-center gap-4">
            <span className="text-3xl font-bold text-slate-900">{formatCurrency(product.price)}</span>
            <button
              onClick={() => addToCart(product.id)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              <ShoppingCart className="w-4 h-4" /> Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
