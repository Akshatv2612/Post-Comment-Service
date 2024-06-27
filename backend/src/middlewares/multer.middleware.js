import multer from "multer"

/* This code snippet is configuring the storage settings for file uploads using the `multer` middleware
in a Node.js application. */
const storage=multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,"./public/temp")
    },
    filename: function (req,file,cb){
        cb(null,file.originalname)
    }
})

export const upload=multer({
    storage,
})