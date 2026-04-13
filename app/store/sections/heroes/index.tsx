export const HeroRegistry: Record<string, React.FC> = {
  hero_v1: () => (
    <div className="bg-[var(--primary-color)] text-white p-12 md:p-20 text-center rounded-2xl">
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Summer Collection '24</h1>
      <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">Discover the hottest trends in minimal design and sustainable materials.</p>
      <button className="mt-8 px-6 py-3 bg-[var(--accent-color)] text-[var(--primary-color)] rounded-full font-bold text-sm shadow-lg hover:scale-105 transition-transform">Shop Now</button>
    </div>
  ),
  hero_v2: () => (
    <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-10 rounded-2xl border border-gray-100">
      <div>
        <span className="inline-block px-3 py-1 bg-[var(--secondary-color)] text-[var(--primary-color)] rounded-full text-xs font-bold mb-3">New Arrival</span>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">The Modern <span className="text-[var(--primary-color)]">Audio Experience</span></h1>
        <p className="mt-4 text-gray-600">Premium sound, uncompromised comfort. Available in 3 colors.</p>
        <button className="mt-6 px-8 py-3 bg-[var(--primary-color)] text-white rounded-lg font-semibold text-sm">Pre-Order</button>
      </div>
      <img src="https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=400" alt="hero" className="rounded-xl shadow-xl aspect-video object-cover" />
    </div>
  ),
};