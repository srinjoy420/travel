import jwt from  "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export const isLoggedin=async(req,res,next)=>{
    try {
    //     console.log("All cookies:", req.cookies)        // see everything
    // console.log("Headers:", req.headers.cookie)
        const token=req.cookies?.aceessToken

        console.log("accesToken",token ? "found" :"not found");
        if(!token){
            console.log("no token found");
            
            return res.status(401).json({message:"Unauthorized"})
        }
        const decoded=jwt.verify(token,process.env.TOKEN_SECRET)
        console.log("token veryfy succesfulluy");

        req.user=decoded
        next()
        
        
        
    } catch (error) {
         console.log("❌ Authentication middleware error:", error.message);
         return res.status(401).json({ message: "Invalid or expired token" })
        
    }
}
