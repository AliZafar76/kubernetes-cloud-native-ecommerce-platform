import ProductCard from './ProductCard'

function ProductGrid({ products }) {
  if (!products.length) return <div className="empty-state"><span className="empty-icon">○</span><h2>No objects found</h2><p>Try adjusting your search or category filter.</p></div>
  return <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
}

export default ProductGrid
