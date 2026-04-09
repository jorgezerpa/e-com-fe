'use client'
import { CreateProduct, createProduct, deleteProduct, getProducts, UpdateProduct, updateProduct } from '@/apiHandlers/products';
import { ProductModal } from '@/components/products/ProductCreateEditModal';
import { SectionFilters } from '@/components/SectionFilters';
import { SectionHeader } from '@/components/SectionHeader';
import { SectionPagination } from '@/components/SectionPagination';
import { RowItem, SectionTable } from '@/components/SectionTable';
import { Category, Product } from '@/types';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

// --- Mock Data ---
const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Electronics', colorClasses: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { id: 2, name: 'Home', colorClasses: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { id: 3, name: 'Clothing', colorClasses: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  { id: 4, name: 'Accessories', colorClasses: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
];

// --- Main Component ---
export default function ProductManagement() {
  const params = useParams()
  const companyId = params.id
  // Global States
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Simulated Fetch
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const productsResult = await getProducts(companyId as unknown as number)  
      setProducts(productsResult);
    } catch (err) {
      setProducts([])
      setError('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- Handlers ---
  const handleUpdateClick = (productId: string|number) => {
    const product = products.find((p) => p.id == productId)
    if(!product) {
      return
    } 
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleDelete = async(productId: string|number) => {
    setLoading(true);
    setError(null);
    try {
      // @todo add a confirm modal first 
      await deleteProduct(productId as number)
      await fetchProducts()
    } catch (error) {
      setError('Failed to delete product. Please try again.');
    }
    finally {
      setLoading(false)
    }
  };

  const handleDisable = async(productId: string|number) => {
    setLoading(true);
    setError(null);
    
    try {
      const product = products.find(p => p.id == productId)
      if(!product) return
      await updateProduct(productId as number, { disabled: !product.disabled })
      await fetchProducts()
    } catch (error) {
        setError('Failed to disable product. Please try again.');
    }
    finally {
      setLoading(false)
    }
    
  };

  const handleUpdateProduct = async(productId: string|number, data: UpdateProduct) => {
    setLoading(true);
    setError(null);
    
    try {
      await updateProduct(productId as number, data)
      await fetchProducts()
    } catch (error) {
        setError('Failed to update product. Please try again.');
    }
    finally {
      setLoading(false)
    }    
  };

  const handleCreateProduct = async(data: CreateProduct) => {
    setLoading(true);
    setError(null);
    
    try {
      await createProduct(data)
      await fetchProducts()
    } catch (error) {
        setError('Failed to create product. Please try again.');
    }
    finally {
      setLoading(false)
    }    
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const getRowItems = () => {
    if(products.length === 0) return []
    const rows: RowItem[] = []
    for(let i = 0; i<products.length; i++) {
      rows.push(
        { 
          id: products[i].id, 
          disabled: products[i].disabled || false, 
          cells: [
            { type:"image", value: products[i].images ? products[i].images[0]?.url : "" },
            { type: "titleAndSubtitle", title: products[i].name, subtitle: products[i].sku || "" }, 
            { type: "string", value: `${Number(products[i].price).toFixed(2)}`  },
            { type: "string", value: products[i].stock === 0 ? <span className="text-red-600 dark:text-red-400 font-semibold text-xs bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md">Out of stock</span> : <span className="text-gray-700 dark:text-gray-300">{products[i].stock}</span> },
            { type: "coloredTag", tags: products[i].categories }
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
        <SectionHeader title='Productos' description='Organiza tus productos' buttonLabel='Crear Producto' buttonAction={handleCreateClick} />
        <SectionFilters 
          searchBars={[
            { title:"Buscar", placeholder:"nombre o SKU", value: searchQuery, handleChangeValue: (e) => { setSearchQuery(e.target.value); setCurrentPage(1); }  },
          ]}
          dropdownAllSelectedLabel='Todas'
          dropdowns={[
            { title: "Categorias", items: MOCK_CATEGORIES.map(cat => ({ value: cat.id, label: cat.name })), value: selectedCategory, handleChangeValue: (e) => { setSelectedCategory(e.target.value); setCurrentPage(1); } },
          ]}
          datePickers={[]}
        />


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
                { label: "Imagen", key: "key"},
                { label: "Detalles", key: "key"},
                { label: "Precio", key: "key"}, 
                { label: "Cantidad", key: "key"},
                { label: "Categorias", key: "key"},
              ]}

              rows={getRowItems()} 
         
              actions={[
                { label:"Edit", icon:"edit", handleClick: handleUpdateClick },
                { label:"Disable", icon:"disable", handleClick: handleDisable },
                { label:"Delete", icon:"delete", handleClick: handleDelete },
              ]}
            />

            <SectionPagination
              totalPages={totalPages}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              productsLength={products.length}
              handleSetPage={(page)=>setCurrentPage(page)}
            />
           
          </div>
        )}
      </div>

      {/* --- Modal Form --- */}
      {isModalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setIsModalOpen(false);
            setModalError(null);
          }}
          onCreate={handleCreateProduct}
          onUpdate={handleUpdateProduct}
          error={modalError}
        />
      )}
    </div>
  );
}

