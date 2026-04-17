const Song = require('../models/song.model')
const Artist = require('../models/artist.model')
const CustomError = require('../errors/CustomError')

exports.getAllSongs = async (req, res, next) => {
  try {
    const songs = await Song.find()
    res.json(songs)
  } catch (err) {
    next(err)
  }
}

exports.getSongById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const song = await Song.findById(id)
    if (!song) return next(new CustomError(404, 'Song not found'))
    res.json(song)
  } catch (err) {
    next(err)
  }
}

exports.createSong = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.body.artistId)
    if (!artist) return next(new CustomError(404, 'Artist not found'))
    const song = await Song.create(req.body)
    res.status(201).json(song)
  } catch (err) {
    next(err)
  }
}

exports.updateSong = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const artist = await Artist.findById(req.body.artistId)
    if (!artist) return next(new CustomError(404, 'Artist not found'))
    const song = await Song.update(id, req.body)
    if (!song) return next(new CustomError(404, 'Song not found'))
    res.json(song)
  } catch (err) {
    next(err)
  }
}

exports.deleteSong = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const song = await Song.findById(id)
    if (!song) return next(new CustomError(404, 'Song not found'))
    const result = await Song.delete(id)
    res.json(result)
  } catch (err) {
    next(err)
  }
}