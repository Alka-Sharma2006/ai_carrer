import { NavLink, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../redux/authSlice'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token)
  const user = useSelector((state) => state.auth.user)

  const signOut = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link className="brand" to="/">
        <span className="brand-mark">C</span>
        <span>CareerCompass <b>AI</b></span>
      </Link>
      <div className="nav-links">
        {token
          ? <>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/profile">Profile</NavLink>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/chat">AI Chat</NavLink>
              {user && <span className="nav-user">Hi, {user.name.split(' ')[0]}</span>}
              <button className="nav-logout" type="button" onClick={signOut}>Logout</button>
            </>
          : <NavLink to="/login">Login</NavLink>}
      </div>
    </nav>
  )
}
