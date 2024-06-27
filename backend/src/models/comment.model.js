import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

/* This code snippet is defining a Mongoose schema for a comment in a MongoDB database.*/
const commentSchema = new Schema({
    content:{
        type:String,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    post:{
        type:Schema.Types.ObjectId,
        ref:"Post"
    }
}, { timestamps: true })

commentSchema.plugin(mongooseAggregatePaginate)
export const Comment = mongoose.model('Comment',commentSchema)