const express = require('express')
const router = express.Router()
const { register, login } = require('../controllers/auth.controller')
const validatorHandler = require('../middlewares/validatorHandler.middleware')
const { userSchema } = require('../validators/auth.validator')

router
  .post('/register', validatorHandler(userSchema, 'body'), register)
  .post('/login', validatorHandler(userSchema, 'body'), login)

module.exports = router