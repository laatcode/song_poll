module.exports = {
  APP_PORT: process.env.APP_PORT || 5000,
  APP_RATE_LIMIT_WINDOW: process.env.APP_RATE_LIMIT_WINDOW || 900000,
  APP_RATE_LIMIT_MAX: process.env.APP_RATE_LIMIT_MAX || 100,
  APP_CORS_ORIGIN: process.env.APP_CORS_ORIGIN || '*',

  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'song_poll_db',

  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
}