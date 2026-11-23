const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authorization = req.headers.authorization
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : ''
  if (!token) return res.status(401).json({ message: 'Authorization token is required' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded.id) return res.status(401).json({ message: 'Invalid or expired token' })
    req.userId = decoded.id
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}
