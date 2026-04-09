'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Package, ShoppingBag, TrendingUp, AlertCircle, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    whatsappClicks: 0,
    lowStock: 0
  })
  const [recentClicks, setRecentClicks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const [products, categories, analytics] = await Promise.all([
        supabase.from('products').select('id, stock'),
        supabase.from('categories').select('id'),
        supabase.from('analytics').select('*').eq('event_type', 'whatsapp_order').order('created_at', { ascending: false })
      ])

      const totalProducts = products.data?.length || 0
      const totalCategories = categories.data?.length || 0
      const whatsappClicks = analytics.data?.length || 0
      const lowStock = products.data?.filter(p => p.stock < 10).length || 0

      setStats({ totalProducts, totalCategories, whatsappClicks, lowStock })
      setRecentClicks(analytics.data?.slice(0, 5) || [])
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-amber-500" size={48} /></div>

  const cards = [
    { title: 'Total Productos', value: stats.totalProducts, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Categorías', value: stats.totalCategories, icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Consultas WhatsApp', value: stats.whatsappClicks, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Stock Bajo (<10)', value: stats.lowStock, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  ]

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black tracking-tight">Analytics</h2>
        <p className="text-muted-foreground mt-1">Resumen del rendimiento de tu ferretería.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center gap-4"
          >
            <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center`}>
              <card.icon size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{card.title}</p>
              <p className="text-4xl font-black mt-1">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="pt-6">
        <h3 className="text-2xl font-bold mb-6">Pedidos Recientes (WhatsApp)</h3>
        <div className="overflow-x-auto rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Productos</th>
                <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {recentClicks.map((click) => (
                <tr key={click.id}>
                  <td className="px-6 py-4 text-sm font-medium">
                    {new Date(click.created_at).toLocaleDateString()} {new Date(click.created_at).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {click.product_details.items.length} items: {click.product_details.items.map((i: any) => i.name).join(', ')}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-amber-500">
                    ${click.product_details.total}
                  </td>
                </tr>
              ))}
              {recentClicks.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-muted-foreground italic">
                    Aún no hay pedidos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
