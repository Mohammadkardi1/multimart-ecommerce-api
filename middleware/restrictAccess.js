import userModel from './../models/userModel.js';

export const restrictAccess = roles => async (req, res, next) => {
    const userID = req.userID

    try {
        const isUserExists = await userModel.findById(userID)

        if (!isUserExists) {
            return res.status(404).json({success: false, message: "User not found."});
        }

        if (!roles.includes(isUserExists.role)) {
            return res.status(401).json({success: false, message: "You are not authorized."})
        }

        next()
    } catch (error) {
        return res.status(500).json({success: false, message: "Internal server error. Please try again later."})
    }
}