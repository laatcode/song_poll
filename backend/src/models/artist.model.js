const pool = require('../db')

class Artist {
  static find() {
    return pool.query('SELECT * FROM artists').then(([rows]) => rows)
  }

  static findById(id) {
    return pool.query('SELECT * FROM artists WHERE id = ?', [id])
      .then(([rows]) => rows[0])
  }

  static create(data) {
    return pool.query('INSERT INTO artists (name) VALUES (?)', [data.name])
      .then(([result]) => this.findById(result.insertId))
  }

  static update(id, data) {
    return pool.query('UPDATE artists SET name = ? WHERE id = ?', [data.name, id])
      .then(() => this.findById(id))
  }

  static delete(id) {
    return pool.query('DELETE FROM artists WHERE id = ?', [id])
      .then(() => ({ message: 'Artist deleted successfully' }))
  }
}

module.exports = Artist;