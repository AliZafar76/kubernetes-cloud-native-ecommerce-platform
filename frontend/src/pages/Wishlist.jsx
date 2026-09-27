import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/useCart'

function Wishlist() {
  const { wishlist } = useCart()
  return <main className="container products-page"><div className="page-intro compact"><p className="eyebrow">Saved for later</p><h1>Your wishlist.</h1><p>Keep the objects you are thinking about close.</p></div>{wishlist.length ? <div className="product-grid">{wishlist.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><span className="empty-icon">♡</span><h2>Nothing saved yet</h2><p>Tap the heart on something you love.</p><Link className="button button-cyan" to="/products">Explore products <span>↗</span></Link></div>}</main>
}

export default Wishlist
