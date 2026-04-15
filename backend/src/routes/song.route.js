const router = require('express').Router()
const validatorHandler = require('../middlewares/validatorHandler.middleware')
const { getAllSongs, getSongById, createSong, updateSong, deleteSong } = require('../controllers/song.controller')
const { createSongSchema, updateSongSchema, getSongSchema } = require('../validators/song.validator')

router
    .get('/', getAllSongs)
    .get('/:id', validatorHandler(getSongSchema, 'params'), getSongById)
    .post('/', validatorHandler(createSongSchema, 'body'), createSong)
    .patch('/:id', validatorHandler(getSongSchema, 'params'), validatorHandler(updateSongSchema, 'body'), updateSong)
    .delete('/:id', validatorHandler(getSongSchema, 'params'), deleteSong)

module.exports = router