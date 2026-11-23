const express = require('express')
const Roadmap = require('../models/Roadmap')
const { generateText } = require('../services/geminiService')
const router = express.Router()

router.post('/roadmap', async (req, res, next) => {
  try {
    const { student, selectedCareer, missingSkills = [] } = req.body
    if (!student || !selectedCareer) return res.status(400).json({ message: 'Student profile and selected career are required' })
    const prompt = `Create a personalized 5-phase career learning roadmap as valid JSON only.
Student: ${JSON.stringify(student)}
Selected career: ${JSON.stringify(selectedCareer)}
Missing skills: ${JSON.stringify(missingSkills)}
Use exactly these phase titles: "Phase 1: Fundamentals", "Phase 2: Core Technical Skills", "Phase 3: Advanced Skills", "Phase 4: Practical Projects", "Phase 5: Interview Preparation".
Return {"title":"...","phases":[{"title":"...","duration":"2 weeks","topics":["..."],"tasks":["..."],"projects":["..."],"resources":["MDN","freeCodeCamp","official documentation"]}]}.
Use real learning resources and do not include markdown or comments.`
    const text = await generateText(prompt)
    const cleaned = text.replace(/```json|```/gi, '').trim()
    let roadmap
    try { roadmap = JSON.parse(cleaned) } catch {
      const error = new Error('Gemini returned an invalid roadmap format')
      error.status = 502
      throw error
    }
    if (!roadmap?.phases || roadmap.phases.length !== 5) {
      const error = new Error('Gemini did not return the required five roadmap phases')
      error.status = 502
      throw error
    }
    try {
      await Roadmap.create({
        studentId: student._id || undefined,
        selectedCareer: selectedCareer.title,
        phases: roadmap.phases,
      })
    } catch (saveError) {
      console.warn('Roadmap was generated but MongoDB could not save it:', saveError.message)
    }
    res.json({ roadmap })
  } catch (error) { next(error) }
})

router.post('/chat', async (req, res, next) => {
  try {
    const { message, profile, selectedCareer } = req.body
    if (!message?.trim()) return res.status(400).json({ message: 'Message is required' })
    const prompt = `You are CareerCompass AI, a supportive career guidance assistant.
Student context: ${JSON.stringify(profile || null)}
Selected career context: ${JSON.stringify(selectedCareer || null)}
Answer clearly and practically. Student question: ${message}`
    const reply = await generateText(prompt)
    res.json({ reply })
  } catch (error) { next(error) }
})

module.exports = router
