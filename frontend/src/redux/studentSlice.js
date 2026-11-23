import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  profile: null,
  studentId: null,
}

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    updateProfile(state, action) {
      state.profile = action.payload
    },
    setStudentId(state, action) {
      state.studentId = action.payload
    },
    updateSkills(state, action) {
      if (state.profile) state.profile.skills = action.payload
    },
    updateInterests(state, action) {
      if (state.profile) state.profile.interests = action.payload
    },
    updateCareerGoals(state, action) {
      if (state.profile) state.profile.careerGoals = action.payload
    },
  },
})

export const { updateProfile, setStudentId, updateSkills, updateInterests, updateCareerGoals } = studentSlice.actions
export default studentSlice.reducer
