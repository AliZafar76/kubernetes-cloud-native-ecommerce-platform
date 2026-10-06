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

  if (isComplete) {
    return (
      <main className="container empty-cart-page">
        <div className="empty-state-panel">
          <p className="eyebrow">Order confirmed</p>
          <h1>
            Thank you
            <span> for your order.</span>
          </h1>
          <p>Your order has been placed successfully.</p>
          <Link className="button button-primary" to="/products">
            Continue shopping
            <span>↗</span>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container checkout-page">
      <div className="checkout-header">
        <Link className="back-link" to="/cart">
          ← Back to bag
        </Link>
        <p className="eyebrow">Secure demo checkout</p>
        <h1>
          Almost <span>yours.</span>
        </h1>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <section>
            <p className="eyebrow">01 / Contact</p>
            <label className="field">
              <span>Email</span>
              <input required type="email" placeholder="you@example.com" aria-label="Email address" />
            </label>
          </section>

          <section>
            <p className="eyebrow">02 / Delivery</p>
            <div className="form-row">
              <label className="field">
                <span>First name</span>
                <input required placeholder="First name" aria-label="First name" />
              </label>
              <label className="field">
                <span>Last name</span>
                <input required placeholder="Last name" aria-label="Last name" />
              </label>
            </div>

            <label className="field">
              <span>Address</span>
              <input required placeholder="Street address" aria-label="Address" />
            </label>

            <div className="form-row">
              <label className="field">
                <span>City</span>
                <input required placeholder="City" aria-label="City" />
              </label>
              <label className="field">
                <span>Country</span>
                <input required placeholder="Country" aria-label="Country" />
              </label>
            </div>
          </section>

          <section>
            <p className="eyebrow">03 / Payment</p>
            <div className="demo-payment">
              Card details are collected by your payment provider in production.
            </div>
          </section>

          <button className="button button-primary wide-button" type="submit">
            Place order
            <span>↗</span>
          </button>
        </form>

        <aside className="summary-panel checkout-summary">
          <p className="eyebrow">Order summary</p>

          {items.length ? (
            items.map((item) => (
              <div className="checkout-item" key={item.id}>
                <span>
                  {item.name} × {item.quantity}
                </span>
                <strong>${(Number(item.price) * item.quantity).toFixed(2)}</strong>
              </div>
            ))
          ) : (
            <p className="muted-copy">Your bag is empty.</p>
          )}

          <div className="summary-total">
            <span>Total</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default Checkout
