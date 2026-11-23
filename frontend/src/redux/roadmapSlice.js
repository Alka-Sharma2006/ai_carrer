import { createSlice } from '@reduxjs/toolkit'

const roadmapSlice = createSlice({
  name: 'roadmap',
  initialState: {
    roadmap: null,
    completedTasks: [],
  },
  reducers: {
    setRoadmap(state, action) {
      state.roadmap = action.payload
    },
    toggleTask(state, action) {
      const taskId = action.payload
      state.completedTasks = state.completedTasks.includes(taskId)
        ? state.completedTasks.filter((id) => id !== taskId)
        : [...state.completedTasks, taskId]
    },
  },
})

export const { setRoadmap, toggleTask } = roadmapSlice.actions
export default roadmapSlice.reducer
