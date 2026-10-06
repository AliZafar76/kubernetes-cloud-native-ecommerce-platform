import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProduct } from '../services/api'
import { useCart } from '../context/useCart'
import ProductCard from '../components/ProductCard'
import LoadingState from '../components/LoadingState'

function ProductDetails({ products }) {
  const { id } = useParams()
  const [product, setProduct] = useState(() => products.find((item) => item.id === id))
  const [loading, setLoading] = useState(!product)
  const [quantity, setQuantity] = useState(1)
  const { addItem, wishlist, toggleWishlist } = useCart()
  const saved = wishlist.some((item) => item.id === product?.id)

  useEffect(() => {
    let active = true
    const localProduct = products.find((item) => item.id === id)
    const productRequest = localProduct ? Promise.resolve(localProduct) : getProduct(id)

    productRequest
      .then((result) => {
        if (active) setProduct(result)
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [id, products])

  if (loading) {
    return (
      <main className="container detail-loading">
        <LoadingState />
      </main>
    )
  }

  if (!product) {
    return (
      <main className="container detail-loading">
        <div className="empty-state-panel">
          <h2>Product not found</h2>
          <Link className="button button-primary" to="/products">
            Back to collection
          </Link>
        </div>
      </main>
    )
  }

  const related = products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 3)

  return (
    <main className="container detail-page">
      <Link className="back-link" to="/products">
        ← Back to collection
      </Link>

      <section className="detail-layout">
        <div className="detail-gallery">
          <div className="detail-image-large">
            <img src={product.image_url} alt={product.name} />
          </div>
        </div>

        <div className="detail-copy">
          <p className="eyebrow detail-kicker">{product.category || 'ShopNest lifestyle'}</p>
          <h1>{product.name}</h1>
          <div className="rating-row">
            <span>★★★★★</span>
            <small>4.9</small>
          </div>
          <p className="detail-price">${Number(product.price).toFixed(2)}</p>
          <p className="detail-description">
            {product.description || 'A considered object for the everyday, made to be useful and enjoyed for a long time.'}
          </p>

          <div className="detail-meta">
            <div>
              <span className="meta-label">Availability</span>
              <strong>{product.stock_quantity > 0 ? 'In stock' : 'Sold out'}</strong>
            </div>
            <div>
              <span className="meta-label">Delivery</span>
              <strong>Ships in 2-4 days</strong>
            </div>
          </div>

          <div className="detail-actions">
            <div className="quantity-row">
              <span>Quantity</span>
              <div className="quantity-control">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity === 1}>
                  −
                </button>
                <span>{quantity}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)}>
                  +
                </button>
              </div>
            </div>

            <div className="button-stack">
              <button className="button button-primary" type="button" onClick={() => addItem(product, quantity)}>
                Add to bag
                <span>↗</span>
              </button>
              <button className="button button-secondary" type="button" onClick={() => toggleWishlist(product)}>
                {saved ? 'Saved' : 'Wishlist'}
              </button>
            </div>
          </div>

          <div className="info-panel">
            <div>
              <dt>Materials</dt>
              <dd>Thoughtful, durable, and easy to live with.</dd>
            </div>
            <div>
              <dt>Care</dt>
              <dd>Made for everyday use and simple upkeep.</dd>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="related-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">You may also like</p>
              <h2>Picks for your collection.</h2>
            </div>
            <Link className="text-link" to="/products">
              See all
              <span>↗</span>
            </Link>
          </div>

          <div className="product-grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default ProductDetails
