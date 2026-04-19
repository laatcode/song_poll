const ValidationError = require('../errors/ValidationError')

module.exports = (schema, property) => (req, res, next) => {
    const data = req[property]
    const { error } = schema.validate(data, { abortEarly: false })
    
    if (error) {
      const messages = error.details.map(detail => detail.message)
      return next(new ValidationError(messages))
    }
    next()
}