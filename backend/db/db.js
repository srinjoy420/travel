import mongoose from "mongoose";
import "dotenv/config"
const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URl)
        console.log("succesfully connected to database");
        
    } catch (error) {
        console.error("error to connecting",error);
        process.exit(1);
        
    }
}

export default connectDB;