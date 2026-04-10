'use client'
import { createCategory, CreateCategory, deleteCategory, getCategories, updateCategory, UpdateCategory } from '@/apiHandlers/categories';
import { CreateProduct, createProduct, deleteProduct, getProducts, UpdateProduct, updateProduct } from '@/apiHandlers/products';
import { ProductModal } from '@/components/products/ProductCreateEditModal';
import { SectionFilters } from '@/components/SectionFilters';
import { SectionHeader } from '@/components/SectionHeader';
import { SectionPagination } from '@/components/SectionPagination';
import { RowItem, SectionTable } from '@/components/SectionTable';
import { useDebounce } from '@/hooks/useDebounce';
import { CloseIcon } from '@/icons';
import { Category, Color } from '@/types';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { COLOR_PRESETS } from '@/constants';

// --- Main Component ---
export default function CategoriesManagement() {
  const params = useParams()
  const companyId = params.id
  // Global States
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true); 
    setError(null);
    try {
      const categoriesResult = await getCategories(companyId as unknown as number)  
      setCategories(categoriesResult);
    } catch (err) {
      setCategories([])
      setError('Failed to fetch categories. Please refetch the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchCategories();
  }, [])

  // --- Handlers ---
  const handleUpdateClick = (categoryId: string|number) => {
    const category = categories.find((c) => c.id == categoryId)
    if(!category) {
      return
    } 
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleDelete = async(categoryId: string|number) => {
    setLoading(true);
    setError(null);
    try {
      // @todo add a confirm modal first 
      await deleteCategory(categoryId as number)
      await fetchCategories()
    } catch (error) {
      setError('Failed to delete product. Please try again.');
    }
    finally {
      setLoading(false)
    }
  };

  const handleUpdateCategory = async(categoryId: string|number, data: UpdateCategory) => {
    setLoading(true);
    setError(null);
    
    try {
      await updateCategory(categoryId as number, data)
      await fetchCategories()
    } catch (error) {
        setError('Failed to update category. Please try again.');
    }
    finally {
      setLoading(false)
    }    
  };

  const handleCreateCategory = async(data: CreateCategory) => {
    setLoading(true);
    setError(null);

    try {
      await createCategory(data)
      await fetchCategories()
    } catch (error) {
        setError('Failed to create category. Please try again.');
    }
    finally {
      setLoading(false)
    }    
  };

  const getRowItems = () => {
    if(categories.length === 0) return []
    const rows: RowItem[] = []
    for(let i = 0; i<categories.length; i++) {
      rows.push(
        { 
          id: categories[i].id, 
          disabled: false, 
          cells: [
            { type: "coloredTag", tags: [categories[i]] }, 
            { type: "titleAndSubtitle", title: categories[i].name, subtitle: categories[i].description || "" }, 
            { type: "string", value: `related products` },
          ] 
        }
      )
    }
    return rows
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-8 font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Controls */}
        <SectionHeader title='Categorias' description='Organiza tus categorias' buttonLabel='Crear Categoria' buttonAction={handleCreateClick} />

        {/* State Handling (Loading / Error) */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-center border border-red-200 dark:border-red-800">
            {error}
          </div>
        ) : (
          /* Table Area */
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <SectionTable 
              columns={[
                { label: "Preview Tag", key: "key"},
                { label: "Category Info", key: "key"},
                { label: "Related Products", key: "key"}, 
              ]}

              rows={getRowItems()} 
         
              actions={[
                { label:"Edit", icon:"edit", handleClick: handleUpdateClick },
                { label:"Delete", icon:"delete", handleClick: handleDelete },
              ]}
            />
           
          </div>
        )}
      </div>

      {/* --- Modal --- */}
      {isModalOpen && (
        <CategoryModal 
          category={editingCategory} 
          onClose={() => {
            setIsModalOpen(false);
            setModalError(null);
          }}
          onCreate={handleCreateCategory}
          onUpdate={handleUpdateCategory}
          error={modalError}
        />
      )}
    </div>




  );
}


// --- Category Modal Component ---
function CategoryModal({
  category,
  onClose,
  onCreate,
  onUpdate,
  error,
}: {
  category: Category | null;
  onClose: () => void;
  onCreate: (data: CreateCategory) => void;
  onUpdate: (id:string|number, data: UpdateCategory) => void;
  error: string | null;
}
) {

  const params = useParams();
  const companyId = params.id;

  const isEditing = !!category;
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [selectedColors, setSelectedColors] = useState<"BLUE" | "GREEN" | "PURPLE" | "ORANGE" | "RED" | "PINK">(category?.color||"BLUE");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(isEditing) onUpdate(category.id, { name, description, color: selectedColors as string })
    if(!isEditing) onCreate({ name, description, color: selectedColors as string, companyId: companyId as unknown as number, })
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
            <span className={`px-6 py-2 rounded-full text-lg font-bold shadow-sm border transition-all ${COLOR_PRESETS[selectedColors]}`}>
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
              {(Object.keys(COLOR_PRESETS) as Color[]).map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColors(color)}
                  className={`py-2 rounded-lg border-2 transition-all text-xs font-bold ${
                    selectedColors === color 
                      ? 'border-blue-500 scale-105 shadow-md' 
                      : 'border-transparent opacity-70 hover:opacity-100'
                  } ${COLOR_PRESETS[color]}`}
                >
                  {color}
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

