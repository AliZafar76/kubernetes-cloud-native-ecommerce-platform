import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart'

function ProductCard({ product, featured = false }) {
  const { addItem, wishlist, toggleWishlist } = useCart()
  const saved = wishlist.some((item) => item.id === product.id)
  return <article className={`product-card ${featured ? 'featured-card' : ''}`}><Link className="product-image" to={`/products/${product.id}`}><img src={product.image_url} alt={product.name} /><button className={`wishlist-button ${saved ? 'saved' : ''}`} type="button" aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} onClick={(event) => { event.preventDefault(); toggleWishlist(product) }}>♡</button><span className="view-product">View item ↗</span></Link><div className="product-meta"><div><p className="product-category">{product.category || 'Object'}</p><Link to={`/products/${product.id}`}><h3>{product.name}</h3></Link><span className="rating">★★★★★ <small>4.8</small></span></div><span className="price">${Number(product.price).toFixed(2)}</span></div><button className="add-quick" type="button" onClick={() => addItem(product)}>Add to bag <span>+</span></button></article>
}

export default ProductCard
