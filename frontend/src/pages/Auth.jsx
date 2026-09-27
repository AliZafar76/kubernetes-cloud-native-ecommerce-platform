function Auth({ mode = 'login' }) {
  const register = mode === 'register'
  return <main className="auth-page"><div className="auth-card"><span className="brand-mark">S</span><p className="eyebrow">ShopNest account</p><h1>{register ? 'Join the nest.' : 'Welcome back.'}</h1><p className="muted-copy">{register ? 'Save favorites and make checkout faster.' : 'Sign in to pick up where you left off.'}</p><form onSubmit={(event) => event.preventDefault()}><label>{register && 'Name'}{register && <input required placeholder="Your name" />}</label><label>Email<input required type="email" placeholder="you@example.com" /></label><label>Password<input required type="password" placeholder="••••••••" /></label>{register && <label>Confirm password<input required type="password" placeholder="••••••••" /></label>}<button className="button button-cyan wide-button" type="submit">{register ? 'Create account' : 'Sign in'} <span>↗</span></button></form><p className="auth-note">UI only for now. Authentication will connect to the platform service in a future phase.</p></div></main>
}

export default Auth
