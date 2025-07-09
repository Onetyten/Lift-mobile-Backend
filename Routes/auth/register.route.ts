import express from "express";
const router = express.Router()
import registerController from '../../Controllers/register.controller'


router.post('/register',registerController)

export default router

