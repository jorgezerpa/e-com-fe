import { CreateProduct, UpdateProduct } from "@/apiHandlers/products";
import { CloseIcon, ExternalLinkIcon, GripIcon, TrashIcon } from "@/icons";
import { Product, ProductImage } from "@/types";
import { useParams } from "next/navigation";
import { DragEvent, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type UIAsset = {
  id: string | number;
  url: string;
  file?: File;
  isNew: boolean;
};

export function ProductModal({
  product,
  onClose,
  onCreate,
  onUpdate,
  error,
}: {
  product: Product | null;
  onClose: () => void;
  onCreate: (data: CreateProduct) => Promise<void>;
  onUpdate: (id: string | number, data: UpdateProduct) => Promise<void>;
  error: string | null;
}) {
  const params = useParams();
  const companyId = params.id;
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    sku: product?.sku || '',
    stock: product?.stock || 0,
  });

  const [images, setImages] = useState<UIAsset[]>(() => {
    return (product?.images || []).map((img) => ({
      id: img.id,
      url: img.url,
      isNew: false,
    }));
  });

  // Track images staged for deletion (already uploaded images)
  const [imagesToDelete, setImagesToDelete] = useState<UIAsset[]>([]);
  
  // Track which image is currently triggering the confirmation modal
  const [imageToDeleteConfirm, setImageToDeleteConfirm] = useState<UIAsset | null>(null);

  // Warning state for partial uploads
  const [uploadWarning, setUploadWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.isNew) URL.revokeObjectURL(img.url);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const selectedFiles = Array.from(e.target.files);
    const newAssets: UIAsset[] = selectedFiles.map((file) => ({
      id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: URL.createObjectURL(file),
      file,
      isNew: true,
    }));

    setImages((prev) => [...prev, ...newAssets]);
    e.target.value = '';
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
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

  // --- Modified Delete Flow ---
  const handleDeleteRequest = (img: UIAsset) => {
    if (img.isNew) {
      // Local preview: Delete immediately and clear memory
      setImages((prev) => prev.filter((i) => i.id !== img.id));
      URL.revokeObjectURL(img.url);
    } else {
      // Existing remote image: Trigger confirmation modal
      setImageToDeleteConfirm(img);
    }
  };

  const confirmDeleteImage = () => {
    if (!imageToDeleteConfirm) return;
    
    // Move from active images to staged for deletion
    setImages((prev) => prev.filter((i) => i.id !== imageToDeleteConfirm.id));
    setImagesToDelete((prev) => [...prev, imageToDeleteConfirm]);
    setImageToDeleteConfirm(null); // close confirmation
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadWarning(null);

    try {
      // 1. Delete confirmed files from Supabase Storage first
      if (imagesToDelete.length > 0) {
        const bucket = process.env.NEXT_PUBLIC_SUPABASE_PRODUCTS_BUCKET as string;
        
        // Extract the path from the public URL (e.g. "companyId/filename.jpg")
        const pathsToDelete = imagesToDelete.map(img => {
          const parts = img.url.split(`/${bucket}/`);
          return parts.length > 1 ? parts[1] : null;
        }).filter(Boolean) as string[];

        if (pathsToDelete.length > 0) {
          const { error: deleteError } = await supabase.storage
            .from(bucket)
            .remove(pathsToDelete);
            
          if (deleteError) console.error("Failed to delete from Supabase:", deleteError);
        }
      }

      // 2. Upload new files to Supabase Storage
      const newFiles = images.filter((img) => img.isNew && img.file);
      
      const uploadResults = await Promise.all(
        newFiles.map(async (img) => {
          if (!img.file) return null;

          const fileExt = img.file.name.split('.').pop();
          const fileName = `${Math.floor(Math.random()*10000000 + 1)}.${fileExt}`;
          const filePath = `${companyId}/${fileName}`;
          const bucket = process.env.NEXT_PUBLIC_SUPABASE_PRODUCTS_BUCKET as string;

          const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, img.file);

          if (uploadError) {
            console.error('Upload Error for', img.file.name, uploadError);
            return null; // Return null to signify failure for this specific image
          }

          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

          return {
            originalId: img.id,
            url: urlData.publicUrl,
          };
        })
      );

      // Check for partial upload failures
      const successfulUploads = uploadResults.filter(Boolean);
      if (newFiles.length > 0 && successfulUploads.length < newFiles.length) {
        setUploadWarning("Hey, not all images could be uploaded. Missing images were removed from the final save.");
      }

      // 3. Map final payload
      const finalImagePayload = images.map((img) => {
        if (img.isNew) {
          const uploaded = uploadResults.find((r) => r?.originalId === img.id);
          return { id: null, url: uploaded?.url || null };
        }
        return { id: img.id, url: img.url };
      });

      const finalImagePayloadCleared = finalImagePayload.filter(i => !!i.url);

      const finalPayload = {
        ...formData,
        companyId: Number(companyId),
        images: finalImagePayloadCleared,
        categoryIds: []
      };

      // 4. Trigger API actions
      if (isEditing) {
        await onUpdate(product.id, {
          ...finalPayload,
          images: finalPayload.images.map(i => ({ id: i.id as number | null, url: i.url || "" })),
          deletedImageIds: imagesToDelete.map(img => Number(img.id)) // Pass IDs to delete in DB
        });
      } else {
        await onCreate({
          ...finalPayload, 
          images: finalImagePayloadCleared.map(i => ({url: i.url || ""}))
        });
      }

    } catch (err) {
      console.error('Submit failed:', err);
      alert('Error saving product. Check console.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl overflow-hidden my-auto relative">
        
        {/* --- Deletion Confirmation Overlay --- */}
        {imageToDeleteConfirm && (
          <div className="absolute inset-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-2xl max-w-sm w-full text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Image?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Are you sure you want to remove this image? It will be permanently deleted from storage when you save the product.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setImageToDeleteConfirm(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteImage}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        )}

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

        {/* --- Upload Warning Banner --- */}
        {uploadWarning && (
          <div className="mx-5 mt-5 p-3 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-lg text-sm border border-yellow-200 dark:border-yellow-800">
            {uploadWarning}
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

          {/* Images Section */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Images (Drag to reorder)
              </label>
              <label className="cursor-pointer bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                <span>+ Add Images</span>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileSelect} 
                />
              </label>
            </div>

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
                    
                    <div className="flex-1 truncate text-xs text-gray-500 dark:text-gray-400 flex flex-col">
                      <span className="truncate">{img.file ? img.file.name : img.url}</span>
                      {img.isNew && <span className="text-[10px] text-green-600 dark:text-green-400 font-semibold uppercase mt-0.5">New Upload</span>}
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
                        onClick={() => handleDeleteRequest(img)}
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
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}