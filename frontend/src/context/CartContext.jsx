import { useEffect, useMemo, useState } from 'react'
import { CartContext } from './cartContext'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shopnest-cart')) || [] } catch { return [] }
  })
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shopnest-wishlist')) || [] } catch { return [] }
  })
  useEffect(() => { localStorage.setItem('shopnest-cart', JSON.stringify(items)) }, [items])
  useEffect(() => { localStorage.setItem('shopnest-wishlist', JSON.stringify(wishlist)) }, [wishlist])
  const addItem = (product, quantity = 1) => setItems((current) => {
    const existing = current.find((item) => item.id === product.id)
    if (existing) return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
    return [...current, { ...product, quantity }]
  })
  const updateQuantity = (id, quantity) => setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
  const removeItem = (id) => setItems((current) => current.filter((item) => item.id !== id))
  const clearCart = () => setItems([])
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  const toggleWishlist = (product) => setWishlist((current) => current.some((item) => item.id === product.id) ? current.filter((item) => item.id !== product.id) : [...current, product])
  const value = useMemo(() => ({ items, addItem, updateQuantity, removeItem, clearCart, itemCount, subtotal, wishlist, toggleWishlist }), [items, itemCount, subtotal, wishlist])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
