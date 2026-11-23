const mongoose = require('mongoose')

const roadmapSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  selectedCareer: String,
  phases: Array,
  completedTasks: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Roadmap', roadmapSchema)
