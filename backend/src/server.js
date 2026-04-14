const app = require('./app')
const { APP_PORT } = require('./config')

app.listen(APP_PORT, () => {
  console.log(`Server running on port ${APP_PORT}`)
})