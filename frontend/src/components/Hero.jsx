import { Link } from 'react-router-dom'

function Hero() {
  return <section className="hero-section"><div className="container hero-content"><div className="hero-copy reveal"><p className="eyebrow">The new everyday / 2026</p><h1>Good things,<br /><em>well chosen.</em></h1><p className="hero-description">A refined collection of objects that bring a little more intention to the way you live, work, and wind down.</p><div className="hero-actions"><Link className="button button-dark" to="/products">Shop the collection <span>↗</span></Link><a className="text-link" href="#featured">Explore featured <span>↓</span></a></div></div><div className="hero-art reveal"><div className="hero-image"><img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=85" alt="Warmly lit, minimal desk workspace" /></div><div className="hero-stamp">CURATED<br />WITH CARE</div><div className="hero-caption"><span>01 / 04</span><span>Objects with a point of view</span></div></div></div></section>
}

export default Hero
