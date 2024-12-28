import express from 'express'
import { addToCart, removeCart, getUserCart } from '../controllers/cartControllers.js'
import { verifyToken } from './../middleware/verifyToken.js'

const cartRouter = express.Router()



cartRouter.post('/add',verifyToken , addToCart)
cartRouter.delete('/remove/:productID',verifyToken, removeCart)
cartRouter.get('/userCart',verifyToken, getUserCart)


export default cartRouter
