export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm text-slate-500 flex flex-col sm:flex-row gap-2 justify-between">
        <p>© {new Date().getFullYear()} MobileHub — Multi-Vendor Mobile Marketplace.</p>
        <p>Demo prototype · data stored locally in your browser.</p>
      </div>
    </footer>
  );
}
