import express from "express"
import "dotenv/config"
import cors from "cors"
import connectDB from "./db/db.js"
import { clerkMiddleware } from '@clerk/express'
import ClearkWebhooks from "./controller/clearkwebHooks.js"



const app=express()
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(clerkMiddleware())
const PORT=process.env.PORT || 5000

//clear webhooks
app.use("/api/clerk",ClearkWebhooks)

app.get("/", (req, res) => {
    res.send("Api is working")
})
connectDB()
app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})