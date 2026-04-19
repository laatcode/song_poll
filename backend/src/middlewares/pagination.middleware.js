const pagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  req.pagination = {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit))
  }

  next()
}

module.exports = pagination