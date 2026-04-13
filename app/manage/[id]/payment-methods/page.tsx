'use client'
import React, { useState, useEffect } from 'react';
import { SectionHeader } from '@/components/SectionHeader';
// Import your API handlers (adjust the path as needed)
import { 
  getPaymentMethods, 
  createPaymentMethod, 
  updatePaymentMethod, 
  deletePaymentMethod 
} from '@/apiHandlers/paymentMethods'; 
import { useParams } from 'next/navigation';

// --- Types ---
export type PaymentMethod = {
    id: number;
    name: string;
    description: string | null;
    provider: string;
    receiverFields: Record<string, string>; 
    fields: Record<string, string>; 
    askForPaymentProofImage: boolean; // Added this
    companyId: number;
};


type DynamicField = { key: string; value: string };

// --- Icons ---
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const EditIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const PlusIcon = () => <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;

export default function PaymentManagement() {
  // Assuming you get companyId from a global state, context, or props. 
  // Hardcoded here for the API calls requirement.
  const params = useParams();
  const id = params.id;

  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    provider: '',
    askForPaymentProofImage: false
  });
  
  // Dynamic fields state (Arrays are easier to manage in forms than Objects)
  const [receiverFields, setReceiverFields] = useState<DynamicField[]>([]);
  const [buyerFields, setBuyerFields] = useState<DynamicField[]>([]);

  // --- API Fetching ---
  const fetchMethods = async () => {
    setIsLoading(true);
    try {
      const data = await getPaymentMethods(Number(id));
      setMethods(data);
    } catch (error) {
      console.error("Failed to fetch payment methods", error);
      alert("Error loading payment methods.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  // --- Handlers ---
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;
    try {
      await deletePaymentMethod(id);
      setMethods(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete payment method.");
    }
  };

const openModal = (method?: PaymentMethod) => {
    if (method) {
      setEditingId(method.id);
      setFormData({
        name: method.name,
        description: method.description || '',
        provider: method.provider,
        askForPaymentProofImage: method.askForPaymentProofImage || false,
      });
      setReceiverFields(Object.entries(method.receiverFields || {}).map(([k, v]) => ({ key: k, value: v as string })));
      setBuyerFields(Object.entries(method.fields || {}).map(([k, v]) => ({ key: k, value: v as string })));
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', provider: '', askForPaymentProofImage: false });
      setReceiverFields([{ key: '', value: '' }]);
      setBuyerFields([{ key: '', value: '' }]);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formatFields = (fields: DynamicField[]) => {
      return fields.reduce((acc, field) => {
        if (field.key.trim()) acc[field.key.trim()] = field.value.trim();
        return acc;
      }, {} as Record<string, string>);
    };

    const payload = {
      ...formData,
      receiverFields: formatFields(receiverFields),
      fields: formatFields(buyerFields),
      companyId: Number(id)
    };

    try {
      if (editingId) await updatePaymentMethod(editingId, payload);
      else await createPaymentMethod(payload);
      setIsModalOpen(false);
      fetchMethods();
    } catch (error) {
      alert("Failed to save payment method.");
    }
  };

  // --- Dynamic Field UI Helpers ---
  const handleFieldChange = (
    setter: React.Dispatch<React.SetStateAction<DynamicField[]>>, 
    index: number, 
    field: 'key' | 'value', 
    val: string
  ) => {
    setter(prev => prev.map((item, i) => i === index ? { ...item, [field]: val } : item));
  };

  const addFieldRow = (setter: React.Dispatch<React.SetStateAction<DynamicField[]>>) => {
    setter(prev => [...prev, { key: '', value: '' }]);
  };

  const removeFieldRow = (setter: React.Dispatch<React.SetStateAction<DynamicField[]>>, index: number) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <SectionHeader 
          title='Metodos de Pago' 
          description='Organiza tus metodos de pago' 
          buttonLabel='Crear Metodo' 
          buttonAction={() => openModal()} 
        />

        {isLoading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {methods.map((method) => (
              <div key={method.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm relative group">
                
                {/* Actions */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button onClick={() => openModal(method)} className="text-gray-400 hover:text-blue-500 transition-colors">
                    <EditIcon />
                  </button>
                  <button onClick={() => handleDelete(method.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <TrashIcon />
                  </button>
                </div>

                <h3 className="font-bold text-lg dark:text-white">{method.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{method.provider}</p>
                {/* Payment Proof Badge */}
                <div className="mb-3">
                  {method.askForPaymentProofImage ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Requires Payment Proof
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                      No Proof Required
                    </span>
                  )}
                </div>
                {method.description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{method.description}</p>}
                
                <div className="space-y-3 mt-4">
                  <div className="text-xs bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                    <span className="font-bold block text-gray-400 uppercase mb-1">Receiving Data:</span>
                    {Object.entries(method.receiverFields || {}).map(([k, v]) => <div key={k} className="text-gray-700 dark:text-gray-300"><span className="font-semibold">{k}:</span> {v as string}</div>)}
                  </div>
                  <div className="text-xs bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                    <span className="font-bold block text-gray-400 uppercase mb-1">Buyer Required Fields:</span>
                    {Object.entries(method.fields || {}).map(([k, v]) => <div key={k} className="text-gray-700 dark:text-gray-300"><span className="font-semibold">{k}:</span> {v as string}</div>)}
                  </div>
                </div>
              </div>
            ))}
            
            {!methods.length && (
               <div className="col-span-full text-center text-gray-500 py-10 border-2 border-dashed rounded-xl">
                 No payment methods found. Create one to get started.
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
              <h2 className="text-xl font-bold dark:text-white">
                {editingId ? 'Edit Payment Method' : 'New Payment Method'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white"><CloseIcon /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Zelle USD" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Provider</label>
                  <input required value={formData.provider} onChange={e => setFormData({...formData, provider: e.target.value})} placeholder="e.g. Zelle, Stripe, Bank" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:text-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
                  <input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Instructions or notes" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:text-white" />
                </div>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              {/* Dynamic Receiver Fields */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Where do clients send the money?</label>
                  <button type="button" onClick={() => addFieldRow(setReceiverFields)} className="text-xs text-blue-600 flex items-center hover:underline"><PlusIcon /> Add Field</button>
                </div>
                <div className="space-y-2">
                  {receiverFields.map((field, index) => (
                    <div key={index} className="flex gap-2">
                      <input placeholder="Label (e.g. Email)" value={field.key} onChange={e => handleFieldChange(setReceiverFields, index, 'key', e.target.value)} className="w-1/3 p-2 text-sm border rounded bg-transparent dark:border-gray-600 dark:text-white" />
                      <input placeholder="Value (e.g. pay@company.com)" value={field.value} onChange={e => handleFieldChange(setReceiverFields, index, 'value', e.target.value)} className="flex-1 p-2 text-sm border rounded bg-transparent dark:border-gray-600 dark:text-white" />
                      <button type="button" onClick={() => removeFieldRow(setReceiverFields, index)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><TrashIcon /></button>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              {/* Dynamic Buyer Fields */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">What data must the buyer provide?</label>
                  <button type="button" onClick={() => addFieldRow(setBuyerFields)} className="text-xs text-blue-600 flex items-center hover:underline"><PlusIcon /> Add Field</button>
                </div>
                <div className="space-y-2">
                  {buyerFields.map((field, index) => (
                    <div key={index} className="flex gap-2">
                      <input placeholder="Label (e.g. Reference)" value={field.key} onChange={e => handleFieldChange(setBuyerFields, index, 'key', e.target.value)} className="w-1/3 p-2 text-sm border rounded bg-transparent dark:border-gray-600 dark:text-white" />
                      <input placeholder="Description (e.g. Last 4 digits of transfer)" value={field.value} onChange={e => handleFieldChange(setBuyerFields, index, 'value', e.target.value)} className="flex-1 p-2 text-sm border rounded bg-transparent dark:border-gray-600 dark:text-white" />
                      <button type="button" onClick={() => removeFieldRow(setBuyerFields, index)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><TrashIcon /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toggle require payment proof Image */}
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="proof-toggle"
                  checked={formData.askForPaymentProofImage}
                  onChange={e => setFormData({...formData, askForPaymentProofImage: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="proof-toggle" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ask buyer to upload payment proof image
                </label>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full p-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg font-bold">
                  {editingId ? 'Update Payment Method' : 'Save Payment Method'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}