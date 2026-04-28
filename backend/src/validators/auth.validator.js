const Joi = require('joi')

const id = Joi.number().integer().positive()
const username = Joi.string().min(3).max(20)
const password = Joi.string().min(6).max(50)

const userSchema = Joi.object({
  username: username.required(),
  password: password.required()
}).required()

module.exports = {
  userSchema
}