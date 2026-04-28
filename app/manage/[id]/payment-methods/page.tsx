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
import { PaymentMethod } from '@/types';
import { COMMON_PAYMENT_METHODS_PAGO_MOVIL, COMMON_PAYMENT_METHODS_BANK_TRANSFER } from '@/constants';

type DynamicField = { key: string; value: string };

// --- Icons ---
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const EditIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const PlusIcon = () => <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const BackIcon = () => <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const SearchIcon = () => <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;

export default function PaymentManagement() {
  const params = useParams();
  const id = params.id;

  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'select' | 'form'>('form');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    provider: '',
    askForPaymentProofImage: false
  });
  
  // Dynamic fields state
  const [receiverFields, setReceiverFields] = useState<DynamicField[]>([]);
  const [buyerFields, setBuyerFields] = useState<DynamicField[]>([]);

  // Selection Step State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'pagomovil' | 'banktransfer'>('pagomovil');

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
      setEditingId(method.id!);
      setFormData({
        name: method.name,
        description: method.description || '',
        provider: method.provider,
        askForPaymentProofImage: method.askForPaymentProofImage || false,
      });
      setReceiverFields(Object.entries(method.receiverFields || {}).map(([k, v]) => ({ key: k, value: v as string })));
      setBuyerFields(Object.entries(method.fields || {}).map(([k, v]) => ({ key: k, value: v as string })));
      setModalStep('form');
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', provider: '', askForPaymentProofImage: false });
      setReceiverFields([{ key: '', value: '' }]);
      setBuyerFields([{ key: '', value: '' }]);
      setSearchQuery('');
      setActiveCategory('pagomovil');
      setModalStep('select'); // Open template selection for new methods
    }
    setIsModalOpen(true);
  };

  const handleSelectTemplate = (template: PaymentMethod) => {
    setFormData({
      name: template.name,
      description: template.description || '',
      provider: template.provider,
      askForPaymentProofImage: template.askForPaymentProofImage || false,
    });
    setReceiverFields(Object.entries(template.receiverFields || {}).map(([k, v]) => ({ key: k, value: v as string })));
    setBuyerFields(Object.entries(template.fields || {}).map(([k, v]) => ({ key: k, value: v as string })));
    setModalStep('form');
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

  // --- Render Lists ---
  const currentTemplates = activeCategory === 'pagomovil' ? COMMON_PAYMENT_METHODS_PAGO_MOVIL : COMMON_PAYMENT_METHODS_BANK_TRANSFER;
  const filteredTemplates = currentTemplates.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    template.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  <button onClick={() => handleDelete(method.id!)} className="text-gray-400 hover:text-red-500 transition-colors">
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
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-3xl shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                {/* Back button if in form step during creation */}
                {modalStep === 'form' && !editingId && (
                  <button onClick={() => setModalStep('select')} className="mr-2 text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors">
                    <BackIcon />
                  </button>
                )}
                <h2 className="text-xl font-bold dark:text-white">
                  {modalStep === 'select' ? 'Selecciona un Método de Pago' : (editingId ? 'Edit Payment Method' : 'New Payment Method')}
                </h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white"><CloseIcon /></button>
            </div>
            
            {modalStep === 'select' ? (
              <div className="space-y-5">
                {/* Create Custom / Desde Cero */}
                <button 
                  onClick={() => handleSelectTemplate({ name: "", description: "", provider: "", receiverFields: {}, fields: {}, askForPaymentProofImage: true,  })} 
                  className="w-full text-left p-4 border-2 border-dashed rounded-xl border-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-400 dark:hover:bg-blue-900/20 transition-all group"
                >
                  <h3 className="font-bold text-base text-blue-600 dark:text-blue-400 group-hover:underline">Crear método personalizado</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Si no ves tu método en la lista o prefieres configurarlo manualmente, selecciona esta opción.</p>
                </button>

                <div>
                  {/* Search and Category Toggles */}
                  <div className="mb-4 space-y-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Buscar método..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setActiveCategory('pagomovil')}
                        className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${activeCategory === 'pagomovil' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                      >
                        Pago Móvil
                      </button>
                      <button 
                        onClick={() => setActiveCategory('banktransfer')}
                        className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${activeCategory === 'banktransfer' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700/50 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                      >
                        Transferencia Bancaria
                      </button>
                    </div>
                  </div>

                  {/* Tinny Template Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {filteredTemplates.map((template, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => handleSelectTemplate(template)} 
                        className="text-left p-3 border rounded-lg border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all bg-white dark:bg-gray-700/50 dark:border-gray-600 dark:hover:border-blue-400 group flex flex-col justify-center min-h-[4rem]"
                      >
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">{template.name}</h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{template.provider}</p>
                      </button>
                    ))}
                    {filteredTemplates.length === 0 && (
                      <div className="col-span-full text-center text-sm text-gray-500 py-6 border border-dashed rounded-lg dark:border-gray-600">
                        No se encontraron métodos que coincidan con tu búsqueda.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
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
                  <div className="flex justify-between items-center mb-2 gap-10">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Datos de recepción (Tu cuenta)</label>
                      {/* <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">¿A dónde deben enviar el dinero?</label> */}
                      <label className="text-xs text-gray-500 dark:text-gray-400 mt-2">Agrega aquí tus datos bancarios para que el cliente sepa a qué cuenta debe realizar el pago.</label>
                    </div>
                    <button type="button" onClick={() => addFieldRow(setReceiverFields)} className="text-xs text-blue-600 flex items-center hover:underline shrink-0"><PlusIcon /> Add Field</button>
                  </div>
                  <div className="space-y-2">
                    {receiverFields.map((field, index) => (
                      <div key={index} className="flex gap-2">
                        <input placeholder="Nombre del Campo (ejemplo: Email, Telefono...)" value={field.key} onChange={e => handleFieldChange(setReceiverFields, index, 'key', e.target.value)} className="w-1/3 p-2 text-sm border rounded bg-transparent dark:border-gray-600 dark:text-white" />
                        <input placeholder="" value={field.value} onChange={e => handleFieldChange(setReceiverFields, index, 'value', e.target.value)} className="flex-1 p-2 text-sm border rounded bg-transparent dark:border-gray-600 dark:text-white" />
                        <button type="button" onClick={() => removeFieldRow(setReceiverFields, index)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><TrashIcon /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                {/* Dynamic Buyer Fields */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Datos requeridos del cliente</label>
                      {/* <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">¿Qué información debe proporcionar el comprador?</label> */}
                      <label className="text-xs text-gray-500 dark:text-gray-400 mt-2">Define los campos que el cliente deberá completar al realizar el pago para que puedas identificar y confirmar su transacción (ej. número de referencia, nombre del titular o últimos dígitos).</label>
                    </div>
                    <button type="button" onClick={() => addFieldRow(setBuyerFields)} className="shrink-0 text-xs text-blue-600 flex items-center hover:underline"><PlusIcon /> Add Field</button>
                  </div>
                  <div className="space-y-2">
                    {buyerFields.map((field, index) => (
                      <div key={index} className="flex gap-2">
                        <input placeholder="Nombre del campo (ejemplo: numero de transaccion, nombre del titular de la cuenta...)" value={field.key} onChange={e => handleFieldChange(setBuyerFields, index, 'key', e.target.value)} className="w-1/3 p-2 text-sm border rounded bg-transparent dark:border-gray-600 dark:text-white" />
                        <input placeholder="Descripcion del campo" value={field.value} onChange={e => handleFieldChange(setBuyerFields, index, 'value', e.target.value)} className="flex-1 p-2 text-sm border rounded bg-transparent dark:border-gray-600 dark:text-white" />
                        <button type="button" onClick={() => removeFieldRow(setBuyerFields, index)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><TrashIcon /></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ask buyer to upload payment proof Section */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      id="proof-toggle"
                      checked={formData.askForPaymentProofImage}
                      onChange={e => setFormData({...formData, askForPaymentProofImage: e.target.checked})}
                      className="mt-0.5 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <label htmlFor="proof-toggle" className="block text-sm font-semibold text-gray-900 dark:text-white cursor-pointer">
                        Solicitar al comprador que suba un comprobante de pago
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Si esta opción está activada, los clientes deberán subir una captura (imagen) de su recibo de transferencia al finalizar la compra.
                      </p>

                      {/* Visual Hint/Preview of the input */}
                      {/* {formData.askForPaymentProofImage && (
                        <div className="mt-3 p-3 border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center gap-2 text-gray-400 text-xs shadow-sm">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          <span className="font-medium">Upload receipt image...</span>
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full p-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-lg font-bold">
                    {editingId ? 'Update Payment Method' : 'Save Payment Method'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}