const ValidationError = require('../errors/ValidationError')
const CustomError = require('../errors/CustomError')
const Artist = require('../models/artist.model')

exports.getAllArtists = async (req, res, next) =>
  Artist.find()
    .then(artists => res.json(artists))
    .catch(err => next(err))

exports.getArtistById = async (req, res, next) => {
  const id = parseInt(req.params.id)
  Artist.findById(id)
    .then(artist => {
      if (!artist) return next(new CustomError(404, 'Artist not found'))
      res.json(artist)
    })
    .catch(err => next(err))
}

exports.createArtist = async (req, res, next) => {

  if (!req.body || !req.body.name)
    return next(new ValidationError([ '"name" is required']))

  Artist.create(req.body)
    .then(artist => res.status(201).json(artist))
    .catch(err => next(err))
}

exports.updateArtist = async (req, res, next) => {
  const id = parseInt(req.params.id)

  if (!req.body || !req.body.name)
    return next(new ValidationError([ '"name" is required']))

  Artist.update(id, req.body)
    .then(artist => {
      if (!artist) return next(new CustomError(404, 'Artist not found'))
      res.json(artist)
    })
    .catch(err => next(err))
}

exports.deleteArtist = async (req, res, next) => {
  const id = parseInt(req.params.id)

  Artist.findById(id)
    .then(artist => {
      if (!artist) return next(new CustomError(404, 'Artist not found'))
      Artist.delete(id)
        .then(result => {
          if (!result) return next()
          res.json(result)
        })
    })
    .catch(err => next(err))
}