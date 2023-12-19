const express = require('express')
const cors = require("cors");

const mongoose = require('mongoose')
const User = require("./Models/User")
const mongo_url="mongodb+srv://vinitjain:v5ABy6vitC0EKy0j@thepic.u0zzk1w.mongodb.net/"


const UserRoute= require('./Routes/User')
const SafeAreaRoute= require('./Routes/SafeArea')
const NotificationRoute= require('./Routes/Notification')
const app = express()
app.use(express.json())
app.use(cors({
    origin:"*",
    credentials: true,
}));
mongoose.connect(mongo_url ,{useNewUrlParser:true})

const con = mongoose.connection
con.on('open',()=>{
    console.log("connected.....")
})

app.use('/user',UserRoute)
app.use('/notification',NotificationRoute)


app.listen(9000,()=>{
    console.log("Server Started....")
})