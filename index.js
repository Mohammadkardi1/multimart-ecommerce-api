import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRouter from './routes/authRouter.js';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';




const app = express()


dotenv.config()


const PORT = process.env.PORT || 3000 
const CONNECTION_URL = process.env.MONGO_URL



// Middleware
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://mohammad-kardi-multimart-ecommerce-full-stack.vercel.app']
}))
app.use(cookieParser())
app.use(express.json())

  
app.use('/api/auth', authRouter )
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)


app.get('/', (req, res) => {
    res.status(200).json({message: "API is running"})
})
    
mongoose.connect(CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => {
        console.log(error.message)
    })

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!")
})