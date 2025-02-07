const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const app = express()
const jwt = require("jsonwebtoken")
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET

const mongoUrl = process.env.MONGO_URL

mongoose.connect(mongoUrl).then(()=>{
    console.log("Database connected")
}).catch((e)=>{
    console.log(e)
})

app.use(express.json())

const user = require("./userDetails");

app.get("/",(req,res)=>{
 res.send({status:"started"})
})

app.post('/register', async(req,res)=>{
    const {name,email,password} = req.body
    const oldUser = await user.findOne({email:email})

    if (oldUser){
        return res.status(400).json({status:"error",data:"user already exists !!"})
    }
    const encryptedPassword = await bcrypt.hash(password,10)

    try {
        await user.create({
            name:name,
            email:email,
            password:encryptedPassword
        })
        res.json({status:"ok",data:"User created successfully"})  
    }
    catch (error) {
        res.status(500).json({status:"error",data : error})  
    }
})


app.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    const existingUser = await user.findOne({email})
    if (!existingUser){
        return res.status(400).json({status:"error",data:"User does not exist, signup"})
    }
    const isPasswordValid = await bcrypt.compare(password,existingUser.password)

    if (!isPasswordValid){
        return res.status(401).json({status:"error" , data:"Invalid password "})
    }
    const token = jwt.sign({userId:existingUser.id,email:existingUser.email},JWT_SECRET,{expiresIn:"1h"})

    res.json({status:"ok",data:"Login successful",token})

})

const verifyToken = (req,res,next)=>{
    const token = req.headers["authorization"]

    if (!token){
        return res.status(403).json({status: "error", data: "Token required"})
    }
    try{
       const decoded = jwt.verify(token.split(" ")[1],JWT_SECRET)
       req.user = decoded
       next() 
    }
    catch (error) {
        res.status(401).json({ status: "error", data: "Invalid token" });
    }
}

app.get("/user",verifyToken,async(req,res)=>{
    try {
        const userData = await user.findById(req.user.userId).select("-password"); // Exclude password from response
        res.json({ status: "ok", data: userData });
    } catch (error) {
        res.status(500).json({ status: "error", data: error.message });
    }
})




const PORT = process.env.PORT || 1001
app.listen (PORT,()=>{console.log(`server running at ${PORT}`)}) 