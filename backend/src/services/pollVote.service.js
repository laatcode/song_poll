const PollVote = require('../models/pollVote.model')
const Poll = require('../models/poll.model')
const CustomError = require('../errors/CustomError')

class PollVoteService {
  static async vote(songId, ipAddress, userAgent) {
    const pollId = await Poll.getActivePollId()
    if (!pollId) {
      throw new CustomError(404, 'There are no active surveys at the moment')
    }
    const hasVoted = await PollVote.hasVoted(pollId, ipAddress, userAgent)
    if (hasVoted) {
      throw new CustomError(409, 'You have already voted in this poll')
    }
    const songExists = await PollVote.checkSongExists(pollId, songId)
    if (!songExists) {
      throw new CustomError(400, 'Song not found')
    }
    await PollVote.create({ pollId, songId, ipAddress, userAgent })
    return { message: 'Vote registered successfully' }
  }

  static async getResults(pollId) {
    if (!pollId) {
      throw new CustomError(404, 'There are no active surveys at the moment')
    }
    const poll = await Poll.findById(pollId)
    if (!poll) {
      throw new CustomError(404, 'Poll not found')
    }
    const votes = await PollVote.findByPollId(pollId)
    const totalVotes = await PollVote.countByPollId(pollId)
    return {
      poll,
      votes: votes.map(vote => ({
        songId: vote.songId,
        votes: parseInt(vote.votes),
        percentage: parseInt(totalVotes > 0 ? ((parseInt(vote.votes) / totalVotes) * 100).toFixed(2) : 0)
      })),
      totalVotes
    }
  }

  static async getActivePollId() {
    return await Poll.getActivePollId()
  }

  static async setActivePoll(pollId) {
    const poll = await Poll.findById(pollId)
    if (!poll) {
      throw new CustomError(404, 'Poll not found')
    }
    return await Poll.setActivePoll(pollId)
  }

  static async setInactivePoll(pollId) {
    const poll = await Poll.findById(pollId)
    if (!poll) {
      throw new CustomError(404, 'Poll not found')
    }
    return await Poll.setInactivePoll(pollId)
  }
}

module.exports = PollVoteService