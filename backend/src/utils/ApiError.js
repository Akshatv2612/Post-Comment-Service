/* The `ApiError` class is a custom error class in JavaScript that includes status code, message,
errors, and stack information for API-related errors. */
class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.errors = errors
        this.success = false;
        this.data = null

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}