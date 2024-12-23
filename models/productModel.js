import mongoose from "mongoose"


 
const productSchema = new mongoose.Schema({
  productOnwer: { type: mongoose.Types.ObjectId, required: true, ref: "user" }, 
  productName: { type: String, required: true },
  category: { type: String, required: true, enum: ["Furniture", "Electronics", "Accessories"],  },
  imgUrl: { type: String, required: true},
  price: {type: Number, },
  description: { type: String },
  shortDosc: { type: String },
},  { timestamps: true }
)


const productModel = mongoose.model('product', productSchema)

export default productModel


















