import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function VendorsPage() {
  const { vendors, products } = useStore();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Browse vendors</h1>
      <p className="text-slate-600 mt-1">Hundreds of verified mobile stores in one place.</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {vendors.map((v) => {
          const count = products.filter((p) => p.vendorId === v.id).length;
          return (
            <div key={v.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <img src={v.logo} alt={v.storeName} className="w-14 h-14 rounded-xl border border-slate-200" />
                <div>
                  <h3 className="font-semibold text-slate-900">{v.storeName}</h3>
                  <p className="text-xs text-slate-500">by {v.name}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  {v.rating.toFixed(1)}
                </span>
                <span className="text-slate-500">{count} products</span>
              </div>
              <Link
                to="/"
                className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                View store →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
