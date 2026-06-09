import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Store, LayoutDashboard, Smartphone, ShieldCheck, LogOut, LogIn, User } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth';
import clsx from 'clsx';

export default function Header() {
  const { cart } = useStore();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    clsx(
      'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition',
      isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
    );

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16 gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-slate-900">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 grid place-items-center text-white">
            <Smartphone className="w-5 h-5" />
          </span>
          MobileHub
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          <NavLink to="/" className={linkClass} end>Shop</NavLink>
          <NavLink to="/vendors" className={linkClass}><Store className="w-4 h-4" /> Vendors</NavLink>
          {(user?.role === 'vendor' || user?.role === 'admin') && (
            <NavLink to="/vendor" className={linkClass}><LayoutDashboard className="w-4 h-4" /> Vendor Portal</NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={linkClass}><ShieldCheck className="w-4 h-4" /> Admin</NavLink>
          )}
          <NavLink to="/plan" className={linkClass}>Plan</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                <User className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-700 font-medium max-w-[120px] truncate">{user.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium capitalize ${
                  user.role === 'admin'
                    ? 'bg-amber-100 text-amber-700'
                    : user.role === 'vendor'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-slate-200 text-slate-600'
                }`}>{user.role}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              <LogIn className="w-4 h-4" />
              Sign in
            </Link>
          )}
          <Link
            to="/cart"
            className="relative inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
          >
            <ShoppingCart className="w-4 h-4" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 grid place-items-center rounded-full bg-amber-400 text-slate-900 text-xs font-bold">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
