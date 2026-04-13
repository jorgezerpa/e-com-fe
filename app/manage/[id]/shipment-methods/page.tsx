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

// --- Types ---
export type ShippingMethod = {
  id: number;
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

export default function ShippingManagement() {
  const { id: companyId } = useParams();
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', provider: '' });
  const [fields, setFields] = useState<DynamicField[]>([]);

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

  const openModal = (method?: ShippingMethod) => {
    if (method) {
      setEditingId(method.id);
      setFormData({ name: method.name, description: method.description || '', provider: method.provider });
      setFields(Object.entries(method.fields || {}).map(([k, v]) => ({ key: k, value: v })));
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', provider: '' });
      setFields([{ key: '', value: '' }]);
    }
    setIsModalOpen(true);
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
      
      setIsModalOpen(false);
      fetchMethods();
    } catch (err) {
      alert("Failed to save shipping method.");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this shipping method?')) {
      await deleteShippingMethod(id);
      fetchMethods();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <SectionHeader title="Metodos de Envío" description="Gestiona transportistas y delivery" buttonLabel="Crear Envío" buttonAction={() => openModal()} />

        {isLoading ? <p>Loading...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {methods.map((m) => (
              <div key={m.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl border shadow-sm relative group">
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button onClick={() => openModal(m)} className="text-gray-400 hover:text-blue-500"><EditIcon /></button>
                  <button onClick={() => handleDelete(m.id)} className="text-gray-400 hover:text-red-500"><TrashIcon /></button>
                </div>
                <h3 className="font-bold text-lg dark:text-white">{m.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{m.provider}</p>
                <div className="text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <span className="font-bold block text-gray-400 uppercase mb-1">Required Fields:</span>
                  {Object.entries(m.fields).map(([k, v]) => <div key={k}>{k}: {v}</div>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold dark:text-white">{editingId ? 'Edit' : 'New'} Shipping Method</h2>
              <button onClick={() => setIsModalOpen(false)}><CloseIcon /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded" />
              <input required placeholder="Provider" value={formData.provider} onChange={e => setFormData({...formData, provider: e.target.value})} className="w-full p-2 border rounded" />
              
              <div>
                <label className="block text-sm font-bold mb-2">Required Fields (Label: Description)</label>
                {fields.map((f, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input className="w-1/3 p-1 border rounded" placeholder="Label" value={f.key} onChange={e => setFields(prev => prev.map((item, idx) => idx === i ? {...item, key: e.target.value} : item))} />
                    <input className="flex-1 p-1 border rounded" placeholder="Description" value={f.value} onChange={e => setFields(prev => prev.map((item, idx) => idx === i ? {...item, value: e.target.value} : item))} />
                    <button type="button" onClick={() => setFields(prev => prev.filter((_, idx) => idx !== i))} className="text-red-500"><TrashIcon /></button>
                  </div>
                ))}
                <button type="button" onClick={() => setFields([...fields, { key: '', value: '' }])} className="text-xs text-blue-600 flex items-center"><PlusIcon /> Add Field</button>
              </div>

              <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg font-bold">Save</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}