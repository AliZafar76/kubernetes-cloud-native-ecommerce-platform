import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CategoryFilter from '../components/CategoryFilter'
import ErrorState from '../components/ErrorState'
import LoadingState from '../components/LoadingState'
import ProductGrid from '../components/ProductGrid'
import SearchBar from '../components/SearchBar'

function Products({ products, loading, error, onRetry }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')
  const category = searchParams.get('category') || 'All'
  const categories = [...new Set(products.map((product) => product.category).filter(Boolean))]
  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === 'All' || product.category === category
    const matchesSearch = `${product.name} ${product.description}`.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  }).sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : 0), [products, category, search, sort])
  return <main className="products-page container"><div className="page-intro"><p className="eyebrow">The collection</p><h1>Objects with<br /><em>intention.</em></h1><p>Curated essentials for a more considered everyday.</p></div><div className="catalog-toolbar"><SearchBar value={search} onChange={setSearch} /><CategoryFilter categories={categories} value={category} onChange={(value) => setSearchParams(value === 'All' ? {} : { category: value })} /><select className="select-field" value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option value="featured">Sort: Featured</option><option value="low">Price: Low to high</option><option value="high">Price: High to low</option></select></div>{loading ? <LoadingState /> : error ? <ErrorState onRetry={onRetry} /> : <><div className="results-line"><span>{visibleProducts.length} objects</span>{search && <span>Results for “{search}”</span>}</div><ProductGrid products={visibleProducts} /></>}</main>
}

export default Products
