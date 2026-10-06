import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/useCart'

const tickerItems = [
  'Free shipping over $100',
  'New drops every Friday',
  '30-day easy returns',
  'Rated 4.9/5 by 12,000+ shoppers',
]

function Navbar({ theme = 'light', onToggleTheme }) {
  const { itemCount, wishlist } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [bump, setBump] = useState(false)
  const prevCount = useRef(itemCount)
  const navClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`
  const track = [...tickerItems, ...tickerItems]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (itemCount > prevCount.current) {
      setBump(true)
      const timeout = setTimeout(() => setBump(false), 500)
      prevCount.current = itemCount
      return () => clearTimeout(timeout)
    }
    prevCount.current = itemCount
    return undefined
  }, [itemCount])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="announcement-bar" aria-hidden="true">
        <div className="marquee-track">
          {track.map((item, index) => (
            <span key={index}>
              <i>✦</i>
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="container nav-inner">
        <Link className="brand" to="/" aria-label="ShopNest home">
          <span className="brand-mark">S</span>
          <span>ShopNest</span>
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink className={navClass} to="/">Home</NavLink>
          <NavLink className={navClass} to="/products">Shop</NavLink>
          <NavLink className={navClass} to="/categories">Categories</NavLink>
          <NavLink className={navClass} to="/about">About</NavLink>
          <NavLink className={navClass} to="/contact">Contact</NavLink>
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            <span className={`theme-toggle-icon ${theme}`}>{theme === 'dark' ? '☀' : '☾'}</span>
          </button>

          <Link className="nav-icon" to="/products" aria-label="Search products">
            ⌕
          </Link>

          <Link className="nav-icon wishlist-icon" to="/wishlist" aria-label={`${wishlist.length} wishlist items`}>
            <span aria-hidden="true">♡</span>
            {wishlist.length > 0 && <small>{wishlist.length}</small>}
          </Link>

          <Link className={`cart-pill ${bump ? 'bump' : ''}`} to="/cart" aria-label={`Shopping bag with ${itemCount} items`}>
            <span aria-hidden="true">🛍</span>
            <strong>{itemCount}</strong>
          </Link>

          <Link className="account-link" to="/login">
            Account
          </Link>

          <button
            type="button"
            className={`menu-toggle ${menuOpen ? 'open' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <NavLink className={navClass} to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink className={navClass} to="/products" onClick={() => setMenuOpen(false)}>Shop</NavLink>
        <NavLink className={navClass} to="/categories" onClick={() => setMenuOpen(false)}>Categories</NavLink>
        <NavLink className={navClass} to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
        <NavLink className={navClass} to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>
        <NavLink className={navClass} to="/login" onClick={() => setMenuOpen(false)}>Account</NavLink>
      </div>
    </header>
  )
}

export default Navbar
