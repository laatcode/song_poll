const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')
const CustomError = require('../errors/CustomError')

module.exports = () => (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new CustomError(401, 'No token provided')
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new CustomError(401, 'Token expired')
    }
    if (error.name === 'JsonWebTokenError') {
      throw new CustomError(401, 'Invalid token')
    }
    throw error
  }
}