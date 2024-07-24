import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("DB connected succefully")       
    } catch (error) {
        console.log("unable to connect to db : ",error.message)
    }
}

export default connectDB;