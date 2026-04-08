'use client'
import { ProductModal } from '@/components/products/ProductCreateEditModal';
import { SectionFilters } from '@/components/SectionFilters';
import { SectionHeader } from '@/components/SectionHeader';
import { SectionPagination } from '@/components/SectionPagination';
import { RowItem, SectionTable } from '@/components/SectionTable';
import { CloseIcon, ExternalLinkIcon, GripIcon, TrashIcon } from '@/icons';
import { Category, Product, ProductImage } from '@/types';
import React, { useState, useEffect, DragEvent } from 'react';



// --- Mock Data ---
const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Electronics', colorClasses: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { id: 2, name: 'Home', colorClasses: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { id: 3, name: 'Clothing', colorClasses: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  { id: 4, name: 'Accessories', colorClasses: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'High quality noise-canceling headphones.',
    price: 199.99,
    sku: 'WH-001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stock: 45,
    categories: [MOCK_CATEGORIES[0], MOCK_CATEGORIES[3]],
    images: [{ id: 101, url: 'https://picsum.photos/seed/hp1/200' }, { id: 102, url: 'https://picsum.photos/seed/hp2/200' }],
    isDisabled: false,
  },
  {
    id: 2,
    name: 'Cotton T-Shirt',
    description: '100% organic cotton basic tee.',
    price: 19.99,
    sku: 'TS-BLK-M',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stock: 0,
    categories: [MOCK_CATEGORIES[2]],
    images: [{ id: 201, url: 'https://picsum.photos/seed/tee1/200' }],
    isDisabled: false,
  },
  {
    id: 3,
    name: 'Smart Coffee Maker',
    description: 'Brew coffee from your phone.',
    price: 129.5,
    sku: 'SCM-22',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stock: 12,
    categories: [MOCK_CATEGORIES[0], MOCK_CATEGORIES[1]],
    images: [{ id: 301, url: 'https://picsum.photos/seed/coffee/200' }],
    isDisabled: false,
  },
  {
    id: 4,
    name: 'Leather Wallet',
    description: 'Genuine leather slim wallet.',
    price: 45.0,
    sku: 'LW-099',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stock: 8,
    categories: [MOCK_CATEGORIES[3]],
    images: [],
    isDisabled: true,
  },
];

// --- Main Component ---
export default function ProductManagement() {
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
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      // In real life, fetch from API here
      setProducts(MOCK_PRODUCTS);
    } catch (err) {
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

  const handleDelete = (productId: string|number) => {
    console.log('DELETE Product ID:', productId);
    // Optimistic UI update for mockup
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleDisable = (productId: string|number) => {
    console.log('TOGGLE DISABLE Product ID:', productId);
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isDisabled: !p.isDisabled } : p))
    );
  };

  // --- Derived Data ---
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === '' ||
      p.categories.some((c) => c.id.toString() === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRowItems = () => {
    if(paginatedProducts.length === 0) return []
    const rows: RowItem[] = []
    for(let i = 0; i<paginatedProducts.length; i++) {
      rows.push(
        { 
          id: paginatedProducts[i].id, 
          isDisabled: paginatedProducts[i].isDisabled || false, 
          cells: [
            { type:"image", value: paginatedProducts[i].images[0]?.url },
            { type: "titleAndSubtitle", title: paginatedProducts[i].name, subtitle: paginatedProducts[i].sku  }, 
            { type: "string", value: `${Number(paginatedProducts[i].price).toFixed(2)}`  },
            { type: "string", value: paginatedProducts[i].stock === 0 ? <span className="text-red-600 dark:text-red-400 font-semibold text-xs bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md">Out of stock</span> : <span className="text-gray-700 dark:text-gray-300">{paginatedProducts[i].stock}</span> },
            { type: "coloredTag", tags: paginatedProducts[i].categories }
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
                { label: "Image", key: "key"},
                { label: "Product Details", key: "key"},
                { label: "Price", key: "key"}, 
                { label: "Stock", key: "key"},
                { label: "Categories", key: "key"},
              ]}

              rows={getRowItems()} 
         
              actions={[
                { label:"Edit", icon:"edit", handleClick: handleUpdateClick },
                { label:"Edit", icon:"disable", handleClick: handleDisable },
                { label:"Delete", icon:"delete", handleClick: handleDelete },
              ]}
            />

            <SectionPagination
              totalPages={totalPages}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              productsLength={filteredProducts.length}
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
          onSave={(data) => {
            console.log(editingProduct ? 'UPDATE Product Payload:' : 'CREATE Product Payload:', data);
            setIsModalOpen(false);
            // Simulated fake success
          }}
          error={modalError}
        />
      )}
    </div>
  );
}

