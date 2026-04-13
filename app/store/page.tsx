'use client'
import React, { useState, useMemo } from 'react';
import { HeroRegistry } from './sections/heroes';
import { NavRegistry } from './sections/nav';
import { CardRegistry, MOCK_PRODS } from './sections/cards';
import { FooterRegistry } from './sections/footer';
import { ListLayoutRegistry } from './sections/ListLayout';

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
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 flex justify-between items-center shadow-sm h-20">
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
        <div className='w-80'></div>
        <aside className="fixed top-20 left-0 bottom-0 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shrink-0 overflow-y-auto no-scrollbar">
          
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
                    {/* <div className='flex justify-between items-center'>
                        <h2 className='text-2xl font-bold tracking-tight'>Featured Products</h2>
                        <span className='text-sm font-medium text-[var(--accent-color)] cursor-pointer'>View All →</span>
                    </div> */}
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