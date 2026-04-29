'use client';
import React, { useState, useEffect } from 'react';
import { SectionHeader } from '@/components/SectionHeader';
import { 
  getShippingMethods, 
  createShippingMethod, 
  updateShippingMethod, 
  deleteShippingMethod 
} from '@/apiHandlers/shippingMethods';
import { useParams } from 'next/navigation';
import { COMMON_SHIPPING_METHODS } from '@/constants';
import { Toast } from '@/components/Toast';

// --- Types ---
export type ShippingMethod = {
  id?: number;
  name: string;
  description: string | null;
  provider: string;
  fields: Record<string, string>;
  companyId: number;
};

type DynamicField = { key: string; value: string };

// --- Icons ---
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const EditIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const PlusIcon = () => <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const BackIcon = () => <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;

export default function ShippingManagement() {
  const { id: companyId } = useParams();
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'select' | 'form'>('select');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', provider: '' });
  const [fields, setFields] = useState<DynamicField[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)
  // Delete Confirmation States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState<ShippingMethod | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMethods = async () => {
    setIsLoading(true);
    try {
      const data = await getShippingMethods(Number(companyId));
      setMethods(data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchMethods(); }, [companyId]);

  // --- Handlers ---
  const openModal = (method?: ShippingMethod) => {
    if (method) {
      setEditingId(method.id!);
      setFormData({ name: method.name, description: method.description || '', provider: method.provider });
      setFields(Object.entries(method.fields || {}).map(([k, v]) => ({ key: k, value: v })));
      setModalStep('form');
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', provider: '' });
      setFields([{ key: '', value: '' }]);
      setModalStep('select'); // Show common options for new methods
    }
    setIsModalOpen(true);
  };

  const handleSelectTemplate = (template: Partial<ShippingMethod>) => {
    setFormData({
      name: template.name || '',
      description: template.description || '',
      provider: template.provider || '',
    });
    setFields(Object.entries(template.fields || {}).map(([k, v]) => ({ key: k, value: v })));
    setModalStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedFields = fields.reduce((acc, f) => {
      if (f.key.trim()) acc[f.key.trim()] = f.value.trim();
      return acc;
    }, {} as Record<string, string>);

    try {
      const payload = { ...formData, fields: formattedFields, companyId: Number(companyId) };
      if (editingId) await updateShippingMethod(editingId, payload);
      else await createShippingMethod(payload);
      
      await fetchMethods();
      setIsModalOpen(false);
      setToast({ message:"Metodo " + (editingId ? "editado" : "creado") + " existosamente", type: "success" })
    } catch (err) {
      alert("Failed to save shipping method.");
    }
  };

  const handleDelete = (methodId: string | number) => {
    const method = methods.find((m) => m.id == methodId);
    if (!method) return;
    setMethodToDelete(method);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = async () => {
      if (!methodToDelete) return;
      setIsDeleting(true);
      try {
        await deleteShippingMethod(methodToDelete.id as number);
        await fetchMethods()
        setIsDeleteModalOpen(false);
        setMethodToDelete(null);
      } catch (err) {
        alert("Failed to delete shipping method.");
      }
    }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <SectionHeader 
          title="Métodos de Envío" 
          description="Gestiona transportistas y opciones de delivery" 
          buttonLabel="Crear Envío" 
          buttonAction={() => openModal()} 
        />

        {isLoading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {methods.map((m) => (
              <div key={m.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm relative group">
                
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button onClick={() => openModal(m)} className="text-gray-400 hover:text-blue-500 transition-colors">
                    <EditIcon />
                  </button>
                  <button onClick={() => handleDelete(m.id!)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <TrashIcon />
                  </button>
                </div>

                <h3 className="font-bold text-lg dark:text-white">{m.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{m.provider}</p>
                {m.description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{m.description}</p>}
                
                <div className="text-xs bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                  <span className="font-bold block text-gray-400 uppercase mb-1">Datos requeridos:</span>
                  {Object.entries(m.fields).map(([k, v]) => (
                    <div key={k} className="text-gray-700 dark:text-gray-300">
                      <span className="font-semibold">{k}:</span> {v}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {!methods.length && (
               <div className="col-span-full text-center text-gray-500 py-10 border-2 border-dashed rounded-xl dark:border-gray-700">
                 No shipping methods found. Create one to get started.
               </div>
            )}
          </div>
        )}
      </div>

      {/* --- Create / Edit Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-2xl shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                {modalStep === 'form' && !editingId && (
                  <button onClick={() => setModalStep('select')} className="mr-2 text-gray-500 hover:text-gray-800 dark:hover:text-white">
                    <BackIcon />
                  </button>
                )}
                <h2 className="text-xl font-bold dark:text-white">
                  {modalStep === 'select' ? 'Selecciona un Método de Envío' : (editingId ? 'Editar Envío' : 'Nuevo Método de Envío')}
                </h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white"><CloseIcon /></button>
            </div>
            
            {modalStep === 'select' ? (
              <div className="space-y-4">
                {/* Custom Option */}
                <button 
                  onClick={() => handleSelectTemplate({ name: "", description: "", provider: "", fields: {} })} 
                  className="w-full text-left p-4 border-2 border-dashed rounded-xl border-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:hover:bg-blue-900/20 transition-all group"
                >
                  <h3 className="font-bold text-base text-blue-600 dark:text-blue-400">Crear método personalizado</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Configura un transportista local o propio manualmente.</p>
                </button>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {COMMON_SHIPPING_METHODS.map((template, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleSelectTemplate(template)} 
                      className="text-left p-4 border rounded-lg border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all bg-white dark:bg-gray-700/50 dark:border-gray-600"
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white">{template.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{template.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej: MRW Nacional" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Proveedor</label>
                    <input required value={formData.provider} onChange={e => setFormData({...formData, provider: e.target.value})} placeholder="Ej: MRW, Zoom, Delivery" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción (Opcional)</label>
                    <input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Ej: Tiempo estimado 2-3 días" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:text-white" />
                  </div>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Datos requeridos para el envío</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Define la información que el cliente debe dejar (Cédula, Dirección, Agencia, etc.)</p>
                    </div>
                    <button type="button" onClick={() => setFields([...fields, { key: '', value: '' }])} className="text-xs text-blue-600 flex items-center hover:underline shrink-0"><PlusIcon /> Add Field</button>
                  </div>
                  <div className="space-y-2">
                    {fields.map((f, i) => (
                      <div key={i} className="flex gap-2">
                        <input placeholder="Campo (ej: Cédula)" value={f.key} onChange={e => setFields(prev => prev.map((item, idx) => idx === i ? {...item, key: e.target.value} : item))} className="w-1/3 p-2 text-sm border rounded bg-transparent dark:border-gray-600 dark:text-white" />
                        <input placeholder="Instrucción (opcional)" value={f.value} onChange={e => setFields(prev => prev.map((item, idx) => idx === i ? {...item, value: e.target.value} : item))} className="flex-1 p-2 text-sm border rounded bg-transparent dark:border-gray-600 dark:text-white" />
                        <button type="button" onClick={() => setFields(prev => prev.filter((_, idx) => idx !== i))} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><TrashIcon /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full p-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg font-bold">
                  {editingId ? 'Actualizar Método' : 'Guardar Método'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {toast && <Toast message={toast?.message} type={toast?.type} onClose={()=>setToast(null)} /> }

      {/* --- Delete Confirmation Modal --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Borrar Metodo</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete <strong>{methodToDelete?.name}</strong>? This will also remove all associated images. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)} 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}