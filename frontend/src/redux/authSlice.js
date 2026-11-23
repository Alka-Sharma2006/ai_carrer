import { createSlice } from '@reduxjs/toolkit'

const initialState = (() => {
  try {
    const storedAuth = localStorage.getItem('careercompass_auth')
    const parsedAuth = storedAuth ? JSON.parse(storedAuth) : null
    return parsedAuth && typeof parsedAuth === 'object'
      ? { user: parsedAuth.user || null, token: parsedAuth.token || null }
      : { user: null, token: null }
  } catch {
    return { user: null, token: null }
  }
})()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload.user
      state.token = action.payload.token
      try {
        localStorage.setItem('careercompass_auth', JSON.stringify({
          user: action.payload.user,
          token: action.payload.token,
        }))
      } catch {}
    },
    logout(state) {
      state.user = null
      state.token = null
      try {
        localStorage.removeItem('careercompass_auth')
      } catch {}
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
