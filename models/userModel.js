import mongoose from "mongoose"
import Jwt  from 'jsonwebtoken'



const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photoURL: { type: String },
  role: {type: String, required: true, enum: ["Seller", "Customer"], default: "Customer"},
  products: [{type: mongoose.Types.ObjectId, ref: "product"}],
  cart: [
    {
      productID: { type: mongoose.Types.ObjectId, ref: 'product' },
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, default: 0 },
  totalQuantity: { type: Number, default: 0 },
  verified: { type: Boolean, default: false},
}) 


// Instance method for generate a JWT token
userSchema.methods.generateToken = function () {
  const payload = {
      userID: this._id, 
      role: this.role
    }
  return Jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '6h'})
}


userSchema.pre('save', function (next) {
  this.totalAmount = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  this.totalQuantity = this.cart.reduce((sum, item) => sum + parseInt(item.quantity), 0)
  next()
})



const userModel = mongoose.model('user', userSchema)

export default userModel











