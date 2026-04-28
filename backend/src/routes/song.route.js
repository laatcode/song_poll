const router = require('express').Router()
const validatorHandler = require('../middlewares/validatorHandler.middleware')
const pagination = require('../middlewares/pagination.middleware')
const { getAllSongs, getSongById, createSong, updateSong, deleteSong } = require('../controllers/song.controller')
const { createSongSchema, updateSongSchema, getSongSchema } = require('../validators/song.validator')
const auth = require('../middlewares/auth.middleware')

router
    .get('/', pagination, getAllSongs)
    .get('/:id', validatorHandler(getSongSchema, 'params'), getSongById)
    .post('/', auth(), validatorHandler(createSongSchema, 'body'), createSong)
    .patch('/:id', auth(), validatorHandler(getSongSchema, 'params'), validatorHandler(updateSongSchema, 'body'), updateSong)
    .delete('/:id', auth(), validatorHandler(getSongSchema, 'params'), deleteSong)

module.exports = router