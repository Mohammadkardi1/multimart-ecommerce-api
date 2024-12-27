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

        const updatedUser = await userModel.findByIdAndUpdate(productOnwer, {$push: {products: savedProduct._id}}, { new: true }).select('-password').populate('products')


        return res.status(201).json({success: true, message: "The product has been added successfully.", data: updatedUser})
    } catch (error) {
        console.log("Error adding product:", error.message)
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
        const updatedUser = await userModel.findByIdAndUpdate(product.productOnwer, { $pull: { products: productID }}, {new: true}).select('-password').populate('products')

        return res.status(200).json({success: true, message: "The product document has been deleted Successfully.", data: updatedUser})
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



export const getFilteredProducts = async (req, res) => {
    const { sort, category, searchTerm } = req.query

    try {
        let query = {}

        if (category) {
            query.category = category
        }

        if (searchTerm) {
            query.productName = { $regex: searchTerm, $options: 'i' }
        }

        const products = await productModel.find(query);

        if (products.length === 0) {
            return res.status(404).json({ success: false, message: 'No products found with the given filters.' });
        }

        let sortOption = {};
        if (sort === 'Ascending') {
            sortOption = { price: 1 };  // Ascending order
        } else if (sort === 'Descending') {
            sortOption = { price: -1 };  // Descending order
        }

        const sortedProducts = await productModel.find(query).sort(sortOption)

        return res.status(200).json({success: true, message: 'Products retrieved successfully.',data: sortedProducts})

    } catch (error) {
        console.error('Error fetching products:', error.message)
        return res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' })
    }
};




















export const getProductByID = async (req, res) => {
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
