'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, MessageSquare, Camera, Users, Send } from 'lucide-react'

export default function ContactPage() {
  const contactInfo = [
    { icon: Phone, title: 'Teléfono', detail: '+54 9 69109952', subtitle: 'Llámanos en horario comercial' },
    { icon: Mail, title: 'Email', detail: 'contacto@ferreteria-ind.com', subtitle: 'Respondemos en menos de 24hs' },
    { icon: MapPin, title: 'Ubicación', detail: 'Av. Industrial 1234, Ciudad', subtitle: 'Visita nuestro showroom' },
    { icon: Clock, title: 'Horarios', detail: 'Lun a Vie 8:00 - 18:00', subtitle: 'Sábados 9:00 - 13:00' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('¡Gracias por tu mensaje! Nos pondremos en contacto pronto.')
  }

  return (
    <div className="py-12 space-y-16">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">Estamos para ayudarte</h1>
        <p className="text-lg text-muted-foreground">¿Tienes dudas tácticas o necesitas un presupuesto especial? Contáctanos por cualquiera de nuestros canales.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Info Cards */}
        <div className="lg:col-span-1 space-y-6">
          {contactInfo.map((info, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 bg-card rounded-3xl border border-slate-200 dark:border-slate-800 flex items-start gap-4"
            >
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
                <info.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">{info.title}</h3>
                <p className="text-amber-500 font-mono font-medium">{info.detail}</p>
                <p className="text-xs text-muted-foreground mt-1">{info.subtitle}</p>
              </div>
            </motion.div>
          ))}

          {/* Socials */}
          <div className="flex gap-4 pt-4">
            <a href="#" className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-amber-500 hover:text-white transition-all"><Camera size={24} /></a>
            <a href="#" className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-amber-500 hover:text-white transition-all"><Users size={24} /></a>
            <a href="#" className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-amber-500 hover:text-white transition-all"><MessageSquare size={24} /></a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-[3rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Send size={150} className="-rotate-12" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-4">Nombre Completo</label>
                  <input required type="text" className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-amber-500 transition-all" placeholder="Ej: Juan Pérez" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-4">Correo Electrónico</label>
                  <input required type="email" className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-amber-500 transition-all" placeholder="tu@email.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-4">Asunto</label>
                <input required type="text" className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-amber-500 transition-all" placeholder="¿En qué podemos ayudarte?" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-4">Mensaje</label>
                <textarea required rows={5} className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-amber-500 transition-all" placeholder="Escribe tu consulta aquí..." />
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-12 py-5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Enviar Mensaje
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Map Placeholder */}
      <section className="h-96 w-full rounded-[3rem] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden">
        <p className="text-muted-foreground font-medium italic">Mapa Interactivo de Google Maps aquí</p>
      </section>
    </div>
  )
}
