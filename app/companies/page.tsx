'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SectionHeader } from '@/components/SectionHeader';
import { CreateCompany, createCompany, getCompanies } from '@/apiHandlers/companies';

// --- Types ---
interface Company {
  id: string | number;
  name: string;
  stats: {
    products: number;
    orders: number;
  };
}

// --- Company Modal Component ---
function CompanyModal({ isOpen, onClose, onSave, error }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (data: CreateCompany) => void;
  error: string | null;
}) {
  const [formData, setFormData] = useState<CreateCompany>({
    name: '',
    currency: 'USD',
    showOutOfStockProducts: false
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold">Crear Nueva Empresa</h2>
          <p className="text-xs text-gray-500 mt-1">Configura los detalles básicos de tu organización</p>
        </div>

        <div className="p-6 space-y-5">
          {/* Modal Specific Error */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nombre de la Empresa</label>
            <input 
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm"
              placeholder="Ej: Garden Corp"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Currency */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Moneda</label>
              <select 
                value={formData.currency}
                onChange={(e) => setFormData({...formData, currency: e.target.value as "USD"|"VES"})}
                className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="VES">VES (Bs.)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onSave(formData)}
            className="flex-1 py-3 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all"
          >
            Crear Empresa
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---
export default function CompanySelection() {
  const router = useRouter();
  
  // States
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCompanies();
      setCompanies(result);
    } catch (err) {
      setError('No se pudieron cargar las empresas. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreateSave = async (data: CreateCompany) => {
    setModalError(null);
    try {
      await createCompany(data);
      setIsModalOpen(false);
      fetchCompanies(); // Refresh list after creation
    } catch (error) {
      setModalError('Error al crear la empresa. Verifica los datos.');
    }
  };

  const handleSelectCompany = (id: string | number) => {
    router.push(`/manage/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-8 font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <SectionHeader 
          title='Mis Empresas' 
          description='Selecciona una organización para gestionar tus productos y pedidos' 
          buttonLabel='Nueva Empresa' 
          buttonAction={() => setIsModalOpen(true)} 
        />

        {/* State Handling (Loading / Error) */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mb-4"></div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Cargando empresas...</p>
          </div>
        ) : error ? (
          <div className="p-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-center border border-red-200 dark:border-red-800">
            <p className="font-bold mb-2">¡Oops!</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={fetchCompanies}
              className="mt-4 text-xs font-black uppercase tracking-widest underline decoration-2 underline-offset-4"
            >
              Reintentar
            </button>
          </div>
        ) : companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-bold">No tienes empresas aún</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">Crea tu primera empresa para empezar a vender tus productos.</p>
          </div>
        ) : (
          /* Grid Area */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <button
                key={company.id}
                onClick={() => handleSelectCompany(company.id)}
                className="group relative flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 text-left"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-inner">
                    {company.name.charAt(0)}
                  </div>
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="text-lg font-bold group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {company.name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    ID: #{company.id}
                  </p>
                </div>

                <div className="mt-auto flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Productos</span>
                    <span className="text-sm font-semibold">{company.stats?.products || 0}</span>
                  </div>
                  <div className="flex flex-col border-l border-gray-100 dark:border-gray-700/50 pl-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Pedidos</span>
                    <span className="text-sm font-semibold">{company.stats?.orders || 0}</span>
                  </div>
                  
                  <div className="ml-auto w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <CompanyModal 
        isOpen={isModalOpen} 
        error={modalError}
        onClose={() => {
          setIsModalOpen(false);
          setModalError(null);
        }} 
        onSave={handleCreateSave} 
      />
    </div>
  );
}