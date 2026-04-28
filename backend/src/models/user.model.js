const bcrypt = require('bcryptjs')
const pool = require('../../db/config')

class User {
  static async findByUsername(username) {
    return pool.query('SELECT * FROM users WHERE username = ?', [username])
      .then(([rows]) => rows[0])
  }

  static async findById(id) {
    return pool.query('SELECT id, username FROM users WHERE id = ?', [id])
      .then(([rows]) => rows[0])
  }

  static async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    return pool.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [data.username, hashedPassword]
    )
      .then(([result]) => result.insertId)
  }
}

module.exports = User