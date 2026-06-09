import { useMemo, useState } from 'react';
import { Package, Plus, Trash2, Edit3, Store as StoreIcon, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatCurrency, PLATFORM_FEE_PERCENT } from '@/lib/constants';
import type { Product } from '@/types';

export default function VendorPortalPage() {
  const { vendors, products, addVendor, addProduct, updateProduct, deleteProduct, orders } = useStore();
  const [selectedVendor, setSelectedVendor] = useState<string>(vendors[0]?.id || '');
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  const vendor = vendors.find((v) => v.id === selectedVendor);
  const myProducts = useMemo(() => products.filter((p) => p.vendorId === selectedVendor), [products, selectedVendor]);

  const myEarnings = useMemo(() => {
    let gross = 0;
    let fee = 0;
    orders.forEach((o) => {
      o.items.forEach((i) => {
        if (i.vendorId === selectedVendor) {
          const sub = i.price * i.quantity;
          gross += sub;
          fee += sub * (PLATFORM_FEE_PERCENT / 100);
        }
      });
    });
    return { gross, fee, net: gross - fee };
  }, [orders, selectedVendor]);

  const handleNewVendor = (e: any) => {
    e.preventDefault();
    const f = e.target as HTMLFormElement;
    const data: any = Object.fromEntries(new FormData(f).entries());
    const created = addVendor({
      name: data.name,
      storeName: data.storeName,
      email: data.email,
      logo: `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(data.storeName)}`,
    });
    setSelectedVendor(created.id);
    setShowVendorForm(false);
    f.reset();
  };

  const handleSaveProduct = (e: any) => {
    e.preventDefault();
    const f = e.target as HTMLFormElement;
    const data: any = Object.fromEntries(new FormData(f).entries());
    const payload = {
      vendorId: selectedVendor,
      title: data.title,
      brand: data.brand,
      description: data.description,
      price: Number(data.price),
      stock: Number(data.stock),
      image: data.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      storage: data.storage,
      ram: data.ram,
    };
    if (editing) {
      updateProduct(editing.id, payload);
    } else {
      addProduct(payload);
    }
    setEditing(null);
    setShowProductForm(false);
    f.reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vendor portal</h1>
          <p className="text-slate-600 mt-1">Manage your store and product listings.</p>
        </div>
        <button onClick={() => setShowVendorForm(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800">
          <StoreIcon className="w-4 h-4" /> Create new store
        </button>
      </div>

      <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-5">
        <label className="text-sm font-medium text-slate-700">Acting as vendor</label>
        <select
          value={selectedVendor}
          onChange={(e: any) => setSelectedVendor(e.target.value)}
          className="mt-2 w-full max-w-md px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>{v.storeName} — {v.name}</option>
          ))}
        </select>
      </div>

      {vendor && (
        <>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard label="Listed products" value={String(myProducts.length)} />
            <StatCard label="Gross sales" value={formatCurrency(myEarnings.gross)} />
            <StatCard label={`Net (after ${PLATFORM_FEE_PERCENT}% fee)`} value={formatCurrency(myEarnings.net)} accent />
          </div>

          <div className="mt-8 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Products</h2>
            <button
              onClick={() => { setEditing(null); setShowProductForm(true); }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium"
            >
              <Plus className="w-4 h-4" /> Add product
            </button>
          </div>

          <div className="mt-4 bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Product</th>
                  <th className="text-left px-4 py-3 font-medium">Brand</th>
                  <th className="text-left px-4 py-3 font-medium">Price</th>
                  <th className="text-left px-4 py-3 font-medium">Stock</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myProducts.map((p) => (
                  <tr key={p.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                      <span className="font-medium text-slate-900">{p.title}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.brand}</td>
                    <td className="px-4 py-3 text-slate-900 font-medium">{formatCurrency(p.price)}</td>
                    <td className="px-4 py-3 text-slate-600">{p.stock}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => { setEditing(p); setShowProductForm(true); }} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteProduct(p.id)} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {myProducts.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-10 text-slate-500"><Package className="w-6 h-6 mx-auto mb-2" />No products yet — add your first one.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showVendorForm && (
        <Modal onClose={() => setShowVendorForm(false)} title="Create new store">
          <form onSubmit={handleNewVendor} className="space-y-3">
            <Field label="Owner name" name="name" required />
            <Field label="Store name" name="storeName" required />
            <Field label="Email" name="email" type="email" required />
            <button className="w-full px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium">Create store</button>
          </form>
        </Modal>
      )}

      {showProductForm && (
        <Modal onClose={() => { setShowProductForm(false); setEditing(null); }} title={editing ? 'Edit product' : 'Add product'}>
          <form onSubmit={handleSaveProduct} className="space-y-3">
            <Field label="Title" name="title" defaultValue={editing?.title} required />
            <Field label="Brand" name="brand" defaultValue={editing?.brand} required />
            <div className="grid grid-cols-2 gap-3">
              <Field label="RAM" name="ram" defaultValue={editing?.ram} required />
              <Field label="Storage" name="storage" defaultValue={editing?.storage} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price (USD)" name="price" type="number" step="0.01" defaultValue={editing ? String(editing.price) : ''} required />
              <Field label="Stock" name="stock" type="number" defaultValue={editing ? String(editing.stock) : ''} required />
            </div>
            <Field label="Image URL" name="image" defaultValue={editing?.image} />
            <div>
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea name="description" defaultValue={editing?.description} required rows={3} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <button className="w-full px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
              {editing ? 'Save changes' : 'Add product'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={'rounded-2xl border p-5 ' + (accent ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200')}>
      <p className={'text-xs ' + (accent ? 'text-indigo-100' : 'text-slate-500')}>{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function Field({ label, name, type = 'text', required, defaultValue, step }: any) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        defaultValue={defaultValue}
        className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  );
}

function Modal({ children, onClose, title }: { children: any; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 grid place-items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg p-6" onClick={(e: any) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
