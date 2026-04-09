'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Home, ShoppingBag, ShoppingCart, Phone, UserCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { CartSidebar } from './CartSidebar'

export const Navbar = () => {
  const pathname = usePathname()

  const navItems = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Catálogo', href: '/catalog', icon: ShoppingBag },
    { name: 'Contacto', href: '/contact', icon: Phone },
  ]

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { totalItems } = useCart()

  return (
    <>
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg md:top-6 md:bottom-auto">
        <div className="glass flex items-center justify-around py-4 px-6 rounded-3xl shadow-2xl border border-white/20">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.name} href={item.href} className="relative group">
                <div className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-amber-500 scale-110' : 'text-slate-400 hover:text-white'}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium uppercase tracking-wider">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-2 w-1.5 h-1.5 bg-amber-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </div>
              </Link>
            )
          })}
          
          {/* Cart Trigger */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-all relative"
          >
            <ShoppingCart size={24} />
            <span className="text-[10px] font-medium uppercase tracking-wider">Carrito</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-slate-900 font-bold">
                {totalItems}
              </span>
            )}
          </button>

          {/* Admin Link */}
          <Link href="/admin" className={`flex flex-col items-center gap-1 transition-all ${pathname.startsWith('/admin') ? 'text-amber-500' : 'text-slate-400 hover:text-white'}`}>
            <UserCircle size={24} />
            <span className="text-[10px] font-medium uppercase tracking-wider">Admin</span>
          </Link>
        </div>
      </nav>

      <CartSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  )
}
