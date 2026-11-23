import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { loginSuccess } from '../redux/authSlice'
import { loginUser, registerUser } from '../services/api'
import LoadingIndicator from '../components/LoadingIndicator'
import './Login.css'

export default function Login() {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)
  const location = useLocation()
  const navigate = useNavigate()
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem('careercompass_registered') === null ? 'register' : 'login'
    } catch {
      return 'register'
    }
  })
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState(location.state?.message || '')

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const switchMode = (nextMode) => {
    setMode(nextMode)
    setError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    if (mode === 'register' && !form.name.trim()) return setError('Please enter your full name.')
    if (!form.email.trim()) return setError('Please enter your email address.')
    if (!form.password) return setError('Please enter your password.')
    if (mode === 'register' && form.password.length < 6) {
      return setError('Password must be at least 6 characters.')
    }

    setError('')
    setLoading(true)
    try {
      if (mode === 'register') {
        await registerUser(form)
        try {
          localStorage.setItem('careercompass_registered', '1')
        } catch {}
        setMode('login')
        setForm((current) => ({ ...current, password: '' }))
        setNotice('Registration successful. Please login to continue.')
      } else {
        const response = await loginUser({ email: form.email, password: form.password })
        try {
          localStorage.setItem('careercompass_registered', '1')
        } catch {}
        dispatch(loginSuccess({ user: response.user, token: response.token }))
        navigate(location.state?.from || '/', { replace: true })
      }
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setLoading(false)
    }
  }

  if (token) return <Navigate to="/" replace />

  return (
    <div className="form-layout">
      <aside className="form-intro">
        <span className="eyebrow">CareerCompass AI</span>
        <h1>Build your <span>career path.</span></h1>
        <p>Sign in or create an account to keep your career profile and plans together.</p>
      </aside>
      <div className="auth-panel">
        <div className="auth-card">
          <div className="auth-tabs" role="tablist" aria-label="Account access">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>Login</button>
            <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => switchMode('register')}>Register</button>
          </div>
          <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p className="auth-switch">{mode === 'login' ? 'Continue your career journey.' : 'Start planning your next steps.'}</p>
          {notice && <div className="auth-notice">{notice}</div>}
          <form className="auth-form" onSubmit={submit} noValidate>
            {error && <div className="error-box">{error}</div>}
            {mode === 'register' && (
              <label>Full name
                <input name="name" type="text" autoComplete="name" value={form.name} onChange={change} required />
              </label>
            )}
            <label>Email
              <input name="email" type="email" autoComplete="email" value={form.email} onChange={change} required />
            </label>
            <label>Password
              <input name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={form.password} onChange={change} required minLength={mode === 'register' ? 6 : undefined} />
            </label>
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? <LoadingIndicator text="Please wait..." /> : mode === 'login' ? 'Login' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
