const Song = require('../models/song.model')
const Artist = require('../models/artist.model')
const CustomError = require('../errors/CustomError')
const ValidationError = require('../errors/ValidationError')

exports.getAllSongs = async (req, res, next) =>
  Song.find()
    .then(songs => res.json(songs))
    .catch(err => next(err))

exports.getSongById = async (req, res, next) => {
  const id = parseInt(req.params.id)
  Song.findById(id)
    .then(song => {
      if (!song) return next(new CustomError(404, 'Song not found'))
      res.json(song)
    })
    .catch(err => next(err))
}

exports.createSong = async (req, res, next) => {

  if (!req.body)
    return next(new ValidationError([ '"title" is required']))

  const artist = await Artist.findById(req.body.artistId).then((artist) => artist)
  if (!artist) return next(new CustomError(404, 'Artist not found'))

  Song.create(req.body)
    .then(song => res.status(201).json(song))
    .catch(err => next(err))
}

exports.updateSong = async (req, res, next) => {
  const id = parseInt(req.params.id)

  if (!req.body)
    return next(new ValidationError([ '"title" is required']))

  const artist = await Artist.findById(req.body.artistId).then((artist) => artist)
  if (!artist) return next(new CustomError(404, 'Artist not found'))

  Song.update(id, req.body)
    .then(song => {
      if (!song) return next(new CustomError(404, 'Song not found'))
      res.json(song)
    })
    .catch(err => next(err))
}

exports.deleteSong = async (req, res, next) => {
  const id = parseInt(req.params.id)

  Song.findById(id)
    .then(song => {
      if (!song) return next(new CustomError(404, 'Song not found'))
      Song.delete(id)
        .then(result => {
          if (!result) return next()
          res.json(result)
        })
    })
    .catch(err => next(err))
}