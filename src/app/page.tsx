'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Hammer, Wrench, ShieldCheck, Truck } from 'lucide-react'

export default function Home() {
  const features = [
    { icon: Hammer, title: 'Calidad Profesional', description: 'Herramientas de las mejores marcas del mercado.' },
    { icon: Wrench, title: 'Asesoramiento Técnico', description: 'Te ayudamos a elegir lo que realmente necesitas.' },
    { icon: ShieldCheck, title: 'Garantía Total', description: 'Todos nuestros productos cuentan con garantía oficial.' },
    { icon: Truck, title: 'Envíos Rápidos', description: 'Recibe tus pedidos en la puerta de tu obra o casa.' },
  ]

  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center space-y-8 overflow-hidden rounded-[3rem] bg-slate-900 border border-slate-800 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 space-y-6 max-w-3xl"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-sm font-bold tracking-widest uppercase border border-amber-500/20">
            Ferretería Industrial & Profesional
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white">
            Toda la fuerza para <br />
            <span className="gradient-text">tus grandes proyectos</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            El catálogo más completo de herramientas, materiales de construcción y ferretería técnica con asesoramiento personalizado.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link 
              href="/catalog" 
              className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95"
            >
              Ver Catálogo Completo
              <ArrowRight size={20} />
            </Link>
            <Link 
              href="/contact" 
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all border border-slate-700"
            >
              Contactar Asesor
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 bg-card rounded-[2.5rem] border border-slate-200 dark:border-slate-800 space-y-4 hover:shadow-xl transition-shadow"
          >
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
              <feature.icon size={28} />
            </div>
            <h3 className="text-xl font-bold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-[3rem] p-12 overflow-hidden relative">
        <div className="absolute right-0 top-0 h-full opacity-10 pointer-events-none">
          <Wrench size={400} className="rotate-12 translate-x-1/2" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-4xl font-black text-slate-900 leading-tight">¿No encuentras lo que buscas?</h2>
            <p className="text-slate-800 text-lg opacity-90">Consúltanos directamente por WhatsApp. Tenemos acceso a stock de fábrica para pedidos especiales.</p>
          </div>
          <Link 
            href="/contact"
            className="px-10 py-5 bg-slate-900 text-white font-black rounded-2xl shadow-2xl hover:bg-slate-800 transition-all hover:scale-105"
          >
            Consultar Ahora
          </Link>
        </div>
      </section>
    </div>
  )
}
