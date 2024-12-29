import userModel from "../models/userModel.js"


export const addToCart = async (req, res) => {

    if (!req.body.userID) { 
        req.body.userID = req.userID 
    }
    if (!req.body.quantity) { 
      req.body.quantity = 1
    }
    
    try {
      const { userID, productID, quantity, price } = req.body
    
      if (!userID || !productID || !quantity || !price) {
        return res.status(400).json({ success: false, message: 'Missing required fields' })
      }
  
      const existingUser = await userModel.findById(userID)
      if (!existingUser) {
        return res.status(404).json({ success: false, message: 'User not found' })
      }
  
      const existingProduct = existingUser.cart.find(item => item.productID.toString() === productID)
  
      if (existingProduct) {
        existingProduct.quantity = parseInt(existingProduct.quantity) + parseInt(quantity)
      } else {
        existingUser.cart.push({ productID, quantity, price })
      }
  
      await existingUser.save()

      const updatedUser = await userModel.findById(userID).populate("products").populate('cart.productID')

  
      return res.status(200).json({success: true, message: 'Product added to cart successfully', data: updatedUser,})
    } catch (error) {
      console.error('Error adding to cart:', error.message)
      return res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' })
    }
  }
  


export const removeCart = async (req, res) => {

    const { productID } = req.params
    const userID = req.userID

    if (!userID || !productID) {
      return res.status(400).json({ success: false, message: 'Missing required fields' })
    }

    try {
      const existingUser = await userModel.findById(userID).populate("products").populate('cart.productID')
      if (!existingUser) {
        return res.status(404).json({ success: false, message: 'User not found' })
      }
  
      existingUser.cart = existingUser.cart.filter(item => item.productID._id.toString() !== productID)
  
      await existingUser.save()
  
      return res.status(200).json({success: true, message: 'Product removed from cart successfully', data: existingUser})
    } catch (error) {
      console.error('Error removing from cart:', error.message)
      return res.status(500).json({ success: false, message: 'Internal server error' })
    }
  };
  



// export const getUserCart = async (req, res) => {

//     // const { userID } = req.params
//     if (!req.userID) {
//       return res.status(400).json({ success: false, message: 'User ID is required' })
//     }
    
//     try {
//       const existingUser = await userModel.findById(req.userID).populate('cart.productID')
  
//       if (!existingUser) {
//         return res.status(404).json({ success: false, message: 'User not found' })
//       }
  
//       return res.status(200).json({success: true, message: 'User cart retrieved successfully', 
//             data: {cart: existingUser.cart, totalAmount: existingUser.totalAmount, totalQuantity: existingUser.totalQuantity}})
//     } catch (error) {
//       console.error('Error fetching user cart:', error.message);
//       return res.status(500).json({ success: false, message: 'Internal server error' });
//     }
//   }
  