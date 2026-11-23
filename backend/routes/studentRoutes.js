const express = require('express')
const Student = require('../models/Student')
const router = express.Router()

router.post('/', async (req, res, next) => {
  try {
    if (!req.body.name?.trim()) return res.status(400).json({ message: 'Name is required' })
    if (!req.body.skills?.length) return res.status(400).json({ message: 'Select at least one skill' })
    const student = await Student.create(req.body)
    res.status(201).json({ message: 'Profile created', student })
  } catch (error) { next(error) }
})

router.get('/:id', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
    if (!student) return res.status(404).json({ message: 'Student not found' })
    res.json({ student })
  } catch (error) { next(error) }
})

router.put('/:id', async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!student) return res.status(404).json({ message: 'Student not found' })
    res.json({ message: 'Profile updated', student })
  } catch (error) { next(error) }
})

module.exports = router
