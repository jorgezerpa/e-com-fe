const MOCK_CATS = ['All', 'Electronics', 'Home', 'Fashion', 'Wellness'];

// 2b. Navigation / Categories Selector variations
export const NavRegistry: Record<string, React.FC> = {
  nav_pills: () => (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
        {MOCK_CATS.map((c, i) => (
          <button key={c} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${i === 0 ? 'bg-[var(--primary-color)] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="relative w-full md:w-64">
        <input type="search" placeholder="Search products..." className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[var(--primary-color)] outline-none" />
        <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>
    </div>
  ),
  nav_underline: () => (
    <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
       <div className="flex gap-6 border-b border-gray-200 mb-4 overflow-x-auto no-scrollbar">
        {MOCK_CATS.map((c, i) => (
          <button key={c} className={`pb-3 text-sm font-medium whitespace-nowrap ${i === 0 ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]' : 'text-gray-600 hover:text-gray-900'}`}>
            {c}
          </button>
        ))}
      </div>
      <input type="search" placeholder="Search product name or SKU..." className="w-full p-3 border border-gray-200 rounded-lg text-sm bg-gray-50" />
    </div>
  )
};