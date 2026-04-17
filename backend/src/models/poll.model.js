const pool = require('../db')
const ValidationError = require('../errors/ValidationError')

class Poll {

  static find() {
    return pool.query('SELECT id, name, description, status_id AS statusId FROM polls').then(([rows]) => rows)
  }

  static findById(id) {
    return pool.query('SELECT id, name, description, status_id AS statusId FROM polls WHERE id = ?', [id])
      .then(([rows]) => rows[0])
  }

  static findActive() {
    return pool.query('SELECT id, name, description, status_id AS statusId FROM polls WHERE status_id = 1')
      .then(([rows]) => rows)
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
          await connection.rollback()
          if (error.errno === 1452) {
            throw new ValidationError(`Song with id ${song.songId} does not exist`)
          }
          throw error
        }
      }
      await connection.commit()
      return this.findById(pollId)
    } catch (err) {
      throw err
    }
    finally {
      connection.release()
    }
  }

  static update(id, data) {
    return pool.query('UPDATE polls SET name = ?, description = ?, status_id = ? WHERE id = ?', [data.name, data.description, data.statusId, id])
      .then(() => this.findById(id))
  }

  static delete(id) {
    return pool.query('DELETE FROM polls WHERE id = ?', [id])
      .then(() => ({ message: 'Poll deleted successfully' }))
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
      await connection.commit();
      return 'Songs successfully added'
    } catch (err) {
      throw err;
    } finally {
      connection.release();
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
      await connection.commit();
      return 'Songs successfully deleted'
    } catch (err) {
      throw err;
    } finally {
      connection.release();
    }
  }
}

module.exports = Poll
