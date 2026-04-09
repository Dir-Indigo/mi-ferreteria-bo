'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Product, Category } from '@/types'
import { ProductCard } from '@/components/ProductCard'
import { Search, Filter, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name')
      ])

      if (productsRes.data) setProducts(productsRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
      setLoading(false)
    }

    fetchData()
  }, [])

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !selectedCategory || p.category_id === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Catálogo de Productos</h1>
          <p className="text-muted-foreground mt-2">Explora nuestras herramientas y materiales de ferretería.</p>
        </div>

        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-card outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-6 py-2 rounded-xl border transition-all whitespace-nowrap font-medium ${
            !selectedCategory
              ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-amber-500'
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-6 py-2 rounded-xl border transition-all whitespace-nowrap font-medium ${
              selectedCategory === cat.id
                ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-amber-500'
          }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-amber-500" size={48} />
          <p className="text-muted-foreground animate-pulse">Cargando productos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-muted-foreground">No se encontraron productos que coincidan con tu búsqueda.</p>
        </div>
      )}
    </div>
  )
}
