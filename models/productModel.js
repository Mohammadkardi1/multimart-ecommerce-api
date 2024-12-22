import mongoose from "mongoose"

// productName (string)
// category (string)
// description (string)
// imgUrl (string)
// price (string)
// shortDosc (string)

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  category: { type: String, required: true }, //enum: ["Male", "Female", "Other"] 
  description: { type: String, required: true },
  imgUrl: { type: String, required: true},
  price: {type: Number, required: true},
  shortDosc: { type: String, required: true },
},  { timestamps: true }
)


const productModel = mongoose.model('product', productSchema)

export default productModel


















