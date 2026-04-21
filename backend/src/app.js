const express = require('express')
const app = express()

// Rate Limiting  
app.use(require('./middlewares/rateLimit.middleware'))

app.use(express.json())
app.get('/', (req, res) => res.send('Server running'))

// Routes
app.use('/api/artists', require('./routes/artist.route'))
app.use('/api/songs', require('./routes/song.route'))
app.use('/api/polls', require('./routes/poll.routes'))

// Middlewares
app.use(require('./middlewares/notFound.middleware'))
app.use(require('./middlewares/errorHandler.middleware'))

module.exports = app