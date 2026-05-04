const router = require('express').Router()
const { getAllPolls, createPoll, getPollById, updatePoll, deletePoll, addSongs, deleteSongs, activate, deactivate } = require('../controllers/poll.controller')
const { vote, getResults } = require('../controllers/pollVote.controller')
const { getPollSchema, createPollSchema, updatePollSchema, editSongsSchema  } = require('../validators/poll.validator')
const { voteSchema } = require('../validators/pollVote.validator')
const validatorHandler = require('../middlewares/validatorHandler.middleware')
const pagination = require('../middlewares/pagination.middleware')
const auth = require('../middlewares/auth.middleware')

router
    .get('/', pagination, getAllPolls)
    .get('/votes', auth(), getResults)
    .get('/:id', validatorHandler(getPollSchema, 'params'), getPollById)
    .post('/', auth(), validatorHandler(createPollSchema, 'body'), createPoll)
    .patch('/:id', auth(), validatorHandler(getPollSchema, 'params'), validatorHandler(updatePollSchema, 'body'), updatePoll)
    .delete('/:id', auth(), validatorHandler(getPollSchema, 'params'), deletePoll)
    .post('/:id/songs', auth(), validatorHandler(getPollSchema, 'params'), validatorHandler(editSongsSchema, 'body'), addSongs)
    .delete('/:id/songs', auth(), validatorHandler(getPollSchema, 'params'), validatorHandler(editSongsSchema, 'body'), deleteSongs)
    .post('/activate', auth(), validatorHandler(getPollSchema, 'body'), activate)
    .post('/deactivate', auth(), validatorHandler(getPollSchema, 'body'), deactivate)
    .post('/vote', validatorHandler(voteSchema, 'body'), vote)

module.exports = router