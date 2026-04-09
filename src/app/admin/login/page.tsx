'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simple static password check
    // In a real app, this should be done via an API route to compare with process.env.ADMIN_PASSWORD
    // For this demonstration, we'll use a fetch or a simple client-side check if the password is leaked
    // But since the user asked for a "static account", I'll use an API route to keep it somewhat secure.
    
    fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    }).then(async res => {
      const data = await res.json()
      if (res.ok && data.success) {
        sessionStorage.setItem('ferreteria-admin-auth', 'true')
        router.push('/admin')
      } else {
        setError('Contraseña incorrecta')
      }
    }).finally(() => setIsLoading(false))
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mx-auto">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-black">Acceso Admin</h1>
          <p className="text-muted-foreground">Ingresa la contraseña maestra para gestionar tu tienda.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Contraseña</label>
            <input
              type="password"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-amber-500 transition-all font-mono"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-800 text-slate-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-amber-500/20 transition-all active:scale-[0.98]"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Entrar al Panel'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
