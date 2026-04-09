'use client'

import React, { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { X, Trash2, Plus, Minus, Send, ShoppingCart, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

export const CartSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart()
  const [isSending, setIsSending] = useState(false)

  const handleWhatsAppOrder = async () => {
    if (cart.length === 0) return
    setIsSending(true)

    // 1. Log Analytics
    try {
      await supabase.from('analytics').insert({
        event_type: 'whatsapp_order',
        product_details: {
          items: cart.map(i => ({ id: i.id, name: i.name, qty: i.quantity, price: i.price })),
          total: totalPrice
        }
      })
    } catch (e) {
      console.error('Failed to log analytics', e)
    }

    // 2. Format Message
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5491122334455'
    let message = 'Hola! 👋 Quisiera realizar el siguiente pedido:\n\n'
    
    cart.forEach((item) => {
      message += `*${item.name}* (x${item.quantity}) - $${item.price * item.quantity}\n`
    })

    message += `\n*TOTAL: $${totalPrice}*`
    
    // 3. Open WhatsApp
    const encodedMessage = encodeURIComponent(message)
    const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    
    window.open(url, '_blank')
    setIsSending(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-slate-200 dark:border-slate-800 z-[101] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="text-amber-500" />
                <h2 className="text-xl font-bold">Tu Carrito</h2>
                <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs px-2 py-1 rounded-full">{totalItems}</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                  <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full">
                    <ShoppingCart size={48} />
                  </div>
                  <p>Tu carrito está vacío</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-800" />
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-amber-500 font-bold">${item.price}</p>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="hover:text-amber-500"><Minus size={14} /></button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="hover:text-amber-500"><Plus size={14} /></button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-400 p-1"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium">Total Estimado</span>
                  <span className="font-bold text-2xl text-amber-500">${totalPrice}</span>
                </div>
                
                <button
                  onClick={handleWhatsAppOrder}
                  disabled={isSending}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-green-600/20 transition-all active:scale-[0.98]"
                >
                  {isSending ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                  Enviar Pedido por WhatsApp
                </button>
                
                <button onClick={clearCart} className="w-full text-slate-400 hover:text-red-400 text-sm transition-colors pt-2">
                  Vaciar Carrito
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
