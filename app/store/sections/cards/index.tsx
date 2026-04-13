// --- HELPER: Mock Data for Preview ---
export const MOCK_PRODS = [
  { id: 1, name: 'Minimalist Watch', price: 149, img: 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 2, name: 'Leather Backpack', price: 89, img: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 3, name: 'Wireless Earbuds', price: 199, img: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 4, name: 'Ergonomic Chair', price: 350, img: 'https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg?auto=compress&cs=tinysrgb&w=300' },
];

// 2c. Card Styles (We pass data here rather than fully dynamic components)
export const CardRegistry: Record<string, React.FC<{product: typeof MOCK_PRODS[0]}>> = {
  card_basic: ({ product }) => (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
      <img src={product.img} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate group-hover:text-[var(--primary-color)]">{product.name}</h3>
        <div className="flex justify-between items-center mt-3">
          <span className="text-xl font-bold text-gray-900">${product.price}</span>
          <button className="p-2 bg-[var(--secondary-color)] text-[var(--primary-color)] rounded-full hover:bg-[var(--primary-color)] hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>
      </div>
    </div>
  ),
  card_minimal: ({ product }) => (
    <div className="text-center group">
      <div className="relative overflow-hidden rounded-xl aspect-square mb-3">
        <img src={product.img} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
           <button className="w-full py-2.5 bg-white text-gray-900 rounded-lg font-bold text-sm shadow-xl">View Product</button>
        </div>
      </div>
      <h3 className="text-sm text-gray-700 truncate">{product.name}</h3>
      <span className="font-bold text-gray-950">${product.price}</span>
    </div>
  )
};