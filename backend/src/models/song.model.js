const pool = require('../../db/config')

class Song {

  static find(page = 1, limit = 10) {
    const offset = (page - 1) * limit
    return pool.query('SELECT id, title, artist_id AS artistId FROM songs LIMIT ? OFFSET ?', [limit, offset])
      .then(([rows]) => rows)
  }

  static count() {
    return pool.query('SELECT COUNT(*) as total FROM songs')
      .then(([rows]) => rows[0].total)
  }

  static findById(id) {
    return pool.query('SELECT id, title, artist_id AS artistId FROM songs WHERE id = ?', [id])
      .then(([rows]) => rows[0])
  }

  static create(data) {
    return pool.query('INSERT INTO songs (title, artist_id) VALUES (?, ?)', [data.title, data.artistId])
      .then(([result]) => result.insertId)
  }

  static update(id, data) {
    return pool.query('UPDATE songs SET title = ?, artist_id = ? WHERE id = ?', [data.title, data.artistId, id])
  }

  static delete(id) {
    return pool.query('DELETE FROM songs WHERE id = ?', [id])
  }

}

module.exports = Song
