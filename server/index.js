const express = require("express");
const cors = require('cors');
require('dotenv').config()
const app = express();
const connectDB = require("./config/connectDB")
const router = require("./routes/index")
const cookieParser=require('cookie-parser')

app.use(cors({
    origin:process.env.FRONTED_URL,
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())


const Port = process.env.PORT || 8080

app.get("/",(req,res)=>{
    res.send("hi")

})
// api ednpoints
app.use("/api",router)

connectDB().then(()=>{
    console.log("Database connected successfully")
    app.listen(Port,()=>{
        console.log("server is running at "+Port)
    })

})




