'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'

const plans = [
  {
    id: 1, // Added ID
    name: "Básico",
    price: "9.99",
    description: "Ideal para emprendedores que están iniciando su camino digital.",
    features: ["1 Administrador", "Hasta 50 productos", "Reportes básicos", "Soporte vía Email"],
  },
  {
    id: 2, // Added ID
    name: "Profesional",
    price: "29.99",
    description: "El equilibrio perfecto para negocios en crecimiento constante.",
    features: ["5 Administradores", "Productos ilimitados", "Métricas en tiempo real", "Soporte prioritario 24/7"],
    popular: true
  },
  {
    id: 3, // Added ID
    name: "Enterprise",
    price: "79.99",
    description: "Poder total y personalización para grandes operaciones.",
    features: ["Admin ilimitados", "API personalizada", "Gerente de cuenta", "Multitienda"],
  }
]

export default function PlanSelection() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  // Store the full plan object to easily access the ID
  const [selectedPlan, setSelectedPlan] = useState(plans[1])

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  const handleContinue = () => {
    // Redirect with the query parameter
    router.push(`/payment?subscriptionId=${selectedPlan.id}`)
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0f1219] flex flex-col items-center justify-center p-6 transition-colors duration-500 font-sans relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-green-500/20 to-transparent" />
      </div>

      <div className="w-full max-w-[1100px] relative z-10">
        <div className="flex justify-between items-end mb-12 px-4">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-600 dark:text-green-400">Membresías</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tighter text-slate-800 dark:text-white mb-2">Elige tu plan Nova</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Tranquilo, puedes cambiar tu plan o cancelar tu suscripción en cualquier momento.
            </p>
          </div>
          <button 
            onClick={toggleTheme}
            className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm hover:scale-105 transition-all"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`relative group cursor-pointer transition-all duration-500 p-1 rounded-[2.5rem] ${
                selectedPlan.id === plan.id 
                ? 'bg-gradient-to-b from-green-500 to-green-600 shadow-[0_20px_50px_-20px_rgba(34,197,94,0.3)] scale-[1.02]' 
                : 'bg-slate-200 dark:bg-white/10 hover:scale-[1.01]'
              }`}
            >
              <div className="bg-white dark:bg-[#1e2330] rounded-[2.3rem] p-8 h-full flex flex-col">
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-full shadow-lg">
                    Más Popular
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-800 dark:text-white">${plan.price}</span>
                    <span className="text-slate-400 text-sm">/mes</span>
                  </div>
                </div>

                <div className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        selectedPlan.id === plan.id ? 'bg-green-500/10' : 'bg-slate-100 dark:bg-white/5'
                      }`}>
                        <svg className={`w-3 h-3 ${selectedPlan.id === plan.id ? 'text-green-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all ${
                    selectedPlan.id === plan.id 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : 'bg-slate-100 dark:bg-white/5 text-slate-400 group-hover:bg-slate-900 dark:group-hover:bg-white dark:group-hover:text-slate-900 group-hover:text-white'
                  }`}
                >
                  {selectedPlan.id === plan.id ? 'Seleccionado' : 'Elegir Plan'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button 
            onClick={handleContinue}
            className="group flex items-center gap-4 px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black text-xs uppercase tracking-[0.3em] hover:bg-green-500 dark:hover:bg-green-500 dark:hover:text-white transition-all shadow-2xl"
          >
            Continuar al pago
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}