import { Link } from 'react-router-dom'

const categories = [
  ['Technology', 'Connected tools for a sharper everyday.', '⌁'],
  ['Accessories', 'Small details with a point of view.', '◇'],
  ['Home', 'Atmosphere, comfort, and useful beauty.', '◌'],
  ['Stationery', 'Ideas deserve a good place to land.', '▤'],
  ['Wellness', 'Rituals that make room for yourself.', '✦'],
]

function Categories() {
  return <main className="container collection-page"><div className="page-intro"><p className="eyebrow">Shop by category</p><h1>Find your<br /><em>frequency.</em></h1><p>Explore considered objects across the things that shape your day.</p></div><div className="category-directory">{categories.map(([name, copy, icon], index) => <Link className={`directory-card directory-${index + 1}`} key={name} to={`/products?category=${name}`}><span className="directory-icon">{icon}</span><div><p className="eyebrow">0{index + 1}</p><h2>{name}</h2><p>{copy}</p><span className="directory-link">Explore collection ↗</span></div></Link>)}</div></main>
}

export default Categories
