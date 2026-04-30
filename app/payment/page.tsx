'use client'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import jwt from 'jsonwebtoken'

const submitPayment = async (data: any) => {
  // Logic for sending data + file would go here (e.g., FormData)
  console.log(data)
  return new Promise((resolve) => setTimeout(resolve, 2000))
}

type PaymentMethod = 'pago_movil' | 'transferencia' | 'binance' | null;

const subscriptionPlan = {
  name: "Plan Profesional",
  price: "29.99",
  currency: "USD",
  features: [
    "Acceso ilimitado a todas las métricas",
    "Soporte prioritario 24/7",
    "Hasta 5 cuentas de administrador",
    "Sin comisiones por ventas"
  ]
};

export default function PaymentPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)

  // --- User State ---
  const [userFullName, setUserFullName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  // --- Payment Form State ---
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)
  const [reference, setReference] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerId, setOwnerId] = useState('')
  const [originBank, setOriginBank] = useState('')
  const [amount, setAmount] = useState(subscriptionPlan.price) 
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if(!token) return
    const decoded = jwt.decode(token) as any;
    if(!decoded?.role || (decoded.role !== "ADMIN")) return 
  }, [router]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) return

    const newErrors: { [key: string]: string } = {}
    // User Validation
    if (!userFullName) newErrors.userFullName = 'Nombre requerido'
    if (!userEmail || !userEmail.includes('@')) newErrors.userEmail = 'Email inválido'
    
    // Payment Validation
    if (!paymentMethod) newErrors.paymentMethod = 'Selecciona un método'
    if (!reference || reference.length < 4) newErrors.reference = 'Referencia inválida'
    if (!ownerName) newErrors.ownerName = 'Requerido'
    if (!ownerId) newErrors.ownerId = 'Requerido'
    if (!amount) newErrors.amount = 'Requerido'
    if (!receiptFile) newErrors.receipt = 'Sube el comprobante'
    
    if ((paymentMethod === 'pago_movil' || paymentMethod === 'transferencia') && !originBank) {
      newErrors.originBank = 'Requerido'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      try {
        setIsLoading(true)
        await submitPayment({ 
          userFullName, userEmail, paymentMethod, reference, ownerName, ownerId, originBank, amount, receiptFile, plan: subscriptionPlan.name 
        })
        setToast({ message: 'Pago reportado con éxito', type: 'success' })
        setTimeout(() => router.push('/dashboard'), 1500)
      } catch (error: any) {
        setToast({ message: error?.message || 'Error al procesar. Intenta de nuevo.', type: 'error' })
      } finally {
        setIsLoading(false)
      }
    } else {
        setToast({ message: 'Completa todos los campos obligatorios', type: 'error' })
    }
  }

  const receiverInfo = {
    pago_movil: { title: "Datos Pago Móvil", details: ["Banco: Provincial (0108)", "Cédula: V-12.345.678", "Teléfono: 0414-1234567"] },
    transferencia: { title: "Transferencia BBVA Provincial", details: ["Titular: Inversiones Nova C.A.", "RIF: J-12345678-9", "Cuenta: 0108-0000-00-0123456789"] },
    binance: { title: "Binance Pay", details: ["Pay ID: 123456789", "Correo: pagos@nova.com", "Red: Tron (TRC20) USDT"] }
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0f1219] flex items-center justify-center p-6 transition-colors duration-500 font-sans relative overflow-hidden">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right fade-in duration-300">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${
            toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full animate-pulse ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`} />
              <span className="text-xs font-black uppercase tracking-widest">{toast.message}</span>
            </div>
          </div>
        </div>
      )}

      {/* Background Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-green-500/20 to-transparent" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-green-500/10 to-transparent" />
      </div>

      <div className="w-full max-w-[540px] relative z-10 py-8">
        <div className="flex justify-between items-end mb-6 px-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-600 dark:text-green-400">Checkout</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tighter text-slate-800 dark:text-white">Finalizar Compra</h1>
          </div>
          <button onClick={toggleTheme} className="w-10 h-10 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm hover:scale-105 transition-all">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="bg-white dark:bg-[#1e2330]/90 backdrop-blur-3xl border border-slate-200 dark:border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden">
          <div className="h-1.5 w-full bg-slate-100 dark:bg-black/20">
            <div className={`h-full bg-green-500 transition-all duration-700 shadow-[0_0_10px_#22c55e] ${paymentMethod ? 'w-full' : 'w-1/3'}`} />
          </div>

          <div className="p-8 md:p-10">
            
            <form className="space-y-6" onSubmit={handleSubmit}>

              {/* SECTION: User Information */}
              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Información de la Cuenta</label>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    value={userFullName}
                    onChange={(e) => setUserFullName(e.target.value)}
                    placeholder="Tu Nombre Completo"
                    className={`w-full bg-slate-50 dark:text-gray-100 dark:bg-black/30 border ${errors.userFullName ? 'border-red-500/50' : 'border-slate-200 dark:border-white/5'} rounded-2xl px-5 py-4 text-sm outline-none focus:border-green-500/50 transition-all font-medium`}
                  />
                  <div>
                    <input 
                      type="email" 
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="Correo Electrónico"
                      className={`w-full bg-slate-50 dark:text-gray-100 dark:bg-black/30 border ${errors.userEmail ? 'border-red-500/50' : 'border-slate-200 dark:border-white/5'} rounded-2xl px-5 py-4 text-sm outline-none focus:border-green-500/50 transition-all font-medium`}
                    />
                    <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 ml-1 italic">Este correo será utilizado como tu usuario de acceso.</p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-6 rounded-[1.5rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 shadow-inner">
                <div className="flex justify-between items-start mb-5 pb-5 border-b border-slate-200 dark:border-white/10">
                  <div>
                    <h2 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Resumen de orden</h2>
                    <p className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">{subscriptionPlan.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-green-500">${subscriptionPlan.price}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {subscriptionPlan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      <div className="mt-0.5 w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <svg className="w-2.5 h-2.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Método de pago</label>
                <div className="grid grid-cols-3 gap-3">
                  {[{ id: 'pago_movil', label: 'Pago Móvil' }, { id: 'transferencia', label: 'Transferencia' }, { id: 'binance', label: 'Binance USDT' }].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                      className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border ${
                        paymentMethod === method.id ? 'bg-green-500/10 border-green-500 text-green-600 dark:text-green-400' : 'bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:border-green-500/30'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Receiver Info */}
              {paymentMethod && (
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 animate-in fade-in slide-in-from-top-2">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2">{receiverInfo[paymentMethod].title}</h3>
                  <div className="space-y-1">
                    {receiverInfo[paymentMethod].details.map((detail, idx) => (
                      <p key={idx} className="text-xs text-slate-500 dark:text-slate-400 font-medium">{detail}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Details Form */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Ref. de Pago</label>
                    <input 
                      type="text" 
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="Ej. 123456"
                      className={`w-full bg-slate-50 dark:text-gray-100 dark:bg-black/30 border ${errors.reference ? 'border-red-500/50' : 'border-slate-200 dark:border-white/5'} rounded-2xl px-5 py-4 text-sm outline-none focus:border-green-500/50 transition-all font-medium`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Monto Pagado</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-50 dark:text-gray-100 dark:bg-black/30 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:border-green-500/50 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre del Titular (Pago)</label>
                  <input 
                    type="text" 
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Nombre en el comprobante"
                    className="w-full bg-slate-50 dark:text-gray-100 dark:bg-black/30 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:border-green-500/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Cédula / Documento</label>
                    <input 
                      type="text" 
                      value={ownerId}
                      onChange={(e) => setOwnerId(e.target.value)}
                      placeholder="V-12345678"
                      className="w-full bg-slate-50 dark:text-gray-100 dark:bg-black/30 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:border-green-500/50 transition-all font-medium"
                    />
                  </div>
                  {(paymentMethod === 'pago_movil' || paymentMethod === 'transferencia') && (
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Banco de Origen</label>
                      <input 
                        type="text" 
                        value={originBank}
                        onChange={(e) => setOriginBank(e.target.value)}
                        placeholder="Ej. Banesco"
                        className="w-full bg-slate-50 dark:text-gray-100 dark:bg-black/30 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 text-sm outline-none focus:border-green-500/50 transition-all font-medium"
                      />
                    </div>
                  )}
                </div>

                {/* SECTION: File Upload */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Captura de Pantalla / Comprobante</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`group relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      errors.receipt 
                      ? 'border-red-500/40 bg-red-500/5' 
                      : 'border-slate-200 dark:border-white/10 hover:border-green-500/50 hover:bg-green-500/5'
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*,.pdf" 
                      onChange={handleFileChange} 
                    />
                    
                    {receiptFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{receiptFile.name}</p>
                        <p className="text-[10px] text-green-500 uppercase tracking-widest font-black">Archivo Cargado</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                        </div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Haz clic para subir o arrastra una imagen</p>
                        <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-tighter">PNG, JPG o PDF (Máx 5MB)</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                {isLoading ? (
                  <div className="w-full h-[52px] bg-slate-100 dark:bg-white/5 rounded-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-green-500/20 animate-pulse" />
                    <div className="h-full bg-green-500 animate-[loading_2s_ease-in-out_infinite] w-1/3 shadow-[0_0_20px_#22c55e]" />
                  </div>
                ) : (
                  <button 
                    type="submit"
                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-green-500 dark:hover:bg-green-500 dark:hover:text-white transition-all shadow-xl"
                  >
                    Confirmar Pago
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  )
}