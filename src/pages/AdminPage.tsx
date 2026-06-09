import { useMemo } from 'react';
import { DollarSign, Package, Store as StoreIcon, ShoppingBag } from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatCurrency, PLATFORM_FEE_PERCENT } from '@/lib/constants';

export default function AdminPage() {
  const { vendors, products, orders } = useStore();

  const totals = useMemo(() => {
    const gross = orders.reduce((s, o) => s + o.total, 0);
    const fees = orders.reduce((s, o) => s + o.platformFee, 0);
    return { gross, fees };
  }, [orders]);

  const vendorPerformance = useMemo(() => {
    return vendors.map((v) => {
      let sales = 0;
      let units = 0;
      orders.forEach((o) => {
        o.items.forEach((i) => {
          if (i.vendorId === v.id) {
            sales += i.price * i.quantity;
            units += i.quantity;
          }
        });
      });
      const fee = sales * (PLATFORM_FEE_PERCENT / 100);
      return { vendor: v, sales, units, fee };
    });
  }, [vendors, orders]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Admin dashboard</h1>
      <p className="text-slate-600 mt-1">Platform-wide metrics and commission tracking.</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={<StoreIcon className="w-5 h-5" />} label="Vendors" value={String(vendors.length)} />
        <Stat icon={<Package className="w-5 h-5" />} label="Products" value={String(products.length)} />
        <Stat icon={<ShoppingBag className="w-5 h-5" />} label="Orders" value={String(orders.length)} />
        <Stat icon={<DollarSign className="w-5 h-5" />} label={`Platform commission (${PLATFORM_FEE_PERCENT}%)`} value={formatCurrency(totals.fees)} highlight />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Vendor performance</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Vendor</th>
                <th className="text-right px-4 py-2 font-medium">Units</th>
                <th className="text-right px-4 py-2 font-medium">Sales</th>
                <th className="text-right px-4 py-2 font-medium">Our fee</th>
              </tr>
            </thead>
            <tbody>
              {vendorPerformance.map(({ vendor, sales, units, fee }) => (
                <tr key={vendor.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{vendor.storeName}</p>
                    <p className="text-xs text-slate-500">{vendor.name}</p>
                  </td>
                  <td className="px-4 py-3 text-right">{units}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(sales)}</td>
                  <td className="px-4 py-3 text-right font-medium text-indigo-600">{formatCurrency(fee)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Recent orders</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {orders.length === 0 && <p className="px-5 py-10 text-center text-slate-500 text-sm">No orders yet.</p>}
            {orders.slice(0, 8).map((o) => (
              <div key={o.id} className="px-5 py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-slate-900">{o.buyerName}</p>
                  <p className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleString()} · {o.items.length} item(s)</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(o.total)}</p>
                  <p className="text-xs text-indigo-600">fee {formatCurrency(o.platformFee)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, highlight }: { icon: any; label: string; value: string; highlight?: boolean }) {
  return (
    <div className={'rounded-2xl border p-5 ' + (highlight ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white border-transparent' : 'bg-white border-slate-200')}>
      <div className={'inline-flex items-center justify-center w-9 h-9 rounded-xl ' + (highlight ? 'bg-white/20' : 'bg-indigo-50 text-indigo-600')}>{icon}</div>
      <p className={'mt-3 text-xs ' + (highlight ? 'text-indigo-100' : 'text-slate-500')}>{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
