import { createSlice } from '@reduxjs/toolkit'

const careerSlice = createSlice({
  name: 'career',
  initialState: {
    recommendations: [],
    selectedCareer: null,
  },
  reducers: {
    updateRecommendations(state, action) {
      state.recommendations = action.payload
    },
    selectCareer(state, action) {
      state.selectedCareer = action.payload
    },
    clearRecommendations(state) {
      state.recommendations = []
      state.selectedCareer = null
    },
  },
})

export const { updateRecommendations, selectCareer, clearRecommendations } = careerSlice.actions
export default careerSlice.reducer
