import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="container not-found">
      <span className="not-found-code">404</span>
      <h1>
        This page took
        <br />
        <em>a wrong turn.</em>
      </h1>
      <p>There is still plenty to discover.</p>
      <Link className="button button-primary" to="/">
        Return home
        <span>↗</span>
      </Link>
    </main>
  )
}

export default NotFound
