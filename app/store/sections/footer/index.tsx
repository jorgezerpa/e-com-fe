// 2e. Footer Variations
export const FooterRegistry: Record<string, React.FC> = {
  foot_simple: () => (
    <footer className="mt-16 py-10 px-6 border-t border-gray-100 bg-white rounded-t-2xl text-center text-sm text-gray-500">
      <p>&copy; 2024 My Awesone Store powered by OmniCart Labs.</p>
      <div className="mt-2 flex gap-4 justify-center"><span>Privacy</span><span>Terms</span><span>Contact</span></div>
    </footer>
  ),
  foot_brand: () => (
    <footer className="mt-16 py-12 px-8 bg-gray-950 text-gray-300 rounded-t-2xl grid md:grid-cols-3 gap-8 text-sm">
      <div className="space-y-3">
        <div className="font-bold text-xl text-white">LOGO</div>
        <p>Your premium source for curated goods.</p>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-bold text-white mb-1">Shop</span>
        <span>New Arrivals</span><span>Best Sellers</span><span>Sale</span>
      </div>
      <div className="space-y-2">
        <span className="font-bold text-white mb-1">Newsletter</span>
        <input type="email" placeholder="you@email.com" className="w-full p-2.5 rounded bg-gray-800 text-white border border-gray-700" />
      </div>
    </footer>
  )
};