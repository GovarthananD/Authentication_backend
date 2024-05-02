import mongoose from "mongoose";

const DB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB Connected")
    } catch (error) {
        console.log("Something error while connecting Database",error)
    }
}

export {DB};