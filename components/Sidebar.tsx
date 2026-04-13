'use client'
import { useEffect, useState, useRef } from 'react';
import { useTheme } from 'next-themes';
import { logoutUser } from '@/apiHandlers/auth';
import { jwtDecode } from "jwt-decode";
import Link from 'next/link'; // Added for the redirect button
import { useParams, useRouter } from 'next/navigation';
import { getCompanies } from '@/apiHandlers/companies';

interface Company {
  id: string;
  name: string;
  plan?: string; // Optional since your new state structure focus on {id, name}
}

function getJWTPayload() {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('jwt');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded as { role: "MAIN_ADMIN" | "MANAGER" } | null
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}

export const navItemsMainAdmin = [
  { id: 'products', label: 'Productos', desc: 'Administra tus productos' },
  { id: 'categories', label: 'Categorias', desc: 'Administra tus categorias' },
  { id: 'payment-methods', label: 'Metodos de Pago', desc: 'Administra tus metodos de pago' },
  { id: 'shipment-methods', label: 'metodos de envio', desc: 'Administra tus metodos de envio' },
  { id: 'orders', label: 'ordenes', desc: 'Administra tus ordenes y pedidos' },
  { id: 'billing', label: 'facturacion', desc: 'Administra tu facturacion y subscripcion' },
  { id: 'store', label: 'Tienda', desc: 'Personaliza el aspecto de tu tienda' },
];

export function Sidebar({ activeItem = 'products'}: { activeItem?: string}) {
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const { theme, setTheme } = useTheme();
  const [hovered, setHovered] = useState<string | null>(null);
  const [role, setRole] = useState<"MAIN_ADMIN" | "MANAGER" | null>(null);
  
  // New States
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  // Handle initial selection when companies are fetched
  useEffect(() => {
    fetchCompanyData()
  }, []);
  
  const fetchCompanyData = async() => {
    const companyResult = await getCompanies(Number(id))
    setSelectedCompany(companyResult)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const token = getJWTPayload()
    if (token) setRole(token.role)
  }, [])

  const Icon = ({ id, active }: { id: string, active: boolean }) => {
    const base = `w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`;
    return (
      <svg className={base} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
      </svg>
    );
  };

  return (
    <aside className="w-full h-full flex flex-col bg-white dark:bg-[#1e2330] border-r border-slate-200 dark:border-white/10 transition-colors duration-500">
      
      {/* 1. Company Switcher Section */}
      <div className="p-6 relative" ref={dropdownRef}>
          <>
            <button 
              onClick={() => router.push("/companies")}
              className="cursor-pointer w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-green-500/50 transition-all group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                  <svg 
                    className={`w-4 h-4 text-slate-400 rotate-90`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-[11px] font-black uppercase tracking-tight dark:text-white truncate">
                    {selectedCompany?.name} 
                  </p>
                </div>
              </div>
            </button>
          </>
      </div>

      {/* 2. Navigation List */}
      <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
        {navItemsMainAdmin.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => router.push(`/manage/${id}/${item.id}`)}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              className={`w-full group relative flex items-center gap-4 p-4 rounded-[1.25rem] transition-all duration-300 ${
                isActive 
                ? 'bg-green-500 text-white shadow-xl shadow-green-500/20' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
              }`}
            >
              <div className="relative z-10 flex-shrink-0">
                <Icon id={item.id} active={isActive} />
              </div>
              <div className="flex-1 text-left relative z-10 overflow-hidden">
                <p className={`text-[10px] font-black uppercase tracking-widest truncate ${isActive ? 'text-white' : ''}`}>
                  {item.label}
                </p>
                {(hovered === item.id || isActive) && (
                  <p className={`text-[7px] font-bold uppercase tracking-tighter mt-0.5 animate-in fade-in slide-in-from-left-1 ${isActive ? 'text-green-100/70' : 'text-slate-400'}`}>
                    {item.desc}
                  </p>
                )}
              </div>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white relative z-10 shadow-sm" />}
            </button>
          );
        })}
      </nav>

            {/* 3. Footer Section */}
      <div className="p-4 mt-auto space-y-2 border-t border-slate-100 dark:border-white/5">
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-black/20 text-slate-400 hover:text-green-500 transition-all group"
        >
          <span className="text-[9px] font-black uppercase tracking-widest">
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </span>
          <span className="text-base group-hover:rotate-12 transition-transform">
            {theme === 'dark' ? '☀️' : '🌙'}
          </span>
        </button>

        <button onClick={()=>logoutUser("/")} className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all group">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span className="text-[9px] font-black uppercase tracking-widest">Exit System</span>
        </button>
      </div>

    </aside>
  );
}