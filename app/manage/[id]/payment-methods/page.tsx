'use client'
import { SectionHeader } from '@/components/SectionHeader';
import React, { useState, useMemo } from 'react';

// --- Types ---
export type PaymentMethod = {
  id: number;
  name: string;
  description: string | null;
  provider: string;
  receiverFields: Record<string, string>; // JSON: e.g., { "Account": "0102...", "Holder": "John" }
  fields: Record<string, string>; // JSON: e.g., { "Ref": "Transaction Ref" }
};

// --- Mock Data ---
const MOCK_PAYMENTS: PaymentMethod[] = [
  { id: 1, name: 'Zelle', description: 'USD Transfer', provider: 'Zelle', receiverFields: { "Email": "payments@company.com", "Holder": "Company Name" }, fields: { "Ref": "Confirmation Number" } },
  { id: 2, name: 'Banco Mercantil', description: 'Pago Movil', provider: 'Bank', receiverFields: { "Phone": "0414-000-0000", "ID": "V-12345678" }, fields: { "Phone": "Your Phone", "Ref": "Last 4 digits" } },
];

// --- Icons ---
const PlusIcon = () => <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const CloseIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

export default function PaymentManagement() {
  const [methods, setMethods] = useState<PaymentMethod[]>(MOCK_PAYMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id: number) => {
    if (confirm('Delete this payment method?')) {
      setMethods(prev => prev.filter(m => m.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
    
        <SectionHeader title='Metodos de Pago' description='Organiza tus metodos de pago' buttonLabel='Crear Metodo' buttonAction={() => setIsModalOpen(true)} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {methods.map((method) => (
            <div key={method.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm relative group">
              <button onClick={() => handleDelete(method.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                <TrashIcon />
              </button>
              <h3 className="font-bold text-lg dark:text-white">{method.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{method.provider}</p>
              
              <div className="space-y-3">
                <div className="text-xs bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                  <span className="font-bold block text-gray-400 uppercase">Receiving Data:</span>
                  {Object.entries(method.receiverFields).map(([k, v]) => <div key={k}>{k}: {v}</div>)}
                </div>
                <div className="text-xs bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                  <span className="font-bold block text-gray-400 uppercase">Buyer Required Fields:</span>
                  {Object.entries(method.fields).map(([k, v]) => <div key={k}>{k}: {v}</div>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold dark:text-white">New Payment Method</h2>
              <button onClick={() => setIsModalOpen(false)}><CloseIcon /></button>
            </div>
            {/* Simple form placeholder */}
            <div className="space-y-4">
              <input placeholder="Name (e.g. Zelle)" className="w-full p-2 border rounded" />
              <input placeholder="Provider (e.g. Stripe)" className="w-full p-2 border rounded" />
              <textarea placeholder="Receiver Fields (JSON format)" className="w-full p-2 border rounded h-20" />
              <button className="w-full p-3 bg-blue-600 text-white rounded-lg font-bold">Save Method</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}