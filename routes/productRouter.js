import express from 'express'
import { addProduct, deleteProductByID, getProductByID,
        getRandomProducts, getFilteredProducts } from './../controllers/productControllers.js';
import { verifyToken } from './../middleware/verifyToken.js';
import { restrictAccess } from './../middleware/restrictAccess.js';

const productRouter = express.Router()


productRouter.post('/addProduct',verifyToken, restrictAccess(["Seller"]),  addProduct)
productRouter.delete('/deleteProduct/:productID',verifyToken, restrictAccess(["Seller"]), deleteProductByID)



productRouter.get('/randomProducts', getRandomProducts)

productRouter.get('/filteredProducts', getFilteredProducts)


productRouter.get('/productByID/:productID', getProductByID)


export default productRouter