import { Link } from 'react-router-dom'

function Footer() {
  return <footer className="site-footer"><div className="container footer-grid"><div><Link className="brand footer-brand" to="/"><span className="brand-mark">S</span><span>ShopNest</span></Link><p className="footer-note">Objects for a considered everyday.</p></div><div className="footer-links"><div><strong>Explore</strong><Link to="/products">All products</Link><Link to="/">Our story</Link></div><div><strong>Support</strong><a href="mailto:hello@shopnest.example">Contact</a><a href="/">Shipping & returns</a></div></div></div><div className="container footer-bottom"><span>© 2026 ShopNest</span><span>Designed for the everyday.</span></div></footer>
}

export default Footer
