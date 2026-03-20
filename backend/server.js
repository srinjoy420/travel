import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./db/db.js"
import { clerkMiddleware } from '@clerk/express'
import ClearkWebhooks from "./controller/clearkwebHooks.js"
import cookieParser from "cookie-parser"
import UserRouter from "./routes/User.routes.js"




const app=express()
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(clerkMiddleware())
app.use(cookieParser())
const PORT=process.env.PORT || 5000

//clear webhooks
app.use("/api/clerk",ClearkWebhooks)
//custom routes
app.use("/api/v1/auth",UserRouter)

app.get("/", (req, res) => {
    res.send("Api is working")
})
connectDB()
app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})