const joi = require('joi')

const id = joi.number().integer().positive()
const name = joi.string().min(3).max(40)
const description = joi.string().min(3)
const statusId = joi.number().integer().valid(0, 1, 2)
const songId = joi.number().integer().positive()
const songs = joi.array().items(
  joi.object({
    songId: songId.required()
  })
).min(1)

const createPollSchema = joi.object({
  name: name.required(),
  description: description.required(),
  statusId: statusId,
  songs: songs.required()
}).required()

const updatePollSchema = joi.object({
  name: name,
  description: description,
  statusId: statusId
}).required()

const getPollSchema = joi.object({
  id: id.required()
}).required()

const editSongsSchema = joi.array().items({
  songId: songId.required()
}).min(1).required()

module.exports = { getPollSchema, createPollSchema, updatePollSchema, editSongsSchema }