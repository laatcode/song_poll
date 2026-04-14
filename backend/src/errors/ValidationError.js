class ValidationError extends Error {
  constructor(messages) {
    super("Validation failed")
    this.name = 'ValidationError'
    this.statusCode = 400
    this.messages = messages
  }
}

module.exports = ValidationError