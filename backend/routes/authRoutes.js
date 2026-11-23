const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

function signToken(user) {
  if (!process.env.JWT_SECRET) {
    const error = new Error('JWT_SECRET is not configured')
    error.status = 503
    throw error
  }
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email }
}

router.post('/register', async (req, res, next) => {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
    const password = typeof req.body?.password === 'string' ? req.body.password : ''

    if (!name) return res.status(400).json({ message: 'Name is required' })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(409).json({ message: 'An account with this email already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashedPassword })
    res.status(201).json({
      message: 'Registration successful',
      token: signToken(user),
      user: publicUser(user),
    })
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'An account with this email already exists' })
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
    const password = typeof req.body?.password === 'string' ? req.body.password : ''
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' })

    const user = await User.findOne({ email })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    res.json({
      message: 'Login successful',
      token: signToken(user),
      user: publicUser(user),
    })
  } catch (error) {
    next(error)
  }
})

router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user: publicUser(user) })
  } catch (error) {
    next(error)
  }
})

module.exports = router
