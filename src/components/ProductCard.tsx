import { Link } from 'react-router-dom';
import { Star, Store } from 'lucide-react';
import type { Product, Vendor } from '@/types';
import { formatCurrency } from '@/lib/constants';

type Props = {
  product: Product;
  vendor?: Vendor;
};

export default function ProductCard({ product, vendor }: Props) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition"
    >
      <div className="aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>{product.brand}</span>
          <span className="inline-flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
            {product.rating.toFixed(1)}
          </span>
        </div>
        <h3 className="font-semibold text-slate-900 line-clamp-1">{product.title}</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {product.ram} · {product.storage}
        </p>
        {vendor && (
          <p className="text-xs text-slate-500 mt-1.5 inline-flex items-center gap-1">
            <Store className="w-3 h-3" /> {vendor.storeName}
          </p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-slate-900">{formatCurrency(product.price)}</span>
          <span className="text-xs text-emerald-600 font-medium">{product.stock} in stock</span>
        </div>
      </div>
    </Link>
  );
}
