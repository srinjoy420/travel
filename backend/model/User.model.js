import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const userSchema=new Schema({
    //  _id: {
    //     type: String  // ✅ Clerk ID
    // },
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
    },/**
     * if we dont use claude we dont need password

     */
    password:{
        type:String,
       
        minLength:[6,"min mum 6 length password required"],
    },
    phone:{
        type:String,
        required:true
        
    },
    recentSearchedCities:[
        {
            type:String,
            
        }
    ],
    refreshToken:{
        type:String

    }

},{timestamps:true})

userSchema.pre('save', async function () {
    if (!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 10)
})
userSchema.methods.isPasswordCorrect=async function (password) {
    try {
        return await bcrypt.compare(password,this.password)
    } catch (error) {
        throw Error("Password comparison failed")
    }
    
}

userSchema.methods.generateAcessToken= function() {
    try {
        return jwt.sign(
            {
                _id:this._id,
                email:this.email,
                username:this.username
            },process.env.TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY || "15m"}
        )
    } catch (error) {
        throw Error ("Acess token generation failed")
        
    }
    
}
userSchema.methods.generateRefreshToken= function() {
    try {
        return jwt.sign(
            {
                _id:this._id,
               
            },process.env.TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY || "7d"}
        )
    } catch (error) {
        throw Error ("RefreshToken token generation failed")
        
    }
    
}

const User=mongoose.model("User",userSchema)
export default User
