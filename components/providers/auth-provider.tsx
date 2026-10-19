'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser(user)
        } else {
          // Check local admin/demo session fallback
          const local = typeof window !== 'undefined' ? localStorage.getItem('skyline_session') : null
          if (local) {
            try {
              const parsed = JSON.parse(local)
              setUser({
                id: 'c3424f4a-f883-49f6-9b97-e1df3dfa8af6',
                email: parsed.email || 'admin@skyline.edu.vn',
                user_metadata: {
                  full_name: parsed.full_name || 'Trưởng Bộ Môn ICT',
                  role: parsed.role || 'admin',
                },
              } as unknown as User)
            } catch {}
          }
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch {}
    if (typeof window !== 'undefined') {
      document.cookie = 'skyline_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      localStorage.removeItem('skyline_session')
      window.location.href = '/login'
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
