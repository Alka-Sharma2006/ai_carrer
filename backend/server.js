require('dotenv').config()
const dns = require('node:dns')
dns.setServers(['8.8.8.8', '1.1.1.1'])
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const studentRoutes = require('./routes/studentRoutes')
const careerRoutes = require('./routes/careerRoutes')
const aiRoutes = require('./routes/aiRoutes')
const auth = require('./middleware/auth')
const authRoutes = require('./routes/authRoutes')
const errorHandler = require('./middleware/errorHandler')

const app = express()
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/students', auth, studentRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/careers', auth, careerRoutes)
app.use('/api/ai', auth, aiRoutes)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
connectDB()
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.warn(`MongoDB unavailable: ${error.message}`))

if (require.main === module) {
  app.listen(PORT, (error) => {
    if (error) {
      console.error(`Server could not start on port ${PORT}: ${error.message}`)
      process.exit(1)
    }
    console.log(`CareerCompass backend running on port ${PORT}`)
  })
}

module.exports = app