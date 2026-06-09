import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import type { AuthRole } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer' as AuthRole,
  });

  if (user) {
    navigate(user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor' : '/');
    return null;
  }

  if (!supabase) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50 p-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center">
          <p className="text-slate-600 text-sm">
            Supabase is not configured. Add{' '}
            <code className="bg-slate-100 px-1 rounded">VITE_SUPABASE_URL</code> and{' '}
            <code className="bg-slate-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> to your{' '}
            <code className="bg-slate-100 px-1 rounded">.env</code> file.
          </p>
        </div>
      </div>
    );
  }

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    if (mode === 'signup') {
      const err = await signUp(form.email, form.password, form.name, form.role);
      if (err) {
        setError(err);
      } else {
        setSuccess('Account created! Please check your email to confirm, then sign in.');
        setMode('signin');
      }
    } else {
      const err = await signIn(form.email, form.password);
      if (err) {
        setError(err);
      } else {
        navigate('/');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 grid place-items-center text-white mb-3 shadow-lg">
            <Smartphone className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">MobileHub</h1>
          <p className="text-slate-500 text-sm mt-1">Multi-vendor mobile marketplace</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Tab switcher */}
          <div className="grid grid-cols-2 border-b border-slate-200">
            <button
              onClick={() => { setMode('signin'); setError(null); setSuccess(null); }}
              className={`py-3 text-sm font-medium transition ${
                mode === 'signin'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); setSuccess(null); }}
              className={`py-3 text-sm font-medium transition ${
                mode === 'signup'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handle} className="p-6 space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-sm font-medium text-slate-700">Full name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="mt-1 w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="text-sm font-medium text-slate-700">I am a…</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(['buyer', 'vendor', 'admin'] as AuthRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm({ ...form, role: r })}
                      className={`py-2 rounded-lg text-sm font-medium border transition capitalize ${
                        form.role === r
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                {form.role === 'vendor' && (
                  <p className="mt-2 text-xs text-slate-500">
                    As a vendor you can create a store and list products from the Vendor Portal.
                  </p>
                )}
                {form.role === 'admin' && (
                  <p className="mt-2 text-xs text-amber-600">
                    Admin role grants full platform access. Use only for platform owners.
                  </p>
                )}
              </div>
            )}

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-sm text-emerald-700">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium text-sm flex items-center justify-center gap-2 transition"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          By signing up you agree to our terms of service and privacy policy.
        </p>
      </div>
    </div>
  );
}
