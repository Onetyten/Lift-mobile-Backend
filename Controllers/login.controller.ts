import dotenv from 'dotenv'
dotenv.config()
import bcrypt, { genSalt } from 'bcrypt'
import crypto from 'crypto'
import { Request,Response } from 'express'
import User from '../Model/userProfile'
import mongoConnect from '../config/mongoConnect'
import jwt from 'jsonwebtoken'

export default async function logInController(req:Request, res:Response) {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not defined!');
    }
    if (!HandleRequestValidity(req)){
        return res.status(400).json({message:"invalid request",success:false})
    }


    await mongoConnect()
    const {email,password} = req.body
        try {
            const userProfile = await User.findOne({email:email})
            if (!userProfile){
                return res.status(400).json({message:"user is not a Lift mobile user, sign up",success:false})
            }
            const passValidity = await bcrypt.compare(password,userProfile.password)
            if (!passValidity){
                return res.status(401).json({status:"error" , data:"Invalid password "})
            }
            const refreshToken = crypto.randomBytes(40).toString('hex')
            const expiresAt = new Date(Date.now() + 6 * 4 * 7 * 24 * 60 * 60 * 1000)

            userProfile.refreshTokens.push({token:refreshToken,expiresAt:expiresAt})
            
            const payload = {
                user:{
                    id:userProfile._id
                }
            }

            const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"4h"})
            userProfile.lastLogin = new Date()
            await userProfile.save()
            const userObject = userProfile.toObject()
            const {password:userPassword,refreshTokens,...clientSafeUser} = userObject
            res.status(200).json(
                {message:`Log in successful welcome ${userProfile.name}`, data:{token:token, refreshToken:userProfile.refreshTokens[userProfile.refreshTokens.length-1],user:clientSafeUser}}
            )


        }

        catch (error) {
            if (error instanceof Error){
                return res.status(500).json({success:false,message :`error while logging in`, error:error.message})  
            }
            return res.status(500).json({success:false,message :`error while logging in`})  
            
    }
    
}

function HandleRequestValidity(req:Request){
    const {email,password} = req.body
    if (!email || email.trim().length<=0){
        console.log(`invalid email from ${req.originalUrl}`)
        return false
    }
    if (!password || password.trim().length<=0){
        console.log(`invalid password from ${req.originalUrl}`)
        return false
    }
    return true
}
