const router = require('express').Router()
const { getAllArtists, getArtistById, createArtist, updateArtist, deleteArtist } = require('../controllers/artist.controller')
const validatorHandler = require('../middlewares/validatorHandler.middleware')
const { createArtistSchema, updateArtistSchema, getArtistSchema } = require('../validators/artist.validator')

router
    .get('/', getAllArtists)
    .get('/:id', validatorHandler(getArtistSchema, 'params'), getArtistById)
    .post('/', validatorHandler(createArtistSchema, 'body'), createArtist)
    .patch('/:id', validatorHandler(getArtistSchema, 'params'), validatorHandler(updateArtistSchema, 'body'), updateArtist)
    .delete('/:id', validatorHandler(getArtistSchema, 'params'), deleteArtist)

module.exports = router