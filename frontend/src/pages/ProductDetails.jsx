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
  const { addItem } = useCart()

  useEffect(() => {
    let active = true
    const localProduct = products.find((item) => item.id === id)
    const productRequest = localProduct ? Promise.resolve(localProduct) : getProduct(id)
    productRequest.then((result) => { if (active) setProduct(result) }).catch(() => {}).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id, products])

  if (loading) return <main className="container detail-loading"><LoadingState /></main>
  if (!product) return <main className="container detail-loading"><div className="empty-state"><h2>Product not found</h2><Link className="button button-dark" to="/products">Back to collection</Link></div></main>
  const related = products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 3)
  return <main className="container detail-page"><Link className="back-link" to="/products">← Back to collection</Link><section className="detail-layout"><div className="detail-image"><img src={product.image_url} alt={product.name} /></div><div className="detail-copy"><p className="eyebrow">{product.category || 'ShopNest object'}</p><h1>{product.name}</h1><p className="detail-price">${Number(product.price).toFixed(2)}</p><p className="detail-description">{product.description || 'A considered object for the everyday, made to be useful and enjoyed for a long time.'}</p><div className="detail-rule" /><div className="quantity-row"><span>Quantity</span><div className="quantity-control"><button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity === 1}>-</button><span>{quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)}>+</button></div></div><button className="button button-dark wide-button" type="button" onClick={() => addItem(product, quantity)}>Add to bag <span>↗</span></button><button className="button button-outline wide-button" type="button" onClick={() => addItem(product, quantity)}>Buy it now</button><dl className="product-info"><div><dt>Details</dt><dd>Designed for daily use</dd></div><div><dt>Availability</dt><dd>{product.stock_quantity > 0 ? 'In stock and ready to ship' : 'Currently unavailable'}</dd></div></dl></div></section>{related.length > 0 && <section className="related-section"><div className="section-heading"><h2>You may also like</h2><Link className="text-link" to="/products">See all <span>↗</span></Link></div><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}</main>
}

export default ProductDetails
