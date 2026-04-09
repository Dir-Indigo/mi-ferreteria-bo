'use client'

import { Product } from '@/types'
import { Plus, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'

interface ProductCardProps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-500"
    >
      <div className="aspect-square overflow-hidden relative">
        <img
          src={product.image_url || 'https://placehold.co/400x400?text=Producto'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <p className="text-white text-xs line-clamp-2">{product.description}</p>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg leading-tight group-hover:text-amber-500 transition-colors">{product.name}</h3>
          <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold px-2 py-1 rounded-lg">
            ${product.price}
          </span>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">Stock: {product.stock} unidades</span>
          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-xl transition-all active:scale-95 shadow-lg shadow-amber-500/20"
          >
            <Plus size={20} />
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
