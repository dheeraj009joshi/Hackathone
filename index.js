const express = require('express')
const mongoose = require('mongoose')
const mongo_url="mongodb+srv://dlovej009:Dheeraj2006@cluster0.dnu8vna.mongodb.net/My_node_users?retryWrites=true&w=majority"


const app = express()
app.use(express.json())
mongoose.connect(mongo_url ,{useNewUrlParser:true})

const con = mongoose.connection


const UserRoutte= require('./Routes/User')
app.use('/user',UserRoutte)







con.on('open',()=>{
    console.log("connected.....")
})












app.listen(9000,()=>{
    console.log("Server Started....")
})