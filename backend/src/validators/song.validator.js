const joi = require('joi')

const id = joi.number().integer().positive()
const title = joi.string().min(3).max(40)
const artistId = joi.number().integer().positive()

const createSongSchema = joi.object({
  title: title.required(),
  artistId: artistId.required()
})

const updateSongSchema = joi.object({
  title: title,
  artistId: artistId
})

const getSongSchema = joi.object({
  id: id.required()
})

module.exports = { createSongSchema, updateSongSchema, getSongSchema }