const Poll = require('../models/poll.model')
const CustomError = require('../errors/CustomError')
const ValidationError = require('../errors/ValidationError')

exports.getAllPolls = async (req, res, next) => {
  try {
    const polls = await Poll.find()
    const songs = await Promise.all(polls.map(async poll => {
      const songs = await Poll.findSongsById(poll.id)
      return { ...poll, songs }
    }))
    res.json(songs)
  } catch (error) {
    next(error)
  }
}

exports.getPollById = async (req, res, next) => {
  try {
    const poll = await Poll.findById(req.params.id)
    if (!poll) {
      throw new CustomError(404, 'Poll not found')
    }
    const songs = await Poll.findSongsById(poll.id)
    res.json({ ...poll, songs })
  } catch (error) {
    next(error)
  }
}

exports.createPoll = async (req, res, next) => {
  if (!req.body)
    return next(new ValidationError([ '"name" is required']))

  Poll.create(req.body)
    .then(async poll => {
      const songs = await Poll.findSongsById(poll.id)
      res.status(201).json({ ...poll, songs })
    })
    .catch(err => next(err))
}

exports.updatePoll = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const poll = await Poll.findById(req.params.id)
    if (!poll) {
      throw new CustomError(404, 'Poll not found')
    }
    let pollUpdated = { ...poll, status_id: req.body.statusId || poll.statusId, ...req.body }
    pollUpdated = await Poll.update(id, pollUpdated)
    pollUpdated.songs = await Poll.findSongsById(id)
    res.json(pollUpdated)
  } catch (error) {
    next(error)
  }
}

exports.deletePoll = async (req, res, next) => {
  const id = parseInt(req.params.id)
  Poll.findById(id)
    .then(poll => {
      if (!poll) return next(new CustomError(404, 'Poll not found'))
      Poll.delete(id)
        .then(result => {
          if (!result) return next()
          res.json(result)
        })
    })
    .catch(err => next(err))
}

exports.addSongs = async (req, res, next) => {
  const pollId = parseInt(req.params.id)
  try {
    const poll = await Poll.findById(pollId)
    if (!poll) {
      return next(new CustomError(404, 'Poll not found'))
    }

    const songIds = req.body.map(song => song.songId)
    await Poll.addSongs(pollId, songIds)
    poll.songs = await Poll.findSongsById(pollId)
    res.json(poll)
  } catch (error) {
    next(error)
  }
}

exports.deleteSongs = async (req, res, next) => {
  const pollId = parseInt(req.params.id)
  try {
    const poll = await Poll.findById(pollId)
    if (!poll) {
      return next(new CustomError(404, 'Poll not found'))
    }

    const songIds = req.body.map(song => song.songId)
    await Poll.deleteSongs(pollId, songIds)
    poll.songs = await Poll.findSongsById(pollId)
    res.json(poll)
  } catch (error) {
    next(error)
  }
}