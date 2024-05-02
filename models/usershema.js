import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim:true
    },
    mobile:{
        type:String,
        required: true,
        trim:true
    },
    email:{
        type:String,
        required: true,
        trim:true
    },
    password:{
        type:String,
        required: true,
        trim:true
    },
    token:{
        type:String,
    },
})

const User = mongoose.model("User", userSchema);
const generateToken = (id) => {
    return jwt.sign({id}, process.env.SECRET_KEY);
}

export {User, generateToken};