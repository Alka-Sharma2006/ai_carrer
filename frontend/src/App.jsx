import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import Recommendations from './pages/Recommendations'
import CareerDetails from './pages/CareerDetails'
import SkillGap from './pages/SkillGap'
import Roadmap from './pages/Roadmap'
import Chat from './pages/Chat'
import Login from './pages/Login'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Landing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/career-details" element={<CareerDetails />} />
          <Route path="/skill-gap" element={<SkillGap />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/chat" element={<Chat />} />
        </Route>
      </Route>
    </Routes>
  )
}
