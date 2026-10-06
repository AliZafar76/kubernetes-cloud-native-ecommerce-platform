import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import TestimonialsCarousel from '../components/TestimonialsCarousel'

const categoryCards = [
  { label: 'Home objects', value: 'Home', subtitle: 'Quiet upgrades for your space', tone: 'home', icon: '⌂' },
  { label: 'Modern tools', value: 'Technology', subtitle: 'Thoughtful tech for daily rituals', tone: 'tech', icon: '⌁' },
  { label: 'Everyday carry', value: 'Accessories', subtitle: 'Refined details you reach for', tone: 'style', icon: '◌' },
  { label: 'Wellness', value: 'Wellness', subtitle: 'Calm essentials for the day', tone: 'wellness', icon: '✦' },
]

const benefits = [
  { title: 'Fast shipping', text: 'Dispatched within 48 hours for in-stock favorites.', icon: '⚡' },
  { title: 'Premium quality', text: 'Curated materials, clean lines, and made-to-last finishes.', icon: '◆' },
  { title: 'Easy returns', text: 'A worry-free 30-day policy for everyday confidence.', icon: '↺' },
  { title: 'Secure checkout', text: 'Your details are protected end-to-end, every order.', icon: '⛊' },
]

const testimonials = [
  { name: 'Priya K.', role: 'Verified buyer', quote: 'The desk lamp alone changed how my whole workspace feels. Genuinely obsessed with the build quality.' },
  { name: 'Marcus T.', role: 'Verified buyer', quote: 'Fast shipping, zero fuss returns, and every piece looks better in person. My go-to for gifts now.' },
  { name: 'Elena R.', role: 'Verified buyer', quote: 'Finally a shop that curates instead of dumping a thousand options on you. Everything just works.' },
]

function Home({ products }) {
  const featured = products.slice(0, 4)
  const trending = [...products].reverse().slice(0, 6)
  const arrivals = products.slice(0, 8).reverse().slice(0, 4)
  const spotlight = products[1] || products[0]

  return (
    <>
      <Hero />

      <main className="page-shell">
        <section className="section container" id="featured">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow">Handpicked favorites</p>
              <h2>Made to be lived with.</h2>
            </div>
            <Link className="text-link" to="/products">
              View all products
              <span>→</span>
            </Link>
          </Reveal>

          <div className="featured-grid">
            {featured.map((product, index) => (
              <Reveal key={product.id} delay={index * 80}>
                <ProductCard product={product} featured />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="portal-section">
          <div className="container">
            <Reveal className="section-heading compact-heading">
              <div>
                <p className="eyebrow">Explore by category</p>
                <h2>Find your next favorite.</h2>
              </div>
            </Reveal>

            <div className="category-grid">
              {categoryCards.map((item, index) => (
                <Reveal key={item.value} delay={index * 70}>
                  <Link to={`/products?category=${encodeURIComponent(item.value)}`} className={`category-tile ${item.tone}`}>
                    <span className="category-icon">{item.icon}</span>
                    <span>{item.label}</span>
                    <small>{item.subtitle} →</small>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {trending.length > 0 && (
          <section className="trending-section">
            <div className="container">
              <Reveal className="section-heading">
                <div>
                  <p className="eyebrow">Right now</p>
                  <h2>Trending this week.</h2>
                </div>
                <Link className="text-link" to="/products">
                  Shop trending
                  <span>→</span>
                </Link>
              </Reveal>
            </div>

            <div className="trending-strip">
              {trending.map((product) => (
                <div className="trending-slide" key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        )}

        <Reveal as="section" className="promo-banner">
          <div className="container promo-inner">
            <p className="eyebrow">The edit, limited time</p>
            <h2>
              20% off
              <br />
              your first order.
            </h2>
            <p>Use code NEST20 at checkout. New arrivals restocked every Friday.</p>
            <Link className="button button-light" to="/products">
              Claim the offer
              <span>→</span>
            </Link>
          </div>
        </Reveal>

        {arrivals.length > 0 && (
          <section className="section container">
            <Reveal className="section-heading">
              <div>
                <p className="eyebrow">Just landed</p>
                <h2>New arrivals.</h2>
              </div>
              <Link className="text-link" to="/products">
                See everything
                <span>→</span>
              </Link>
            </Reveal>

            <div className="featured-grid arrivals-grid">
              {arrivals.map((product, index) => (
                <Reveal key={product.id} delay={index * 80}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {spotlight && (
          <section className="editorial-section container">
            <div className="editorial-inner">
              <Reveal className="editorial-image">
                <img src={spotlight.image_url} alt={spotlight.name} />
              </Reveal>
              <Reveal delay={120} className="editorial-copy">
                <p className="eyebrow">The showcase</p>
                <h2>
                  One piece,
                  <span className="gradient-text"> done right.</span>
                </h2>
                <p>
                  {spotlight.description || 'A considered object, built with better materials and a clearer point of view — the kind of thing you reach for every day.'}
                </p>
                <Link className="button button-primary" to={`/products/${spotlight.id}`}>
                  Shop {spotlight.name}
                  <span>→</span>
                </Link>
              </Reveal>
            </div>
          </section>
        )}

        <section className="feature-band">
          <div className="container feature-grid">
            {benefits.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 90} as="article" className="feature-card">
                <span className="feature-icon" aria-hidden="true">{feature.icon}</span>
                <span className="feature-number">0{index + 1}</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="testimonials-section">
          <div className="container">
            <Reveal className="section-heading compact-heading">
              <div>
                <p className="eyebrow">Word on the street</p>
                <h2>People keep coming back.</h2>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <TestimonialsCarousel testimonials={testimonials} />
            </Reveal>
          </div>
        </section>

        <Reveal as="section" className="newsletter-section">
          <div className="container newsletter-inner">
            <div>
              <p className="eyebrow">The good list</p>
              <h2>Notes on living well.</h2>
              <p>New arrivals, thoughtful finds, and little inspirations sent once a month.</p>
            </div>

            <form className="newsletter-form" onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input id="email" type="email" placeholder="you@example.com" />
              <button type="submit" className="button button-primary tiny-button">
                Join
              </button>
            </form>
          </div>
        </Reveal>

        <section className="final-cta-section">
          <div className="container final-cta-inner">
            <Reveal>
              <h2>
                Ready to upgrade
                <br />
                <span className="gradient-text">your everyday?</span>
              </h2>
              <Link className="button button-primary wide-button-alt" to="/products">
                Start shopping
                <span>→</span>
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  )
}

export default Home
