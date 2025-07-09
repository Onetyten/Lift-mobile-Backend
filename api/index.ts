import dotenv from 'dotenv'
dotenv.config()
import registerRoute from '../Routes/auth/register.route'
import logInRoute from '../Routes/auth/login.route'

import express from 'express'
import cors from 'cors';
import mongoose from 'mongoose';
const app = express()
const JWT_SECRET = process.env.JWT_SECRET



app.use(
    cors(
        {origin:"*"}
    )
)
app.use(express.json())
app.use(express.urlencoded({extended : true}))



app.get("/",(req,res)=>{
 res.send({status:"Lift mobile backend is active"})
})


app.use('/auth',registerRoute)
app.use('/auth',logInRoute)





const PORT = process.env.PORT || 4100
app.listen (PORT,()=>{console.log(`server running at ${PORT}`)}) 