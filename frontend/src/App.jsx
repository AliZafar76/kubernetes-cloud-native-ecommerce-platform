import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { CartProvider } from './context/CartContext'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import NotFound from './pages/NotFound'
import Categories from './pages/Categories'
import InfoPage from './pages/InfoPage'
import Checkout from './pages/Checkout'
import Wishlist from './pages/Wishlist'
import Auth from './pages/Auth'
import { demoProducts, getProducts } from './services/api'
import './App.css'

function App() {
  const [products, setProducts] = useState(demoProducts)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadProducts = () => {
    setLoading(true)
    setError(false)
    getProducts()
      .then((result) => setProducts(result.length ? result : demoProducts))
      .catch(() => { setProducts(demoProducts); setError(false) })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getProducts()
      .then((result) => setProducts(result.length ? result : demoProducts))
      .catch(() => setProducts(demoProducts))
      .finally(() => setLoading(false))
  }, [])

  return <BrowserRouter><CartProvider><Navbar /><Routes><Route path="/" element={<Home products={products} />} /><Route path="/products" element={<Products products={products} loading={loading} error={error} onRetry={loadProducts} />} /><Route path="/shop" element={<Products products={products} loading={loading} error={error} onRetry={loadProducts} />} /><Route path="/products/:id" element={<ProductDetails products={products} />} /><Route path="/categories" element={<Categories />} /><Route path="/cart" element={<Cart />} /><Route path="/checkout" element={<Checkout />} /><Route path="/wishlist" element={<Wishlist />} /><Route path="/about" element={<InfoPage type="about" />} /><Route path="/contact" element={<InfoPage type="contact" />} /><Route path="/login" element={<Auth />} /><Route path="/register" element={<Auth mode="register" />} /><Route path="*" element={<NotFound />} /></Routes><Footer /></CartProvider></BrowserRouter>
}

export default App
