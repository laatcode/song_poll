const AuthService = require('../services/auth.service')

exports.register = async (req, res, next) => {
  res.status(201).json(await AuthService.register(req.body))
}

exports.login = async (req, res, next) => {
  res.json(await AuthService.login(req.body))
}