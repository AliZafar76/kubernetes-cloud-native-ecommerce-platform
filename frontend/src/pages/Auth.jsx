import { useState } from 'react'

function Auth({ mode = 'login' }) {
  const register = mode === 'register'
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-badge">S</div>
        <p className="eyebrow">ShopNest account</p>
        <h1>{register ? 'Join the nest.' : 'Welcome back.'}</h1>
        <p className="muted-copy">
          {register ? 'Save favorites and make checkout faster.' : 'Sign in to pick up where you left off.'}
        </p>

        <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
          {register && (
            <label className="field">
              <span>Name</span>
              <input required placeholder="Your name" />
            </label>
          )}

          <label className="field">
            <span>Email</span>
            <input required type="email" placeholder="you@example.com" />
          </label>

          <label className="field">
            <span>Password</span>
            <div className="password-field">
              <input required type={showPassword ? 'text' : 'password'} placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label="Toggle password visibility">
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          {register && (
            <label className="field">
              <span>Confirm password</span>
              <div className="password-field">
                <input required type={showConfirm ? 'text' : 'password'} placeholder="••••••••" />
                <button type="button" onClick={() => setShowConfirm((current) => !current)} aria-label="Toggle confirm password visibility">
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>
          )}

          <button className="button button-primary wide-button" type="submit">
            {register ? 'Create account' : 'Sign in'}
            <span>↗</span>
          </button>
        </form>

        <p className="auth-note">UI-only for now. Authentication will connect to the platform service in a future phase.</p>
      </div>
    </main>
  )
}

export default Auth
