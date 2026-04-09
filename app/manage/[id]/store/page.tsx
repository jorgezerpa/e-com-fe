'use client'
import React, { useState, useMemo } from 'react';

// ==========================================
// --- 1. Types & Configuration Schema ---
// ==========================================

// This defines exactly what the user is customizing
type StoreDesignConfig = {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  sections: {
    heroId: string;
    navId: string; // Categories + Search
    listId: string;
    cardStyleId: string;
    footerId: string;
  };
};

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

// Definition for an option in the sidebar
type DesignOption = {
  id: string;
  name: string;
  description: string;
  thumbnailJSX: React.ReactNode; // A tiny micro-preview for the sidebar button
};

// ==========================================
// --- 2. The Component Registries ---
// These define the actual UI variations
// ==========================================

// --- HELPER: Mock Data for Preview ---
const MOCK_CATS = ['All', 'Electronics', 'Home', 'Fashion', 'Wellness'];
const MOCK_PRODS = [
  { id: 1, name: 'Minimalist Watch', price: 149, img: 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 2, name: 'Leather Backpack', price: 89, img: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 3, name: 'Wireless Earbuds', price: 199, img: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=300' },
  { id: 4, name: 'Ergonomic Chair', price: 350, img: 'https://images.pexels.com/photos/373912/pexels-photo-373912.jpeg?auto=compress&cs=tinysrgb&w=300' },
];

// 2a. HERO Section Variations
const HeroRegistry: Record<string, React.FC> = {
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

// 2b. Navigation / Categories Selector variations
const NavRegistry: Record<string, React.FC> = {
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

// 2c. Card Styles (We pass data here rather than fully dynamic components)
const CardRegistry: Record<string, React.FC<{product: typeof MOCK_PRODS[0]}>> = {
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

// 2d. List Distribution (Grid settings)
const ListLayoutRegistry: Record<string, string> = {
  grid_4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
  grid_3_large: "grid grid-cols-1 md:grid-cols-3 gap-8",
};

// 2e. Footer Variations
const FooterRegistry: Record<string, React.FC> = {
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

// ==========================================
// --- 3. Sidebar Options Definitions ---
// Defining the data for the control panel
// ==========================================

const MicroPreview = ({children}: {children: React.ReactNode}) => (
  <div className="w-full h-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[8px] p-2 overflow-hidden text-gray-400 scale-90 origin-center">
    {children}
  </div>
);

const EDITOR_OPTIONS: Record<keyof StoreDesignConfig['sections'], DesignOption[]> = {
  heroId: [
    { id: 'hero_v1', name: 'Centered Banner', description: 'Solid background, centered text.', thumbnailJSX: <MicroPreview><div className='text-center space-y-1'><div className='font-bold'>TITLE</div><div className='w-10 h-1 bg-gray-300 mx-auto'></div></div></MicroPreview> },
    { id: 'hero_v2', name: 'Split Feature', description: 'Image right, text left.', thumbnailJSX: <MicroPreview><div className='flex gap-2 w-full'><div className='w-1/2 h-4 bg-gray-300'></div><div className='w-1/2 h-8 bg-gray-400 rounded'></div></div></MicroPreview> },
  ],
  navId: [
    { id: 'nav_pills', name: 'Pill Buttons', description: 'Rounded category buttons.', thumbnailJSX: <MicroPreview><div className='flex gap-1'><div className='w-4 h-2 bg-gray-400 rounded-full'></div><div className='w-4 h-2 bg-gray-200 rounded-full'></div><div className='w-4 h-2 bg-gray-200 rounded-full'></div></div></MicroPreview> },
    { id: 'nav_underline', name: 'Underline Tabs', description: 'Classic tab style.', thumbnailJSX: <MicroPreview><div className='flex gap-2 border-b-2 border-gray-200 w-full'><div className='w-6 h-3 border-b-2 border-gray-500'></div><div className='w-6 h-3'></div></div></MicroPreview> },
  ],
  listId: [
    { id: 'grid_4', name: 'Dense Grid (4)', description: '4 items per row on desktop.', thumbnailJSX: <MicroPreview><div className='grid grid-cols-4 gap-1 w-full'><div className='aspect-square bg-gray-300'></div><div className='aspect-square bg-gray-300'></div><div className='aspect-square bg-gray-300'></div><div className='aspect-square bg-gray-300'></div></div></MicroPreview> },
    { id: 'grid_3_large', name: 'Spacious Grid (3)', description: 'Larger images, 3 per row.', thumbnailJSX: <MicroPreview><div className='grid grid-cols-3 gap-1 w-full'><div className='aspect-square bg-gray-400'></div><div className='aspect-square bg-gray-400'></div><div className='aspect-square bg-gray-400'></div></div></MicroPreview> },
  ],
  cardStyleId: [
    { id: 'card_basic:hover', name: 'Standard Border', description: 'Image top, details below.', thumbnailJSX: <MicroPreview><div className='w-8 h-10 border border-gray-300 rounded bg-white p-1'><div className='w-full h-4 bg-gray-200 mb-1'></div><div className='w-4 h-1 bg-gray-400'></div></div></MicroPreview> },
    { id: 'card_minimal', name: 'Minimal Image-First', description: 'Hover effects on image.', thumbnailJSX: <MicroPreview><div className='w-8 h-10 text-center'><div className='w-full aspect-square bg-gray-300 rounded mb-1'></div><div className='w-4 h-1 bg-gray-400 mx-auto'></div></div></MicroPreview> },
  ],
  footerId: [
    { id: 'foot_simple', name: 'Simple Clean', description: 'Light background, centered.', thumbnailJSX: <MicroPreview><div className='text-center mt-4'><div className='w-12 h-1 bg-gray-200 mx-auto'></div><div className='w-6 h-1 bg-gray-100 mx-auto mt-1'></div></div></MicroPreview> },
    { id: 'foot_brand:dark', name: 'Brand Dark', description: 'Multi-column dark footer.', thumbnailJSX: <MicroPreview><div className='w-full h-full bg-gray-800 p-1 flex gap-1'><div className='w-4 h-4 bg-gray-600'></div><div className='w-2 h-6 bg-gray-700'></div><div className='w-2 h-6 bg-gray-700'></div></div></MicroPreview> },
  ],
};

// ==========================================
// --- 4. Main Editor Component ---
// ==========================================

export default function StorefrontEditor() {
  // Initial default config
  const [designConfig, setDesignConfig] = useState<StoreDesignConfig>({
    colors: { primary: '#111827', secondary: '#e5e7eb', accent: '#3b82f6' },
    sections: { heroId: 'hero_v1', navId: 'nav_pills', listId: 'grid_4', cardStyleId: 'card_basic', footerId: 'foot_simple' },
  });

  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [activeTab, setActiveTab] = useState<string>('colors'); // sidebar navigation

  // Dynamically calculate the CSS variable style object based on state colors
  const themeStyles = useMemo(() => ({
    '--primary-color': designConfig.colors.primary,
    '--secondary-color': designConfig.colors.secondary,
    '--accent-color': designConfig.colors.accent,
  } as React.CSSProperties), [designConfig.colors]);

  // Update a specific section ID
  const updateSection = (sectionKey: keyof StoreDesignConfig['sections'], id: string) => {
    setDesignConfig(prev => ({
      ...prev,
      sections: { ...prev.sections, [sectionKey]: id }
    }));
  };

  // Helper to get actual component functions based on registry
  const HeroComp = HeroRegistry[designConfig.sections.heroId] || (() => <div>Error Loading Hero</div>);
  const NavComp = NavRegistry[designConfig.sections.navId] || (() => null);
  const CardComp = CardRegistry[designConfig.sections.cardStyleId.split(':')[0]] || CardRegistry['card_basic']; // handle optional modifiers like :dark
  const gridClasses = ListLayoutRegistry[designConfig.sections.listId] || ListLayoutRegistry['grid_4'];
  const FootComp = FooterRegistry[designConfig.sections.footerId.split(':')[0]] || FooterRegistry['foot_simple'];

  // Sidebar sections labels
  const sidebarSections: {key: keyof StoreDesignConfig['sections'], label: string}[] = [
    {key: 'heroId', label: 'Hero Section'},
    {key: 'navId', label: 'Navigation & Search'},
    {key: 'listId', label: 'Product List Grid'},
    {key: 'cardStyleId', label: 'Product Card Style'},
    {key: 'footerId', label: 'Footer'},
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-sans transition-colors duration-200">
      {/* Editor Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center shadow-sm">
        <div className='flex items-center gap-3'>
            <div className='p-2 bg-gray-900 dark:bg-white text-white dark:text-gray-950 rounded-lg font-black text-xl'>Ø</div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Storefront Visual Editor</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Draft saved 2m ago</span>
          <button className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md shadow-blue-500/30">Save & Publish</button>
        </div>
      </header>

      {/* Main Content Area: Sidebar + Preview */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* --- LEFT SIDEBAR (Controls) --- */}
        <aside className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shrink-0 overflow-y-auto no-scrollbar">
          
          {/* Internal Sidebar Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
            {['colors', 'sections'].map(tab => (
                <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-3 text-sm font-semibold capitalize tracking-wider ${activeTab === tab ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                    {tab}
                </button>
            ))}
          </div>

          <div className="p-6 space-y-8">
            {activeTab === 'colors' && (
                <div className='space-y-6'>
                    <h2 className='text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest'>Brand Colors</h2>
                    {Object.keys(designConfig.colors).map(colorKey => (
                        <div key={colorKey} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                            <input 
                                type="color" 
                                value={designConfig.colors[colorKey as keyof StoreDesignConfig['colors']]} 
                                onChange={(e) => setDesignConfig(prev => ({...prev, colors: {...prev.colors, [colorKey]: e.target.value}}))}
                                className="w-12 h-12 rounded-lg border-4 border-white dark:border-gray-700 shadow-inner cursor-pointer" 
                            />
                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-white capitalize">{colorKey} Color</label>
                                <code className="text-xs text-gray-500 dark:text-gray-400">{designConfig.colors[colorKey as keyof StoreDesignConfig['colors']]}</code>
                            </div>
                        </div>
                    ))}
                    <div className='p-4 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded-xl border border-blue-100 dark:border-blue-900 text-sm leading-relaxed'>
                        Colors are applied dynamically in the preview using CSS variables. Change a color to see instant feedback.
                    </div>
                </div>
            )}

            {activeTab === 'sections' && sidebarSections.map(({key, label}) => (
                <div key={key} className="space-y-4">
                  <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{label}</h2>
                  <div className="space-y-3">
                    {EDITOR_OPTIONS[key].map(option => {
                      const isSelected = designConfig.sections[key] === option.id;
                      return (
                        <button
                          key={option.id}
                          onClick={() => updateSection(key, option.id)}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${
                            isSelected 
                              ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700 ring-2 ring-blue-500/20' 
                              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className='shrink-0'>{option.thumbnailJSX}</div>
                          <div>
                            <div className={`font-semibold text-sm ${isSelected ? 'text-blue-800 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>{option.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{option.description}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
            ))}
          </div>
        </aside>

        {/* --- RIGHT PREVIEW AREA --- */}
        <main className="flex-1 bg-gray-100 dark:bg-gray-950 p-6 sm:p-8 flex flex-col items-center overflow-y-auto">
          
          {/* Viewport Switcher Sticky */}
          <div className="sticky top-0 z-30 mb-8 bg-gray-900/90 dark:bg-gray-800/80 backdrop-blur-sm text-white p-2 rounded-full shadow-2xl flex gap-1 border border-gray-700">
            {(['desktop', 'tablet', 'mobile'] as ViewportMode[]).map(mode => (
              <button key={mode} onClick={() => setViewport(mode)} className={`px-4 py-2 rounded-full capitalize text-xs font-bold transition-colors flex items-center gap-2 ${viewport === mode ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}>
                {mode === 'mobile' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" /></svg>}
                {mode === 'tablet' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                {mode === 'desktop' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                {mode}
              </button>
            ))}
          </div>

          {/* Actual Dynamic Storefront Preview Container */}
          <div
            id="storefront-preview-canvas"
            style={themeStyles} // Dynamic colors applied here
            className={`bg-gray-50 text-gray-900 rounded-2xl shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 origin-top flex flex-col ${
              viewport === 'desktop' ? 'w-full max-w-7xl' : 
              viewport === 'tablet' ? 'w-[768px]' : 'w-[375px]'
            }`}
          >
            {/* Store Header Mock */}
            <header className="p-6 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
                <div className='font-black text-2xl text-[var(--primary-color)]'>LOGO</div>
                <div className='flex items-center gap-6 text-sm font-medium text-gray-700'>
                    <span>New</span><span>Brands</span><span>Sale</span>
                    <button className='p-2 relative'>
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        <span className='absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--accent-color)] text-[8px] font-bold text-white flex items-center justify-center'>3</span>
                    </button>
                </div>
            </header>
            
            {/* Dynamic Content Body */}
            <div className="flex-1 p-6 md:p-10 space-y-10 overflow-y-auto no-scrollbar">
                
                {/* 1. Dynamic Hero */}
                <HeroComp />

                {/* 2. Dynamic Categories/Search */}
                <NavComp />

                {/* 3. Dynamic Product Grid & Cards */}
                <div className="space-y-6">
                    <div className='flex justify-between items-center'>
                        <h2 className='text-2xl font-bold tracking-tight'>Featured Products</h2>
                        <span className='text-sm font-medium text-[var(--accent-color)] cursor-pointer'>View All →</span>
                    </div>
                    <div className={gridClasses}>
                        {MOCK_PRODS.map(product => (
                            <CardComp key={product.id} product={product} />
                        ))}
                    </div>
                </div>
                
                {/* Spacer for scroll */}
                <div className='h-12'></div>
            </div>

            {/* 4. Dynamic Footer */}
            <FootComp />
          </div>

          <div className='text-xs text-gray-400 mt-6 italic'>This is a live structural preview. Interactive elements (buttons, search) are not functional in editor mode.</div>
        </main>
      </div>
    </div>
  );
}