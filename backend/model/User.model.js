import mongoose from "mongoose";

const userSchema=mongoose.Schema({
     _id: {
        type: String  // ✅ Clerk ID
    },
    username:{
        type:String,
        required:true,
       
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },

    image:{
        type:String,
        default:""
    },
    role:{
        type:String,
        enum:["user","admin","hotelOwner"],
        default:"user"
    },
    phone:{
        type:String,
        
    },
    recentSearchedCities:[
        {
            type:String,
            required:true
        }
    ]

},{timestamps:true})
const User=mongoose.model("User",userSchema)
export default User;
