'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Product, Category } from '@/types'
import { Plus, Edit, Trash2, X, Check, Loader2, Image as ImageIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
    category_id: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from('products').select('*, category:categories(name)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name')
    ])
    if (productsRes.data) setProducts(productsRes.data)
    if (categoriesRes.data) setCategories(categoriesRes.data)
    setLoading(false)
  }

  const handleOpenModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock.toString(),
        image_url: product.image_url,
        category_id: product.category_id
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        image_url: '',
        category_id: categories[0]?.id || ''
      })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      image_url: formData.image_url,
      category_id: formData.category_id
    }

    if (editingProduct) {
      await supabase.from('products').update(payload).eq('id', editingProduct.id)
    } else {
      await supabase.from('products').insert(payload)
    }

    setIsModalOpen(false)
    await fetchData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return
    setLoading(true)
    await supabase.from('products').delete().eq('id', id)
    await fetchData()
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Inventario</h2>
          <p className="text-muted-foreground mt-1">Gestiona los productos visibles en el catálogo.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
        >
          <Plus size={20} />
          Nuevo Producto
        </button>
      </div>

      {loading && !isModalOpen ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={48} /></div>
      ) : (
        <div className="overflow-x-auto rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Producto</th>
                <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Precio</th>
                <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700" />
                      <div>
                        <p className="font-bold">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{(p as any).category?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-amber-500">${p.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${p.stock < 10 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                      {p.stock} uds
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(p)} className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-all"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-card border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nombre del Producto</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium" />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Descripción</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Precio ($)</label>
                  <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Stock Inicial</label>
                  <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Categoría</label>
                  <select value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">URL de Imagen</label>
                  <input value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium" placeholder="https://..." />
                </div>

                <div className="md:col-span-2 pt-6">
                  <button type="submit" disabled={loading} className="w-full bg-amber-500 hover:bg-amber-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-slate-900 shadow-xl shadow-amber-500/20 active:scale-95 transition-all">
                    {loading ? <Loader2 className="animate-spin" /> : <Check size={20} />}
                    {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
