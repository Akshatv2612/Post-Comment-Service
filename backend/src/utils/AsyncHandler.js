/**
 * The asyncHandler function is a wrapper that allows asynchronous request handlers to be used in
 * Express middleware by handling promises and catching errors.
 * The `requestHandler` parameter is a function that handles incoming requests
 * in an asynchronous manner. It typically takes three parameters: `req` (the request object), `res`
 * (the response object), and `next` (the next middleware function in the stack).
 * The `asyncHandler` function returns a new function that takes `req`, `res`, and `next` as
 * parameters. This new function wraps the `requestHandler` function in a Promise and catches any
 * errors that occur during its execution.
 */
const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((err)=> next(err))
    }
}

export {asyncHandler}














// const asyncHandler = (requestHandler) => async (req,res,next) => {
//     try{
//         await requestHandler(req,res,next)
//     }
//     catch(error){
//         res.status(error.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }