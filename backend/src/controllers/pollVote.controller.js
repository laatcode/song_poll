const PollVoteService = require('../services/pollVote.service')

exports.vote = async (req, res, next) => {
  const songId = req.body.songId
  res.json(await PollVoteService.vote(songId, req.ip, req.get('user-agent')))
}

exports.getResults = async (req, res, next) => {
  const pollId = await PollVoteService.getActivePollId()
  res.json(await PollVoteService.getResults(pollId))
}