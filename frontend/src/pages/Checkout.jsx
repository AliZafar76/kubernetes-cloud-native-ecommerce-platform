import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart'

function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const [isComplete, setIsComplete] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    clearCart()
    setIsComplete(true)
  }

  if (isComplete) return <main className="container empty-cart"><p className="eyebrow">Order confirmed</p><h1>Thank you<br /><em>for your order.</em></h1><p>Your order has been placed successfully.</p><Link className="button button-dark" to="/products">Continue shopping <span>↗</span></Link></main>

  return <main className="container checkout-page"><div className="checkout-header"><Link className="back-link" to="/cart">← Back to bag</Link><p className="eyebrow">Secure demo checkout</p><h1>Almost <em>yours.</em></h1></div><div className="checkout-layout"><form className="checkout-form" onSubmit={handleSubmit}><section><p className="eyebrow">01 / Contact</p><input required type="email" placeholder="Email address" aria-label="Email address" /></section><section><p className="eyebrow">02 / Delivery</p><div className="form-row"><input required placeholder="First name" aria-label="First name" /><input required placeholder="Last name" aria-label="Last name" /></div><input required placeholder="Address" aria-label="Address" /><div className="form-row"><input required placeholder="City" aria-label="City" /><input required placeholder="Postal code" aria-label="Postal code" /></div></section><section><p className="eyebrow">03 / Payment</p><div className="demo-payment">Card details are collected by your payment provider in production.</div></section><button className="button button-cyan wide-button" type="submit">Place Order <span>↗</span></button></form><aside className="checkout-summary"><p className="eyebrow">Order summary</p>{items.length ? items.map((item) => <div className="checkout-item" key={item.id}><span>{item.name} × {item.quantity}</span><strong>${(Number(item.price) * item.quantity).toFixed(2)}</strong></div>) : <p className="muted-copy">Your bag is empty.</p>}<div className="summary-total"><span>Total</span><strong>${subtotal.toFixed(2)}</strong></div></aside></div></main>
}

export default Checkout
