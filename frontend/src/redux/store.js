import { combineReducers, configureStore } from '@reduxjs/toolkit'
import studentReducer from './studentSlice'
import careerReducer from './careerSlice'
import roadmapReducer from './roadmapSlice'
import authReducer from './authSlice'

const combinedReducer = combineReducers({
  student: studentReducer,
  career: careerReducer,
  roadmap: roadmapReducer,
  auth: authReducer,
})

const rootReducer = (state, action) => {
  if (action.type === 'auth/logout') state = { auth: state.auth }
  return combinedReducer(state, action)
}

export const store = configureStore({
  reducer: rootReducer,
})
