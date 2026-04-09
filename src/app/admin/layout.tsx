'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { BarChart3, Package, Settings, LogOut, ChevronRight } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip auth check only for the login page
    if (pathname === '/admin/login') return

    const auth = sessionStorage.getItem('ferreteria-admin-auth')
    if (auth !== 'true') {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
    }
  }, [pathname, router])

  if (pathname === '/admin/login') return <>{children}</>
  if (!isAuthenticated) return <div className="min-h-screen bg-background" />

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Inventario', href: '/admin/products', icon: Package },
  ]

  const handleLogout = () => {
    sessionStorage.removeItem('ferreteria-admin-auth')
    router.push('/admin/login')
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[90vh] gap-8 py-8">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 space-y-6">
        <div className="bg-card rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
          <div className="flex items-center gap-2 px-2 mb-8">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-slate-900 font-bold">A</div>
            <span className="font-black text-lg tracking-tight">Admin Panel</span>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-amber-500 text-slate-900 font-bold shadow-lg shadow-amber-500/20' 
                      : 'text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight size={16} />}
                </Link>
              )
            })}
          </nav>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-medium"
            >
              <LogOut size={20} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="flex-1">
        <div className="bg-card rounded-[3rem] border border-slate-200 dark:border-slate-800 p-8 shadow-xl min-h-full">
          {children}
        </div>
      </main>
    </div>
  )
}
