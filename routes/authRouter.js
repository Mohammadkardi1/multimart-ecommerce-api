import express from 'express'
import { register, verifyEmail, login } from '../controllers/authControllers.js'

const authRouter = express.Router()


authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/:id/verify/:token', verifyEmail)


export default authRouter