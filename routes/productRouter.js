import express from 'express'
import { addProduct, deleteProductByID, fetchProductByID, fetchProductsByCategor } from './../controllers/productControllers.js';
import { verifyToken } from './../middleware/verifyToken.js';
import { restrictAccess } from './../middleware/restrictAccess.js';

const productRouter = express.Router()


productRouter.post('/addProduct',verifyToken, restrictAccess(["Seller"]),  addProduct)
productRouter.get('/productsByCategor',verifyToken, fetchProductsByCategor)
productRouter.get('/productByID/:productID',verifyToken, fetchProductByID)
productRouter.delete('/deleteProduct/:productID',verifyToken, restrictAccess(["Seller"]), deleteProductByID)


export default productRouter