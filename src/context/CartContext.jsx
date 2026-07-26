import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { API_BASE } from '../utils/api.js'
import { apiFetch } from '../utils/apiFetch.js'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]') } catch { return [] }
  })
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) return
    let cancelled = false
    setSyncing(true)
    getToken().then(async token => {
      if (cancelled || !token) { setSyncing(false); return }
      try {
        const res = await apiFetch('/api/cart', {}, token)
        if (!res.ok) throw new Error()
        const data = await res.json()
        if (!cancelled) {
          const merged = (Array.isArray(data) ? data : []).map(item => ({
            id: item.id,
            menuItemId: item.menuItemId,
            name: item.name || '',
            description: item.description || '',
            basePrice: item.basePrice || 0,
            modifiers: Array.isArray(item.modifiers) ? item.modifiers : [],
            quantity: item.quantity || 1,
            image: item.image || null,
            category: item.category || 'sodas',
            isActive: item.isActive ?? true
          }))
          setCart(merged)
          localStorage.setItem('cart', JSON.stringify(merged))
        }
      } catch {
        if (!cancelled) setCart([])
      } finally {
        if (!cancelled) setSyncing(false)
      }
    })
    return () => { cancelled = true }
  }, [isLoaded, isSignedIn, getToken])

  const persist = useCallback(async (next) => {
    localStorage.setItem('cart', JSON.stringify(next))
    setCart(next)
    if (!isSignedIn) return
    const token = await getToken()
    if (!token) return
    try {
      await apiFetch('/api/cart', {
        method: 'PUT',
        body: JSON.stringify({ items: next })
      }, token)
    } catch {
      // non-blocking
    }
  }, [isSignedIn, getToken])

  const addToCart = useCallback((item) => {
    setCart(c => {
      const next = [...c, { ...item, id: crypto.randomUUID(), quantity: 1 }]
      persist(next)
      return next
    })
  }, [persist])

  const removeFromCart = useCallback((id) => {
    setCart(c => {
      const next = c.filter(i => i.id !== id)
      persist(next)
      return next
    })
  }, [persist])

  const updateQuantity = useCallback((id, delta) => {
    setCart(c => {
      const next = c.flatMap(i => {
        if (i.id !== id) return [i]
        const qty = (i.quantity || 1) + delta
        return qty > 0 ? [{ ...i, quantity: qty }] : []
      })
      persist(next)
      return next
    })
  }, [persist])

  const setQuantity = useCallback((id, quantity) => {
    setCart(c => {
      const qty = Math.max(1, quantity)
      const next = c.map(i => i.id === id ? { ...i, quantity: qty } : i)
      persist(next)
      return next
    })
  }, [persist])

  const clearCart = useCallback(() => {
    const next = []
    persist(next)
  }, [persist])

  const total = cart.reduce((sum, i) => {
    const mods = (Array.isArray(i.modifiers) ? i.modifiers : [])
    const modTotal = mods.reduce((a, b) => a + (b.priceDelta || 0), 0)
    return sum + (i.basePrice + modTotal) * (i.quantity || 1)
  }, 0)

  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, setQuantity, clearCart, total, syncing }}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
