import dotenv from "dotenv";
import app from "./app.js"
import dbconnect from "./database/index.js";
import { ApiError } from "./utils/ApiError.js";

dotenv.config({
    path:'./.env'
})

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