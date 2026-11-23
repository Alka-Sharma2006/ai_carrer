const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  education: String,
  degree: String,
  specialization: String,
  academicYear: String,
  skills: { type: [String], default: [] },
  interests: { type: [String], default: [] },
  careerGoals: String,
  preferredDomains: { type: [String], default: [] },
  experienceLevel: String,
}, { timestamps: true })

module.exports = mongoose.model('Student', studentSchema)
