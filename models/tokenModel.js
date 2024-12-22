import mongoose from "mongoose"; 

const tokenSchema = mongoose.Schema({
	userId: {type: mongoose.Schema.Types.ObjectId, required: true, unique: true,},
	token: { type: String, required: true },
	createdAt: { type: Date, default: Date.now, expires: 6 * 60 * 60 },
})

const tokenModel = mongoose.model('token', tokenSchema)

export default tokenModel