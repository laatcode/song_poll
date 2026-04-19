const pool = require('../db')

class Artist {
  static find(page = 1, limit = 10) {
    const offset = (page - 1) * limit
    return pool.query('SELECT * FROM artists LIMIT ? OFFSET ?', [limit, offset])
      .then(([rows]) => rows)
  }

  static count() {
    return pool.query('SELECT COUNT(*) as total FROM artists')
      .then(([rows]) => rows[0].total)
  }

  static findById(id) {
    return pool.query('SELECT * FROM artists WHERE id = ?', [id])
      .then(([rows]) => rows[0])
  }

  static create(data) {
    return pool.query('INSERT INTO artists (name) VALUES (?)', [data.name])
      .then(([result]) => result.insertId)
  }

  static update(id, data) {
    return pool.query('UPDATE artists SET name = ? WHERE id = ?', [data.name, id])
  }

  static delete(id) {
    return pool.query('DELETE FROM artists WHERE id = ?', [id])
  }
}

module.exports = Artist