const pool = require('../db')

class Song {

  static find() {
    return pool.query('SELECT * FROM songs').then(([rows]) => rows)
  }

  static findById(id) {
    return pool.query('SELECT * FROM songs WHERE id = ?', [id])
      .then(([rows]) => rows[0])
  }

  static create(data) {
    return pool.query('INSERT INTO songs (title, artist_id) VALUES (?, ?)', [data.title, data.artistId])
      .then(([result]) => this.findById(result.insertId))
  }

  static update(id, data) {
    return pool.query('UPDATE songs SET title = ?, artist_id = ? WHERE id = ?', [data.title, data.artistId, id])
      .then(() => this.findById(id))
  }

  static delete(id) {
    return pool.query('DELETE FROM songs WHERE id = ?', [id])
      .then(() => ({ message: 'Song deleted successfully' }))
  }

}

module.exports = Song
