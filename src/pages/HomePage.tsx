import { useMemo, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { useStore } from '@/lib/store';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const { products, vendors } = useStore();
  const [query, setQuery] = useState('');
  const [brand, setBrand] = useState('All');

  const brands = useMemo(() => ['All', ...Array.from(new Set(products.map((p) => p.brand)))], [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchQ = p.title.toLowerCase().includes(query.toLowerCase());
      const matchB = brand === 'All' || p.brand === brand;
      return matchQ && matchB;
    });
  }, [products, query, brand]);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" /> Multi-vendor mobile marketplace
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">
              Buy the latest mobiles from trusted vendors
            </h1>
            <p className="mt-4 text-indigo-100 text-lg">
              One marketplace, hundreds of stores. Compare prices, read reviews, and order from your favorite vendor.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e: any) => setQuery(e.target.value)}
                  placeholder="Search iPhone, Galaxy, Pixel..."
                  className="w-full pl-9 pr-3 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-xl font-bold text-slate-900">Featured mobiles</h2>
          <div className="flex items-center gap-2 flex-wrap">
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => setBrand(b)}
                className={
                  'px-3 py-1.5 rounded-full text-sm font-medium border transition ' +
                  (brand === b
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400')
                }
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} vendor={vendors.find((v) => v.id === p.vendorId)} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-slate-500">No mobiles match your search.</div>
        )}
      </section>
    </div>
  );
}
