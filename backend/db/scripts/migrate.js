const pool = require('../config')
const fs = require('fs')
const path = require('path')

async function migrate() {
  const migrationsDir = path.join(__dirname, '../migrations')
  const files = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.sql')).sort()

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8')
    await pool.query(sql)
    console.log(`Executed migration: ${file}`)
  }
  console.log('All migrations executed successfully.')
  process.exit(0)
}

migrate();