import bcrypt, { genSalt } from 'bcrypt'
import { Request,Response } from 'express'
import User from '../Model/userProfile'
import mongoConnect from '../config/mongoConnect'

export default async function registerController(req:Request, res:Response) {
    if (!HandleRequestValidity(req)){
        return res.status(400).json({message:"invalid request",success:false})
    }
    await mongoConnect()
    const {name,email,password} = req.body
    const oldUser = await User.findOne({email:email})

    if (oldUser){
        return res.status(400).json({message:"user already exists, sign in",success:false})
    }
    if (password.trim().length<8){
        return res.status(400).json({message:"Password is below its minimum of eight characters ",success:false})
    }
    const salt = await bcrypt.genSalt(10)
    const encryptedPassword = await bcrypt.hash(password,salt)

    try {
        await User.create({
            name:name,
            email:email,
            password:encryptedPassword
        })
        res.status(201).json({success:true, message:"User created successfully"})  
    }
    catch (error) {
        if (error instanceof Error){
            return res.status(500).json({success:false,message :`error while creating account`, error:error.message})  
        }
        return res.status(500).json({success:false,message :`error while creating account`})  
        
    }
    
}

function HandleRequestValidity(req:Request){
    const {email,name,password} = req.body
    if (!email || email.trim().length<=0){
        console.log(`invalid email from ${req.originalUrl}`)
        return false
    }
    if(!name || name.trim().length<=0){
        console.log(`invalid first name from ${req.originalUrl}`)
        return false
    }

    if (!password || password.trim().length<=0){
        console.log(`invalid password from ${req.originalUrl}`)
        return false
    }
    return true
    
}