import mongoose from "mongoose"
import Jwt  from 'jsonwebtoken'

// displayName(string)
// email(string)
// photoURL(string)
// uid"7KQgRhCstTNrTDwYmcKORvUu7uE2"


const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photoURL: { type: String },
  role: {type: String, required: true, enum: ["Seller", "Customer"], default: "Customer"},
  products: [{type: mongoose.Types.ObjectId, ref: "product" }],
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



const userModel = mongoose.model('user', userSchema)

export default userModel











