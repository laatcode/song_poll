const CustomError = require('../errors/CustomError')
const ValidationError = require('../errors/ValidationError')

module.exports = (err, req, res, next) => {
    if(err instanceof ValidationError) {
        return res.status(err.statusCode).json({
            error: err.message,
            details: err.messages
        })
    }

    if(err instanceof CustomError) {
        return res.status(err.statusCode).json({
            error: err.message
        })
    }
    
    console.log(err)
    res.status(500).json({ error: 'Internal Server Error' })
}