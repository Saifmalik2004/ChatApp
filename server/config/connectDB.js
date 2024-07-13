const mongoose = require("mongoose")


const dbURL=process.env.MONGO_URL;
async function connectDB() {
    try {
        await mongoose.connect(dbURL)
        const connection = mongoose.connection
        connection.on('connected',()=>{
            console.log('connected to DB')
        })
        connection.on('Error',(error)=>{
            console.log('Something went wrong in mongodb',error)
        })
    } catch (error) {
        console.log("something is wrong druing connect DB",error)
    }
}



module.exports = connectDB