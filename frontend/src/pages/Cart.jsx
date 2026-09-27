import { Link } from 'react-router-dom'
import CartItem from '../components/CartItem'
import { useCart } from '../context/useCart'

function Cart() {
  const { items, subtotal } = useCart()
  if (!items.length) return <main className="container empty-cart"><p className="eyebrow">Your shopping bag</p><h1>Nothing here<br /><em>yet.</em></h1><p>Your next favorite might be waiting in the collection.</p><Link className="button button-dark" to="/products">Explore products <span>↗</span></Link></main>
  return <main className="container cart-page"><div className="page-intro compact"><p className="eyebrow">Your shopping bag</p><h1>Take it home.</h1><p>{items.length} {items.length === 1 ? 'item' : 'items'} selected for you.</p></div><div className="cart-layout"><section className="cart-items">{items.map((item) => <CartItem key={item.id} item={item} />)}<Link className="text-link continue-link" to="/products">← Continue shopping</Link></section><aside className="order-summary"><p className="eyebrow">Summary</p><div className="summary-row"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div><div className="summary-row muted"><span>Shipping</span><span>Calculated at checkout</span></div><div className="summary-total"><span>Total</span><strong>${subtotal.toFixed(2)}</strong></div><Link className="button button-dark wide-button" to="/checkout">Checkout <span>↗</span></Link><p className="secure-note">Secure checkout · Free shipping over $100</p></aside></div></main>
}

export default Cart
