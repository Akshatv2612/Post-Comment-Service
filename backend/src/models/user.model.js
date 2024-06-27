import mongoose, { Schema } from "mongoose";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/* This code snippet is defining a Mongoose schema for a user in a Node.js application.*/
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
        index: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    refreshToken: {
        type: String,
        default: undefined
    }
}, { timestamps: true });

/* This code snippet is a Mongoose middleware function that is executed before saving a user document
to the database. Specifically, it is a pre-save hook that checks if the password field of the user
document has been modified. If the password has been modified, it hashes the password using bcrypt
with a cost factor of 10 before saving it to the database. The `next()` function is then called to
proceed with the save operation. This ensures that the password is always hashed before being stored
in the database for security reasons. */
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
        next()
    }
})

/* The `userSchema.methods.isPasswordCorrect` function is a method defined on the Mongoose schema for a
user. This method is used to compare a provided password with the hashed password stored in the user
document. */
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

/* The `userSchema.methods.generateAccessToken` function is a method defined on the Mongoose schema for
a user. This method is responsible for generating a JSON Web Token (JWT) access token for the user. */
userSchema.methods.generateAccessToken = function () {
    return Jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

/* The `userSchema.methods.generateRefreshToken` function is a method defined on the Mongoose schema
for a user. This method is responsible for generating a JSON Web Token (JWT) refresh token for the
user. */
userSchema.methods.generateRefreshToken = function () {
    return Jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);