import express from "express";
const router = express.Router()
import logInController from '../../Controllers/login.controller'


router.post('/login',logInController)

export default router

