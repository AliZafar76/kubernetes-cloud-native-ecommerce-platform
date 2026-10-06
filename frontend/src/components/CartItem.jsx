import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart'

function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart()

  return (
    <article className="cart-item">
      <img src={item.image_url} alt={item.name} />

      <div className="cart-item-info">
        <p className="eyebrow mini-eyebrow">{item.category || 'Product'}</p>
        <Link to={`/products/${item.id}`}>
          <h3>{item.name}</h3>
        </Link>
        <button className="text-button" type="button" onClick={() => removeItem(item.id)}>
          Remove
        </button>
      </div>

      <div className="quantity-control cart-control">
        <button type="button" aria-label={`Decrease ${item.name} quantity`} onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity === 1}>
          −
        </button>
        <span>{item.quantity}</span>
        <button type="button" aria-label={`Increase ${item.name} quantity`} onClick={() => updateQuantity(item.id, item.quantity + 1)}>
          +
        </button>
      </div>

      <strong className="cart-item-price">${(Number(item.price) * item.quantity).toFixed(2)}</strong>
    </article>
  )
}

export default CartItem
