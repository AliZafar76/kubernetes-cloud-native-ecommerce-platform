function CategoryFilter({ categories, value, onChange }) { return <select className="select-field" value={value} onChange={(event) => onChange(event.target.value)} aria-label="Filter by category"><option value="All">All categories</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select> }

export default CategoryFilter
