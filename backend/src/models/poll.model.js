const pool = require('../../db/config')
const ValidationError = require('../errors/ValidationError')

class Poll {

  static find(page = 1, limit = 10) {
    const offset = (page - 1) * limit
    return pool.query('SELECT id, name, description, status_id AS statusId FROM polls LIMIT ? OFFSET ?', [limit, offset])
      .then(([rows]) => rows)
  }

  static count() {
    return pool.query('SELECT COUNT(*) as total FROM polls')
      .then(([rows]) => rows[0].total)
  }

  static findById(id) {
    return pool.query('SELECT id, name, description, status_id AS statusId FROM polls WHERE id = ?', [id])
      .then(([rows]) => rows[0])
  }

  static findSongsById(id) {
    return pool.query('SELECT song_id AS songId FROM polls_songs WHERE poll_id = ?', [id])
      .then(([rows]) => rows)
  }

  static async create(data) {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()
      const [result] = await connection.query('INSERT INTO polls (name, description) VALUES (?, ?)', [data.name, data.description])
      const pollId = result.insertId
      for(const song of data.songs) {
        try {
          await connection.query('INSERT INTO polls_songs (poll_id, song_id) VALUES (?, ?)', [pollId, song.songId])
        } catch (error) {
          if (error.errno === 1062) {
            // do nothing, the song is already in the poll
            continue
          }
          await connection.rollback()
          if (error.errno === 1452) {
            throw new ValidationError(`Song with id ${song.songId} does not exist`)
          }
          throw error
        }
      }
      await connection.commit()
      return pollId
    } catch (err) {
      throw err
    } finally {
      connection.release()
    }
  }

  static update(id, data) {
    return pool.query('UPDATE polls SET name = ?, description = ?, status_id = ? WHERE id = ?', [data.name, data.description, data.statusId, id])
  }

  static delete(id) {
    return pool.query('DELETE FROM polls WHERE id = ?', [id])
  }

  static async addSongs(pollId, songIds) {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()
      for (const songId of songIds) {
        try {
          await connection.query('INSERT INTO polls_songs (poll_id, song_id) VALUES (?, ?)', [pollId, songId])
        } catch (error) {
          if (error.errno === 1062) {
            // do nothing, the song is already in the poll
            continue
          }
          if (error.errno === 1452) {
            await connection.rollback()
            throw new ValidationError(`Song with id ${songId} does not exist`)
          }
          throw error
        }
      }
      await connection.commit()
      return 'Songs successfully added'
    } catch (err) {
      throw err
    } finally {
      connection.release()
    }
  }

  static async deleteSongs(pollId, songIds) {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()
      for (const songId of songIds) {
        try {
          await connection.query('DELETE FROM polls_songs WHERE poll_id = ? AND song_id = ?', [pollId, songId])
        } catch (error) {
          throw error
        }
      }
      await connection.commit()
      return 'Songs successfully deleted'
    } catch (err) {
      throw err
    } finally {
      connection.release()
    }
  }

  static async getActivePollId() {
    const [rows] = await pool.query('SELECT id FROM polls WHERE status_id = 2 LIMIT 1')
    return rows.length > 0 ? rows[0].id : null
  }

  static async deactivate(pollId) {
    const [rows] = await pool.query('UPDATE polls SET status_id = 0 WHERE id = ?', [pollId])
    return 'Poll successfully set as inactive'
  }

  static async activate(pollId) {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()
      await connection.query('UPDATE polls SET status_id = 0 WHERE id != ?', [pollId])
      await connection.query('UPDATE polls SET status_id = 2 WHERE id = ?', [pollId])
      await connection.commit()
      return 'Poll successfully set as active'
    } catch (err) {
      throw err
    } finally {
      connection.release()
    }
  }
}

module.exports = Poll
