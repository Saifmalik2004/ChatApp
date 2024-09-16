const express = require("express");
const cors = require('cors');
require('dotenv').config()

const connectDB = require("./config/connectDB")
const router = require("./routes/index")
const cookieParser=require('cookie-parser')
const {app,server} =require('./socket/index')

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));


const Port = process.env.PORT || 8080

app.get("/",(req,res)=>{
    res.send("hi")

})
// api ednpoints
app.use("/api",router)

connectDB().then(()=>{
    console.log("Database connected successfully")
    server.listen(Port,()=>{
        console.log("server is running at "+Port)
    })

})




