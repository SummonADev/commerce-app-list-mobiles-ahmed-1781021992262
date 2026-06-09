import { CheckCircle2, Rocket, Layers, ShieldCheck, CreditCard, Megaphone } from 'lucide-react';

type Phase = {
  title: string;
  duration: string;
  icon: any;
  items: string[];
};

const phases: Phase[] = [
  {
    title: 'Phase 1 — Discovery & Architecture',
    duration: 'Week 1–2',
    icon: Layers,
    items: [
      'Define user roles: Buyer, Vendor, Platform Admin.',
      'Map out core flows: vendor onboarding, product catalog, cart, checkout, commission split, payouts.',
      'Pick stack: React + Vite (web), Node/Express or Next.js API (backend), PostgreSQL (data), Stripe Connect (payments).',
      'Design DB schema: users, vendors, stores, products, variants, orders, order_items, transactions, payouts.',
    ],
  },
  {
    title: 'Phase 2 — Core MVP',
    duration: 'Week 3–6',
    icon: Rocket,
    items: [
      'Build buyer storefront: product list, filters, search, product detail, cart.',
      'Build vendor portal: store creation, product CRUD, inventory, order management.',
      'Implement role-based authentication (Buyer / Vendor / Admin).',
      'Order placement and order status workflow (pending → paid → shipped → delivered).',
    ],
  },
  {
    title: 'Phase 3 — Payments & Commission',
    duration: 'Week 7–8',
    icon: CreditCard,
    items: [
      'Integrate Stripe Connect (Express accounts) so each vendor has a connected account.',
      'On checkout, charge the buyer and use `application_fee_amount` to take the fixed % commission automatically.',
      'Funds settle directly to vendor balance minus fee; platform earnings accrue in your Stripe account.',
      'Build payouts ledger: per-vendor earnings, fees collected, pending payouts.',
    ],
  },
  {
    title: 'Phase 4 — Admin & Trust',
    duration: 'Week 9–10',
    icon: ShieldCheck,
    items: [
      'Admin dashboard: KPIs, vendor approval workflow, refund/dispute handling.',
      'Reviews & ratings for products and vendors.',
      'KYC: vendor verification, store-level moderation, fraud signals.',
      'Notifications: email/SMS for orders and payouts.',
    ],
  },
  {
    title: 'Phase 5 — Launch & Growth',
    duration: 'Week 11+',
    icon: Megaphone,
    items: [
      'Beta launch with 5–10 vendors, gather feedback.',
      'SEO for product pages, structured data, sitemaps.',
      'Promotions, coupons, referral programs, vendor-funded discounts.',
      'Mobile app (React Native) reusing the API layer.',
    ],
  },
];

export default function PlanPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Execution plan</h1>
      <p className="mt-2 text-slate-600">
        A pragmatic roadmap to ship a multi-vendor mobile marketplace with a fixed commission per sale.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Highlight title="Marketplace model" body="Single storefront, many sellers. Buyers see all vendors' mobiles in one feed and can also browse by store." />
        <Highlight title="Commission" body="Configurable fixed % (e.g. 8%) deducted from each sale at checkout via Stripe Connect application fees." />
        <Highlight title="Vendor self-serve" body="Vendors register, get KYC-approved, and manage their products, stock, prices, and orders independently." />
      </div>

      <div className="mt-10 space-y-6">
        {phases.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.title} className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 grid place-items-center">
                  <Icon className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="font-bold text-slate-900">{p.title}</h2>
                  <p className="text-xs text-slate-500">{p.duration}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {p.items.map((it) => (
                  <li key={it} className="flex gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-10 bg-gradient-to-br from-slate-900 to-indigo-900 text-white rounded-2xl p-6">
        <h2 className="text-xl font-bold">Tech stack recommendation</h2>
        <ul className="mt-3 text-sm text-slate-200 space-y-1.5 list-disc list-inside">
          <li>Frontend: React + Vite + TypeScript + Tailwind (this prototype).</li>
          <li>Backend: Node.js + Express OR Next.js API routes; PostgreSQL via Prisma.</li>
          <li>Auth: NextAuth / Clerk with role-based access control.</li>
          <li>Payments: Stripe Connect (Express) — automatic fee split.</li>
          <li>Media: Cloudinary or S3 for product images.</li>
          <li>Deployment: Vercel/Render for app, managed Postgres (Neon/Supabase), CDN for assets.</li>
        </ul>
      </div>
    </div>
  );
}

function Highlight({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600 mt-1.5">{body}</p>
    </div>
  );
}
