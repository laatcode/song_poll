const pool = require('../../db/config')
const CustomError = require('../errors/CustomError')

class PollVote {
  static async create(data) {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()
      await connection.query('INSERT INTO poll_votes (poll_id, song_id, ip_address, user_agent) VALUES (?, ?, ?, ?)', [data.pollId, data.songId, data.ipAddress, data.userAgent])
      await connection.commit()
    } catch (error) {
      await connection.rollback()
      if (error.errno === 1062) {
        throw new CustomError(409, 'You have already voted in this poll')
      }
      if (error.errno === 1452) {
        throw new CustomError(400, 'Song not found')
      }
      throw error
    } finally {
      connection.release()
    }
  }

  static async findByPollId(pollId) {
    return pool.query(`SELECT song_id AS songId, COUNT(*) as votes FROM poll_votes WHERE poll_id = ?  GROUP BY song_id`, [pollId])
      .then(([rows]) => rows)
  }

  static async countByPollId(pollId) {
    return pool.query('SELECT COUNT(*) as total FROM poll_votes WHERE poll_id = ?', [pollId])
      .then(([rows]) => rows[0].total)
  }

  static async hasVoted(pollId, ipAddress, userAgent) {
    return pool.query('SELECT COUNT(*) as count FROM poll_votes WHERE poll_id = ? AND ip_address = ? AND user_agent = ?', [pollId, ipAddress, userAgent])
      .then(([rows]) => rows[0].count > 0)
  }

  static async checkSongExists(pollId, songId) {
    return pool.query('SELECT song_id as songId FROM polls_songs WHERE poll_id = ? AND song_id = ?', [pollId, songId])
      .then(([rows]) => rows[0] ? true : false)
  }
}

module.exports = PollVote