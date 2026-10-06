import { Link } from 'react-router-dom'
import AnimatedCounter from './AnimatedCounter'

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-blob hero-blob-1" aria-hidden="true" />
      <div className="hero-blob hero-blob-2" aria-hidden="true" />

      <div className="container hero-content">
        <div className="hero-copy">
          <p className="eyebrow hero-kicker">✦ Curated essentials, SS26 collection</p>
          <h1>
            Thoughtful design for
            <span className="gradient-text"> everyday rituals.</span>
          </h1>
          <p className="hero-description">
            Discover pieces that feel polished, useful, and quietly luxurious — the kind of objects
            that make your home, desk, and routine feel elevated.
          </p>

          <div className="hero-actions">
            <Link className="button button-primary" to="/products">
              Shop the collection
              <span>→</span>
            </Link>
            <Link className="button button-ghost" to="/categories">
              Explore categories
            </Link>
          </div>

          <div className="hero-meta">
            <div>
              <strong><AnimatedCounter value={12} suffix="K+" /></strong>
              <span>happy shoppers</span>
            </div>
            <div>
              <strong><AnimatedCounter value={4.9} decimals={1} suffix="/5" /></strong>
              <span>average rating</span>
            </div>
            <div>
              <strong>Free</strong>
              <span>shipping over $100</span>
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-label="Featured lifestyle product arrangement">
          <div className="hero-feature-card hero-card-main">
            <img
              src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1200&q=85"
              alt="Modern minimal desk workspace"
            />
          </div>

          <div className="hero-feature-card hero-card-floating hero-card-top">
            <span>New drop</span>
            <strong>Atelier Desk Lamp</strong>
            <small>$189.00</small>
          </div>

          <div className="hero-feature-card hero-card-floating hero-card-bottom">
            <div className="mini-pill">
              <span className="dot" />
              Ready to ship
            </div>
            <strong>Handpicked pieces</strong>
          </div>
        </div>
      </div>

      <div className="hero-scroll-cue" aria-hidden="true">
        <span />
      </div>
    </section>
  )
}

export default Hero
