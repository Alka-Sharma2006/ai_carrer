import { store } from '../redux/store'
import { logout } from '../redux/authSlice'

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '')

async function request(path, options = {}) {
  const token = store.getState().auth.token
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  const data = await response.json().catch(() => ({}))
  if (response.status === 401 && !path.startsWith('/api/auth/')) store.dispatch(logout())
  if (!response.ok) throw new Error(data.message || 'Request failed')
  return data
}

export const createStudent = (profile) =>
  request('/api/students', { method: 'POST', body: JSON.stringify(profile) })
export const getCareers = () => request('/api/careers')
export const recommendCareersApi = (profile) =>
  request('/api/careers/recommend', { method: 'POST', body: JSON.stringify(profile) })
export const generateRoadmap = (payload) =>
  request('/api/ai/roadmap', { method: 'POST', body: JSON.stringify(payload) })
export const sendChatMessage = (payload) =>
  request('/api/ai/chat', { method: 'POST', body: JSON.stringify(payload) })
export const registerUser = (data) =>
  request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) })
export const loginUser = (data) =>
  request('/api/auth/login', { method: 'POST', body: JSON.stringify(data) })
