import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart'

const categoryIcons = {
  Home: '⌂',
  Technology: '⌁',
  Accessories: '◌',
  Wellness: '✦',
  Stationery: '▣',
}

function ProductCard({ product, featured = false }) {
  const { addItem, wishlist, toggleWishlist } = useCart()
  const [justAdded, setJustAdded] = useState(false)
  const saved = wishlist.some((item) => item.id === product.id)
  const categoryIcon = categoryIcons[product.category] || '✦'
  const lowStock = product.stock_quantity > 0 && product.stock_quantity <= 10

  const handleAdd = () => {
    addItem(product)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1400)
  }

  return (
    <article className={`product-card ${featured ? 'featured-card' : ''}`}>
      <div className="product-media">
        <Link to={`/products/${product.id}`} className="product-media-link">
          <img src={product.image_url} alt={product.name} loading="lazy" />
        </Link>

        <span className="product-badge" aria-label={`${product.category} category`}>
          <i aria-hidden="true">{categoryIcon}</i>
          {product.category || 'Object'}
        </span>

        {lowStock && <span className="stock-flag">Almost gone</span>}

        <button
          className={`wishlist-button ${saved ? 'saved' : ''}`}
          type="button"
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          onClick={(event) => {
            event.preventDefault()
            toggleWishlist(product)
          }}
        >
          {saved ? '♥' : '♡'}
        </button>

        <button className={`quick-view ${justAdded ? 'added' : ''}`} type="button" onClick={handleAdd}>
          {justAdded ? 'Added ✓' : 'Add to cart'}
        </button>
      </div>

      <div className="product-body">
        <div className="product-meta-top">
          <p className="product-category">{product.category || 'Object'}</p>
          <div className="rating-row">
            <span>★★★★★</span>
            <small>4.9</small>
          </div>
        </div>

        <Link to={`/products/${product.id}`} className="product-name-link">
          <h3>{product.name}</h3>
        </Link>

        <div className="product-actions">
          <span className="product-price">${Number(product.price).toFixed(2)}</span>
          <button className={`add-quick ${justAdded ? 'added' : ''}`} type="button" onClick={handleAdd}>
            {justAdded ? '✓' : '+'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
