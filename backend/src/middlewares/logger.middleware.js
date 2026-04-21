const setFixedTextLengthWithCharacters = require('../utils/string.utils').setFixedTextLengthWithCharacters
const logger = (req, res, next) => {

  const start = Date.now()

  res.on('finish', () => {
    const timestamp   = new Date().toISOString().substring(0, 19).replace('T', ' ')
    const method      = setFixedTextLengthWithCharacters(req.method, 6)
    const statusCode  = res.statusCode
    const duration    = setFixedTextLengthWithCharacters(`${Date.now() - start}ms`, 6)
    const ip          = setFixedTextLengthWithCharacters(req.ip || req.connection?.remoteAddress || 'unknown', 15)
    const url         = req.originalUrl
    console.log(`${ timestamp } | ${ method } | ${ statusCode } | ${ duration } | ${ ip }| ${ url } `)
  })

  next()
}

module.exports = logger