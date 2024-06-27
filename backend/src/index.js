import dotenv from "dotenv";
import app from "./app.js"
import dbconnect from "./database/index.js";
import { ApiError } from "./utils/ApiError.js";

/* The `dotenv.config()` function call with the `path` option set to `./.env` is loading and parsing
the variables from a `.env` file into the Node.js environment. This allows the application to access
environment variables defined in the `.env` file throughout the application code. */
dotenv.config({
    path:'./.env'
})

/* This code snippet is establishing a connection to a database using the `dbconnect()` function. Once
the connection is successfully established, it sets up event listeners for any errors that may occur
in the Express application (`app.on('error', ...)`). It then starts the Express application by
listening on a specified port (retrieved from the environment variable `process.env.PORT` or
defaulting to port 8000) using `app.listen(...)`. */
dbconnect()
.then(()=>{
    app.on('error',(error)=>{
        console.log("EXPRESS ERROR : ",error);
    })

    app.listen(process.env.PORT || 8000,()=>{
        console.log(`APP IS RUNNING ON PORT ${process.env.PORT}`)
    })
})
.catch((error)=>{
    throw new ApiError(420,"DATABASE CONNECTIVITY ERROR",error)
})