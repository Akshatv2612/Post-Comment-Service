import { ApiError } from '../utils/ApiError.js';

/**
The errorHandler function handles errors by returning a JSON response with specific error details if
the error is an instance of ApiError, otherwise it returns a generic Internal Server Error response.
*/
const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            statusCode: err.statusCode,
            message: err.message,
            errors: err.errors,
            success: err.success,
            data: err.data
        });
    }

    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        errors: [],
        data: null
    });
};

export { errorHandler };
