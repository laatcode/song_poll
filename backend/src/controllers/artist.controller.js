const CustomError = require('../errors/CustomError')
const Artist = require('../models/artist.model')

exports.getAllArtists = async (req, res, next) => {
  try {
    const artists = await Artist.find()
    res.json(artists)
  } catch (err) {
    next(err)
  }
}

exports.getArtistById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const artist = await Artist.findById(id)
    if (!artist) return next(new CustomError(404, 'Artist not found'))
    res.json(artist)
  } catch (err) {
    next(err)
  }
}

exports.createArtist = async (req, res, next) => {
  try {
    const artist = await Artist.create(req.body)
    res.status(201).json(artist)
  } catch (err) {
    next(err)
  }
}

exports.updateArtist = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const artist = await Artist.update(id, req.body)
    if (!artist) return next(new CustomError(404, 'Artist not found'))
    res.json(artist)
  } catch (err) {
    next(err)
  }
}

exports.deleteArtist = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const artist = await Artist.findById(id)
    if (!artist) return next(new CustomError(404, 'Artist not found'))
    const result = await Artist.delete(id)
    res.json(result)
  } catch (err) {
    next(err)
  }
}