const CustomError = require('../errors/CustomError')
const PollService = require('../services/poll.service')

exports.getAllPolls = async (req, res, next) => {
  res.json(await PollService.findAll(req.pagination))
}

exports.getPollById = async (req, res, next) => {
  const id = parseInt(req.params.id)
  res.json(await PollService.findById(id))
}

exports.createPoll = async (req, res, next) => {
  res.status(201).json(await PollService.create(req.body))
}

exports.updatePoll = async (req, res, next) => {
  const id = parseInt(req.params.id)
  res.json(await PollService.update(id, req.body))
}

exports.deletePoll = async (req, res, next) => {
  const id = parseInt(req.params.id)
  res.json(await PollService.delete(id))
}

exports.addSongs = async (req, res, next) => {
  const pollId = parseInt(req.params.id)
  const songIds = req.body.map(song => song.songId)
  res.json(await PollService.addSongs(pollId, songIds))
}

exports.deleteSongs = async (req, res, next) => {
  const pollId = parseInt(req.params.id)
  const songIds = req.body.map(song => song.songId)
  res.json(await PollService.deleteSongs(pollId, songIds))
}