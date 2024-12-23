import mongoose from 'mongoose'
import productModel from "../models/productModel.js"
import userModel from "../models/userModel.js"


export const addProduct = async (req, res) => {
    if (!req.body.productOnwer) { 
        req.body.productOnwer = req.userID 
    }
    try {
        const {productOnwer, productName, category, imgUrl} = req.body
        if (!productOnwer || !productName || !category || !imgUrl) {
            return res.status(400).json({message:"Required fields are missing"})
        }

        const addedProduct = await new productModel(req.body)
        const savedProduct = await addedProduct.save()

        await userModel.findByIdAndUpdate(productOnwer, {$push: {products: savedProduct._id}}, { new: true })

        return res.status(201).json({success: true, message: "The product has been added successfully."})
    } catch (error) {
        console.log("Error adding product:", error.message)
        return res.status(500).json({success: false, message: "Internal server error. Please try again later."})
    }
}

export const fetchProductsByCategor = async (req, res) => {
    try {
        const { category } = req.query;

        if (!category) {
            return res.status(400).json({success: false,message: "Category is required as a query parameter"})
        }

        const fetchedProducts = await productModel.find({ category })

        if (fetchedProducts.length === 0) {
            return res.status(404).json({success: false, message: "No products found in this category."})
        }

        return res.status(200).json({success: true, message: `Products in category: ${category}`,data: fetchedProducts})
    } catch (error) {
        console.error("Error fetching products by category:", error);
        return res.status(500).json({success: false, message: "Internal Server Error. Please try again later."})
    }
}

export const fetchProductByID = async (req, res) => {
    const { productID } = req.params

    if (!mongoose.Types.ObjectId.isValid(productID)) {
        return res.status(400).json({ success: false, message: "Invalid ID format." })
    }

    try {
        const fetchedProduct = await productModel.findById(productID)
        if (!fetchedProduct) {
            return res.status(404).json({success: true, message: "Product Not Found."})
        }
        return res.status(200).json({success: true, message: "The product document has been retrieved Successfully.", data: fetchedProduct})
    } catch (error) {
        console.log("Error fetching product:", error.message)
        return res.status(500).json({success: false, message: "Internal server error. Please try again later."})
    }
}

export const deleteProductByID = async (req, res) => {
    const { productID } = req.params
    if (!mongoose.Types.ObjectId.isValid(productID)) {
        return res.status(400).json({ success: false, message: "Invalid ID format." })
    }
    try {
        const product = await productModel.findById(productID);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." })
        }
        if (product.productOnwer.toString() !== req.userID) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this product." })
        }


        await productModel.findByIdAndDelete(productID)
        await userModel.findByIdAndUpdate(product.productOnwer, { $pull: { products: productID } })

        return res.status(200).json({success: true, message: "The product document has been deleted Successfully."})
    } catch (error) {
        console.log("Error fetching product:", error.message)
        return res.status(500).json({success: false, message: "Internal server error. Please try again later."})
    }
}







export const getRandomProducts = async (req, res) => {
    try {
        const count = parseInt(req.query.count) || 3

        if (isNaN(count) || count <= 0) {
            return res.status(400).json({success: false,message: "Invalid 'count' parameter. It must be a positive number."})
        }

        const randomProducts = await productModel.aggregate([{ $sample: { size: count } }])

        return res.status(200).json({success: true,data: randomProducts})
    } catch (error) {
        console.error("Error fetching random products:", error.message);
        return res.status(500).json({success: false,message: "Internal server error. Please try again later."})
    }
}
