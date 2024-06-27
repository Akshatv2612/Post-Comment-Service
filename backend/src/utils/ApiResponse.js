/* The `ApiResponse` class is designed to encapsulate the response data, status code, and message for
API responses in JavaScript. */
class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}

export { ApiResponse }