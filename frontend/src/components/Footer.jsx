import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand-col">
          <Link className="brand footer-brand" to="/">
            <span className="brand-mark">S</span>
            <span>ShopNest</span>
          </Link>
          <p className="footer-note">Objects for a considered everyday — picked with care, made to last.</p>
          <div className="footer-social" aria-label="Social links">
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Pinterest">PI</a>
            <a href="#" aria-label="TikTok">TT</a>
          </div>
        </div>

        <div className="footer-links">
          <div>
            <strong>Shop</strong>
            <Link to="/products">All products</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/wishlist">Wishlist</Link>
          </div>

          <div>
            <strong>Company</strong>
            <Link to="/about">Our story</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/login">Account</Link>
          </div>

          <div>
            <strong>Get in touch</strong>
            <a href="mailto:akashaalizafar@gmail.com">akashaalizafar@gmail.com</a>
            <a href="tel:+923131717561">+92-3131717561</a>
          </div>
        </div>

        <div className="footer-newsletter">
          <strong>Stay in the loop</strong>
          <p>Fresh drops, stories, and inspiration for the week ahead.</p>
          <form className="mini-newsletter" onSubmit={(event) => event.preventDefault()}>
            <input type="email" placeholder="Your email" aria-label="Your email" />
            <button type="submit" className="button button-primary tiny-button">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 ShopNest — All rights reserved.</span>
        <span>Designed for the everyday.</span>
      </div>
    </footer>
  )
}

export default Footer
