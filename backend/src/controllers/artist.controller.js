const CustomError = require('../errors/CustomError')
const ArtistService = require('../services/artist.service')

exports.getAllArtists = async (req, res, next) => {
  res.json(await ArtistService.findAll())
}

exports.getArtistById = async (req, res, next) => {
  const id = parseInt(req.params.id)
  res.json(await ArtistService.findById(id))
}

exports.createArtist = async (req, res, next) => {
  res.status(201).json(await ArtistService.create(req.body))
}

exports.updateArtist = async (req, res, next) => {
  const id = parseInt(req.params.id)
  res.json(await ArtistService.update(id, req.body))
}

exports.deleteArtist = async (req, res, next) => {
  const id = parseInt(req.params.id)
  res.json(await ArtistService.delete(id))
}