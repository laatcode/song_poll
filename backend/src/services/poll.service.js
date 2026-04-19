const Poll = require('../models/poll.model')
const CustomError = require('../errors/CustomError')

class PollService {
  static async findAll({ page, limit }) {
    const polls = await Poll.find(page, limit)
    const pollsWithSongs = await Promise.all(polls.map(async poll => {
      const songs = await Poll.findSongsById(poll.id)
      return { ...poll, songs }
    }))
    const total = await Poll.count()
    return {
      data: pollsWithSongs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  static async findById(id) {
    const poll = await Poll.findById(id)
    if (!poll) throw new CustomError(404, 'Poll not found')
    const songs = await Poll.findSongsById(poll.id)
    return { ...poll, songs }
  }

  static async findActive() {
    const polls = await Poll.findActive()
    return Promise.all(polls.map(async poll => {
      const songs = await Poll.findSongsById(poll.id)
      return { ...poll, songs }
    }))
  }

  static async create(data) {
    const pollId = await Poll.create(data)
    return this.findById(pollId)
  }

  static async update(id, data) {
    const poll = await this.findById(id)
    if (!poll) throw new CustomError(404, 'Poll not found')
    await Poll.update(id, {
      ...poll,
      statusId: data.statusId || poll.statusId,
      ...data
    })
    return this.findById(id)
  }

  static async delete(id) {
    const poll = await this.findById(id)
    if (!poll) throw new CustomError(404, 'Poll not found')
    return Poll.delete(id).then(() => ({ message: 'Poll deleted successfully' }))
  }

  static async addSongs(pollId, songIds) {
    const poll = await this.findById(pollId)
    if (!poll) throw new CustomError(404, 'Poll not found')
    await Poll.addSongs(pollId, songIds)
    return this.findById(pollId)
  }

  static async deleteSongs(pollId, songIds) {
    const poll = await this.findById(pollId)
    if (!poll) throw new CustomError(404, 'Poll not found')
    await Poll.deleteSongs(pollId, songIds)
    return this.findById(pollId)
  }
}

module.exports = PollService