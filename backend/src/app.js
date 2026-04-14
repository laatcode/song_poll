const express = require('express')
const app = express()

app.use(express.json())
app.get('/', (req, res) => res.send('Server running'))

// Routes
app.use('/api/artists', require('./routes/artist.route'))

// Middlewares
app.use(require('./middlewares/notFound.middleware'))
app.use(require('./middlewares/errorHandler.middleware'))

module.exports = app;