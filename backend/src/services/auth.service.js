const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config')
const User = require('../models/user.model')
const CustomError = require('../errors/CustomError')

class AuthService {
  static async register(data) {
    const existingUser = await User.findByUsername(data.username)
    if (existingUser) {
      throw new CustomError(400, 'Username already exists')
    }
    const userId = await User.create(data)
    const token = jwt.sign({ id: userId, username: data.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    return { token }
  }

  static async login(data) {
    const user = await User.findByUsername(data.username)
    if (!user) {
      throw new CustomError(401, 'Invalid credentials')
    }
    const isValid = await bcrypt.compare(data.password, user.password)
    if (!isValid) {
      throw new CustomError(401, 'Invalid credentials')
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    return { token }
  }
}

module.exports = AuthService