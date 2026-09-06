class AppError extends Error {
    constructor(message, statusCode = 400) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = true
        Error.captureStackTrace(this, this.constructor)
    }
}

class InvalidCredentialsError extends AppError {
    constructor(message = "email or password is incorrect") {
        super(message, 401)
    }
}
module.exports = {AppError, InvalidCredentialsError}