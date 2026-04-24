'use client';

import React, { useState, useEffect } from 'react';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  // Animación de entrada simple al cargar la página
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="font-black text-2xl text-indigo-600 tracking-tighter">
            TiendaPro<span className="text-emerald-500">.ve</span>
          </div>
          <nav className="hidden md:flex gap-8 font-medium text-slate-600">
            <a href="#problema" className="hover:text-indigo-600 transition">¿Por qué nosotros?</a>
            <a href="#beneficios" className="hover:text-indigo-600 transition">Beneficios</a>
          </nav>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-semibold transition shadow-lg shadow-indigo-200">
            Ver Planes
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className={`pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm shadow-sm animate-pulse">
          🚀 ¡Oferta de Lanzamiento: Primeros 3 meses GRATIS!
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
          Deja de perder ventas por responder tarde en <span className="text-emerald-500">WhatsApp</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
          Profesionaliza tu tienda de Instagram. Pasa del desastre del Excel y los links caídos de Drive, a una plataforma todo-en-uno para gestionar tu inventario, pagos y envíos con tu propia tienda online.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-xl shadow-indigo-200">
            Ver Planes
          </button>
          <span className="text-sm text-slate-500 font-medium">
            🔥 Únete a +500 emprendedores venezolanos
          </span>
        </div>
      </section>

      {/* PROBLEM SECTION (Agitation) */}
      <section id="problema" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Vender por Instagram no debería ser tan estresante
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">¿Te suena familiar alguna de estas situaciones? Tu negocio está creciendo, pero tu forma de organizarlo te está frenando.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pain Point 1 */}
            <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
              <div className="text-3xl mb-4">📁</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">El Catálogo en Google Drive</h3>
              <p className="text-slate-600">"Pásame el link porfa". Tus clientes se pierden entre carpetas, fotos pesadas y precios desactualizados.</p>
            </div>
            {/* Pain Point 2 */}
            <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Caos en WhatsApp</h3>
              <p className="text-slate-600">Pierdes horas tomando pedidos a mano, verificando capturas de Pago Móvil y calculando envíos uno por uno.</p>
            </div>
            {/* Pain Point 3 */}
            <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">El temido Excel</h3>
              <p className="text-slate-600">No sabes qué te queda en el inventario hasta que vas al depósito. Vendes cosas que ya no tienes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section id="beneficios" className="py-20 bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              El control de tu negocio en una sola pantalla
            </h2>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <span className="text-emerald-400 text-2xl">✓</span>
                <div>
                  <h4 className="font-bold text-lg">Tu propia tienda web (Link en Bio)</h4>
                  <p className="text-indigo-200">Tus clientes entran, ven productos, eligen tallas y compran solos. Tú solo empacas.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-emerald-400 text-2xl">✓</span>
                <div>
                  <h4 className="font-bold text-lg">Gestión de Pagos Transparentes</h4>
                  <p className="text-indigo-200">Revisa y aprueba órdenes con captura de pantalla. Zelle, Pago Móvil o Efectivo, todo organizado.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="text-emerald-400 text-2xl">✓</span>
                <div>
                  <h4 className="font-bold text-lg">Inventario Automático</h4>
                  <p className="text-indigo-200">Si se vende, se descuenta. Olvídate de decirle a un cliente "se nos agotó ayer".</p>
                </div>
              </li>
            </ul>
          </div>
          {/* UI Mockup Placeholder */}
          <div className="bg-slate-800 rounded-2xl p-4 shadow-2xl border border-slate-700 transform rotate-2 hover:rotate-0 transition duration-500">
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="space-y-3">
              <div className="h-8 bg-slate-700 rounded w-1/3"></div>
              <div className="grid grid-cols-4 gap-2">
                <div className="h-20 bg-slate-700 rounded"></div>
                <div className="h-20 bg-slate-700 rounded"></div>
                <div className="h-20 bg-slate-700 rounded"></div>
                <div className="h-20 bg-slate-700 rounded"></div>
              </div>
              <div className="h-32 bg-indigo-600/20 border border-indigo-500/30 rounded flex items-center justify-center text-indigo-300 font-medium">
                Dashboard de Ventas
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6">
            Llegó el momento de que tu negocio trabaje para ti
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            No necesitas saber de programación. Configura tu tienda en minutos y comienza a vender en automático hoy mismo.
          </p>
          <div className="flex flex-col items-center gap-4">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-full font-extrabold text-xl transition-all hover:scale-105 shadow-2xl shadow-emerald-200 w-full sm:w-auto">
              Ver Planes Ahora
            </button>
            <p className="text-sm text-slate-500 mt-2">
              🔒 Cancela cuando quieras. No cobramos comisiones por tus ventas.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8 text-center text-slate-500">
        <p>© 2026 TiendaPro.ve - Hecho con ❤️ para el comercio venezolano.</p>
      </footer>
    </div>
  );
}


/*
Target -> stores that already generate +4 digits, and already pay employees. Also, have a nice IG profile and a considerable volume of sales comes from social media
What this solves:
- Save money because you dont have to contract more and more people to attend whatsapp and manage sales 
- Make more money, because clients have a straight lined way to buy, without waiting for whatsapp answer or complicated shipment and payment processes. 
- Why do not hired someone to develop this for me? It is more expensive and more prone to errors compared to use our store (a freelance will take +500$ from you, with no guarantee they care about your bussines)
- Why do not learn to build an ecomerce by myself? -> too much time, and months of fixing errors -> this already works and its builded
*/