const SongService = require('../services/song.service')

exports.getAllSongs = async (req, res, next) => {
  res.json(await SongService.findAll(req.pagination))
}

exports.getSongById = async (req, res, next) => {
  const id = parseInt(req.params.id)
  res.json(await SongService.findById(id))
}

exports.createSong = async (req, res, next) => {
  res.status(201).json(await SongService.create(req.body))
}

exports.updateSong = async (req, res, next) => {
  const id = parseInt(req.params.id)
  res.json(await SongService.update(id, req.body))
}

exports.deleteSong = async (req, res, next) => {
  const id = parseInt(req.params.id)
  res.json(await SongService.delete(id))
}