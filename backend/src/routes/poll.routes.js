const express = require('express')
const router = express.Router()
const { getAllPolls, createPoll, getPollById, updatePoll, deletePoll, addSongs, deleteSongs } = require('../controllers/poll.controller')
const validatorHandler = require('../middlewares/validatorHandler.middleware')
const pagination = require('../middlewares/pagination.middleware')
const { getPollSchema, createPollSchema, updatePollSchema, editSongsSchema  } = require('../validators/poll.validator')

router
    .get('/', pagination, getAllPolls)
    .get('/:id', validatorHandler(getPollSchema, 'params'), getPollById)
    .post('/', validatorHandler(createPollSchema, 'body'), createPoll)
    .patch('/:id', validatorHandler(getPollSchema, 'params'), validatorHandler(updatePollSchema, 'body'), updatePoll)
    .delete('/:id', validatorHandler(getPollSchema, 'params'), deletePoll)
    .post('/:id/songs', validatorHandler(getPollSchema, 'params'), validatorHandler(editSongsSchema, 'body'), addSongs)
    .delete('/:id/songs', validatorHandler(getPollSchema, 'params'), validatorHandler(editSongsSchema, 'body'), deleteSongs)

module.exports = router