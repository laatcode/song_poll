const joi = require('joi')

const id = joi.number().integer().positive()
const name = joi.string().min(3).max(40)

const createArtistSchema = joi.object({
  name: name.required()
})

const updateArtistSchema = joi.object({
  name: name.required()
})

const getArtistSchema = joi.object({
  id: id.required()
})

module.exports = { createArtistSchema, updateArtistSchema, getArtistSchema }