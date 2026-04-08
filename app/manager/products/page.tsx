'use client'
import React, { useState, useEffect, DragEvent } from 'react';

// --- Types ---
export type Category = {
  id: number;
  name: string;
  colorClasses: string; // e.g., "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
};

export type ProductImage = {
  id: number;
  url: string;
};

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  sku: string | null;
  createdAt: string;
  updatedAt: string;
  stock: number;
  categories: Category[];
  images: ProductImage[];
  isDisabled?: boolean;
};

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

// --- Inline SVG Icons ---
const SearchIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const PlusIcon = () => <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const EditIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const DisableIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>;
const ExternalLinkIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;
const GripIcon = () => <svg className="w-5 h-5 text-gray-400 cursor-move" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

// --- Main Component ---
export default function ProductManagement() {
  // Global States
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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
  const handleUpdateClick = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    console.log('DELETE Product ID:', id);
    // Optimistic UI update for mockup
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDisable = (id: number) => {
    console.log('TOGGLE DISABLE Product ID:', id);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isDisabled: !p.isDisabled } : p))
    );
  };

  // --- Derived Data ---
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'all' ||
      p.categories.some((c) => c.id.toString() === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-8 font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search name or SKU..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="w-full sm:w-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Categories</option>
              {MOCK_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCreateClick}
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
          >
            <PlusIcon />
            New Product
          </button>
        </div>

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
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                    <th className="p-4 font-medium">Image</th>
                    <th className="p-4 font-medium">Product Details</th>
                    <th className="p-4 font-medium">Price</th>
                    <th className="p-4 font-medium">Stock</th>
                    <th className="p-4 font-medium">Categories</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                        No products found. Adjust your filters or create a new one.
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => (
                      <tr
                        key={product.id}
                        className={`hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors ${
                          product.isDisabled ? 'opacity-60 grayscale' : ''
                        }`}
                      >
                        {/* Image */}
                        <td className="p-4 w-24">
                          {product.images.length > 0 ? (
                            <img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-12 h-12 rounded-md object-cover border border-gray-200 dark:border-gray-600"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 text-xs border border-gray-200 dark:border-gray-600">
                              No Img
                            </div>
                          )}
                        </td>
                        
                        {/* Details */}
                        <td className="p-4">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {product.name}
                            {product.isDisabled && (
                              <span className="ml-2 text-[10px] uppercase tracking-wide bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">Disabled</span>
                            )}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                            SKU: {product.sku || 'N/A'}
                          </div>
                        </td>

                        {/* Price */}
                        <td className="p-4 font-medium">
                          ${Number(product.price).toFixed(2)}
                        </td>

                        {/* Stock */}
                        <td className="p-4">
                          {product.stock === 0 ? (
                            <span className="text-red-600 dark:text-red-400 font-semibold text-xs bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md">
                              Out of stock
                            </span>
                          ) : (
                            <span className="text-gray-700 dark:text-gray-300">
                              {product.stock}
                            </span>
                          )}
                        </td>

                        {/* Categories (Bubbles) */}
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1.5">
                            {product.categories.length > 0 ? (
                              product.categories.map((cat) => (
                                <span
                                  key={cat.id}
                                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${cat.colorClasses}`}
                                >
                                  {cat.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-xs italic">-</span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleUpdateClick(product)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                              title="Edit"
                            >
                              <EditIcon />
                            </button>
                            <button
                              onClick={() => handleDisable(product.id)}
                              className="p-1.5 text-orange-600 hover:bg-orange-50 dark:text-orange-400 dark:hover:bg-orange-900/30 rounded-md transition-colors"
                              title={product.isDisabled ? "Enable" : "Disable"}
                            >
                              <DisableIcon />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-md transition-colors"
                              title="Delete"
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

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredProducts.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === i + 1
                              ? 'z-10 bg-blue-50 dark:bg-blue-900/40 border-blue-500 text-blue-600 dark:text-blue-400'
                              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
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

// --- Product Modal Component ---
function ProductModal({
  product,
  onClose,
  onSave,
  error,
}: {
  product: Product | null;
  onClose: () => void;
  onSave: (data: Partial<Product>) => void;
  error: string | null;
}) {
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    sku: product?.sku || '',
    stock: product?.stock || 0,
  });

  const [images, setImages] = useState<ProductImage[]>(product?.images || []);

  // Native HTML5 Drag and Drop Handlers for Images
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    // Required for Firefox
    e.dataTransfer.setData('text/html', e.currentTarget.parentNode as unknown as string);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const newImages = [...images];
    const draggedImg = newImages[draggedIdx];
    newImages.splice(draggedIdx, 1);
    newImages.splice(index, 0, draggedImg);
    
    setDraggedIdx(index);
    setImages(newImages);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggedIdx(null);
  };

  const handleDeleteImage = (id: number) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, images });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden my-auto">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {isEditing ? 'Edit Product' : 'Create New Product'}
          </h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white rounded-md transition-colors">
            <CloseIcon />
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-5 p-3 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-sm border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU</label>
              <input
                type="text"
                value={formData.sku || ''}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ($)</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Amount</label>
              <input
                required
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Images Section (Drag and Drop UI) */}
          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Images (Drag to reorder)
            </label>
            <div className="space-y-2 border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-900/50 min-h-[100px]">
              {images.length === 0 ? (
                <div className="text-center text-sm text-gray-400 py-4">No images added.</div>
              ) : (
                images.map((img, index) => (
                  <div
                    key={img.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={handleDrop}
                    onDragEnd={() => setDraggedIdx(null)}
                    className={`flex items-center gap-3 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm transition-opacity ${
                      draggedIdx === index ? 'opacity-40' : 'opacity-100'
                    }`}
                  >
                    <div className="cursor-move p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      <GripIcon />
                    </div>
                    <img src={img.url} alt="thumbnail" className="w-10 h-10 rounded object-cover border border-gray-200 dark:border-gray-700" />
                    <div className="flex-1 truncate text-xs text-gray-500 dark:text-gray-400">
                      {img.url}
                    </div>
                    <div className="flex items-center gap-1">
                      <a
                        href={img.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-md"
                        title="View Full Size"
                      >
                        <ExternalLinkIcon />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-md"
                        title="Delete Image"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
            >
              {isEditing ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}