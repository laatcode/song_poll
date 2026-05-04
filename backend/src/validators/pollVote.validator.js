const Joi = require('joi')

const songId = Joi.number().integer().positive()

const voteSchema = Joi.object({
  songId: songId.required()
}).required()

module.exports = {
  voteSchema
}