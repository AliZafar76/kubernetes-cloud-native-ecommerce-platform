function SearchBar({ value, onChange }) { return <label className="search-field"><span aria-hidden="true">⌕</span><input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search the collection" aria-label="Search products" /></label> }

export default SearchBar
