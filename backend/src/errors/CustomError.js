class CustomError extends Error {
  constructor(statusCode = 500, message) {
    super(message)
    this.name = 'CustomError'
    this.statusCode = statusCode
    this.message = message
  }
}

module.exports = CustomError