'use client'
import { SectionFilters } from '@/components/SectionFilters';
import { SectionHeader } from '@/components/SectionHeader';
import React, { useState, useMemo } from 'react';

// --- Types ---
export type Category = {
  id: number;
  name: string;
  description: string | null;
  colorClasses: string; // The Tailwind classes for the "bubble"
  _count?: {
    products: number;
  };
};

// --- Mock Data ---
const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Electronics', description: 'Gadgets, hardware, and tech accessories.', colorClasses: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', _count: { products: 12 } },
  { id: 2, name: 'Home', description: 'Furniture and kitchen appliances.', colorClasses: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', _count: { products: 8 } },
  { id: 3, name: 'Clothing', description: 'Seasonal wear and organic fabrics.', colorClasses: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', _count: { products: 24 } },
  { id: 4, name: 'Accessories', description: 'Wallets, watches, and jewelry.', colorClasses: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', _count: { products: 5 } },
];

const COLOR_PRESETS = [
  { name: 'Blue', classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { name: 'Green', classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { name: 'Purple', classes: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  { name: 'Orange', classes: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  { name: 'Red', classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  { name: 'Pink', classes: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' },
];

// --- Icons ---
const PlusIcon = () => <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const SearchIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const EditIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const BoxIcon = () => <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

// --- Main Component ---
export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Filtered Logic
  const filteredCategories = useMemo(() => {
    return categories.filter(cat => 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [categories, searchQuery]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this category? Products will remain but will be uncategorized.')) {
      console.log('DELETE Category ID:', id);
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleSave = (data: Partial<Category>) => {
    if (editingCategory) {
      console.log('UPDATE Category Payload:', data);
    } else {
      console.log('CREATE Category Payload:', data);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-8 font-sans transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-6">

        <SectionHeader title='Categorias' description='Organiza tus categorias' buttonLabel='Crear Categoria' buttonAction={handleOpenCreate} />
        <SectionFilters 
          searchBars={[
            { title:"Buscar", placeholder:"nombre", value: searchQuery, handleChangeValue: (e) => setSearchQuery(e.target.value)  },
          ]}
          dropdownAllSelectedLabel='Todas'
          dropdowns={[]}
          datePickers={[]}
        />        

        {/* Categories Grid/Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                  <th className="p-5 font-semibold">Preview Tag</th>
                  <th className="p-5 font-semibold">Category Info</th>
                  <th className="p-5 font-semibold">Related Products</th>
                  <th className="p-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-gray-500 dark:text-gray-400">
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="p-5">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border ${cat.colorClasses}`}>
                          {cat.name}
                        </span>
                      </td>
                      <td className="p-5 max-w-xs">
                        <div className="font-bold text-gray-900 dark:text-white">{cat.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                          {cat.description || 'No description provided.'}
                        </div>
                      </td>
                      <td className="p-5">
                        <button 
                          onClick={() => console.log('NAVIGATE to products with filter:', cat.id)}
                          className="flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                        >
                          <BoxIcon />
                          See related products ({cat._count?.products || 0})
                        </button>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Edit Category"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Delete Category"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- Modal --- */}
      {isModalOpen && (
        <CategoryModal 
          category={editingCategory} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
}

// --- Category Modal Component ---
function CategoryModal({ 
  category, 
  onClose, 
  onSave 
}: { 
  category: Category | null; 
  onClose: () => void; 
  onSave: (data: Partial<Category>) => void 
}) {
  const isEditing = !!category;
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [selectedColors, setSelectedColors] = useState(category?.colorClasses || COLOR_PRESETS[0].classes);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, description, colorClasses: selectedColors });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {isEditing ? 'Edit Category' : 'Create Category'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tag Preview */}
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <span className="text-xs font-semibold text-gray-400 uppercase mb-3 tracking-widest">Tag Preview</span>
            <span className={`px-6 py-2 rounded-full text-lg font-bold shadow-sm border transition-all ${selectedColors}`}>
              {name || 'Category Name'}
            </span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Electronics, Home, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description (Optional)</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Choose Bubble Style</label>
            <div className="grid grid-cols-3 gap-3">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColors(color.classes)}
                  className={`py-2 rounded-lg border-2 transition-all text-xs font-bold ${
                    selectedColors === color.classes 
                      ? 'border-blue-500 scale-105 shadow-md' 
                      : 'border-transparent opacity-70 hover:opacity-100'
                  } ${color.classes}`}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
            >
              {isEditing ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}