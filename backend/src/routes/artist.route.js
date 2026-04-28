const router = require('express').Router()
const { getAllArtists, getArtistById, createArtist, updateArtist, deleteArtist } = require('../controllers/artist.controller')
const validatorHandler = require('../middlewares/validatorHandler.middleware')
const pagination = require('../middlewares/pagination.middleware')
const { createArtistSchema, updateArtistSchema, getArtistSchema } = require('../validators/artist.validator')
const auth = require('../middlewares/auth.middleware')

router
    .get('/', pagination, getAllArtists)
    .get('/:id', validatorHandler(getArtistSchema, 'params'), getArtistById)
    .post('/', auth(), validatorHandler(createArtistSchema, 'body'), createArtist)
    .patch('/:id', auth(), validatorHandler(getArtistSchema, 'params'), validatorHandler(updateArtistSchema, 'body'), updateArtist)
    .delete('/:id', auth(), validatorHandler(getArtistSchema, 'params'), deleteArtist)

module.exports = router