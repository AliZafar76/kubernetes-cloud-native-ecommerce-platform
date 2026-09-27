import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/useCart'

function Navbar() {
  const { itemCount, wishlist } = useCart()
  const navClass = ({ isActive }) => isActive ? 'nav-link active' : 'nav-link'
  return <header className="site-header"><div className="container nav-inner"><Link className="brand" to="/" aria-label="ShopNest home"><span className="brand-mark">S</span><span>ShopNest</span></Link><nav className="main-nav" aria-label="Main navigation"><NavLink className={navClass} to="/">Home</NavLink><NavLink className={navClass} to="/products">Shop</NavLink><NavLink className={navClass} to="/categories">Categories</NavLink><NavLink className={navClass} to="/about">About</NavLink><NavLink className={navClass} to="/contact">Contact</NavLink></nav><div className="nav-actions"><NavLink className={navClass} to="/login">Login</NavLink><NavLink className={navClass} to="/register">Register</NavLink><Link className="nav-icon" to="/products" aria-label="Search products">⌕</Link><Link className="nav-icon" to="/wishlist" aria-label={`${wishlist.length} wishlist items`}>♡<small>{wishlist.length}</small></Link><Link className="cart-link" to="/cart" aria-label={`Shopping bag with ${itemCount} items`}>Bag <b>{itemCount}</b></Link></div></div></header>
}

export default Navbar
