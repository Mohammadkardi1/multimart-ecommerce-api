import userModel from '../models/userModel.js'
import tokenModel from '../models/tokenModel.js'
import { nameValidator, emailValidator, passwordValidator } from '../utils/validator.js'
import sendEmail from './../utils/sendEmail.js'
import crypto from 'crypto' 
import bcrypt from 'bcryptjs'




// API register endpoint
export const register = async (req, res) => {
    const {username, email, password} = req.body

    if (!username || !email || !password) {
        return res.status(400).json({message:"Required fields are missing"})
    }
    if (!nameValidator(username.trim())) {
        return res.status(400).json({message: 'Name must be alphanumeric at least 4 characters long'})
    }
    if (!emailValidator(email)) {
        return res.status(400).json({message: "Email is not valid"})
    }
    if (!passwordValidator(password)) {
        return res.status(400).json({message: 'Password is not strong enough'})
    }

    try {
        const isUserExists = await userModel.findOne({email})

        // check if the user exists in Database
        if (isUserExists) {
            return res.status(400).json({message: "User already exist"})
        }

        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const user = new userModel({...req.body, username: username.trim(),  password: hashPassword })
        await user.save()

        const verifiedToken = await tokenModel.create({
			userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
		})
 
        const url = `${process.env.CLIENT_BASE_URL}/api/auth/${user._id}/verify/${verifiedToken.token}`
        const htmlMessage = `
                <div>Hallo ${user.username},</div>
                <div>
                    <br>
                    <P> Please Click on the link to verify your email address: </P>
                    <br>
                    <p>${url}</p>
                </div>`

		await sendEmail(user.email, "Account Verification", htmlMessage)

		return res.status(400).send({ message: "Registration successful! Please check your email to verify your account" })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success:false, message: "Internal server error. Please try again later"})
    }
}

// API login endpoint
export const login = async (req, res) => {
    const {email, password} = req.body


    if (!email || !password) {
        return  res.status(400).json({message: "Required fields are missing"})
    }
 
    try {
        const existingUser = await userModel.findOne({email})
        // Check if the user exsits in Database
        if (!existingUser) {
            return res.status(404).json({success: false, message: "User not found! Please Sign up"})
        }

        // Compare password
        const isPasswordMatch = await bcrypt.compare(req.body.password, existingUser.password)
        if (!isPasswordMatch) {
            return res.status(400).json({status: false, message: "The password you entered is incorrect"})
        }

        if (!existingUser.verified) {   
			return res.status(400).send({ message: "Your account has not verified yet. Please check your email for a verification link" })
        }

        // Generate the token using the instance method
        const token = existingUser.generateToken()
        const {password, ...rest} = existingUser._doc

        return res.status(200).json({status: true, message:"You have been logged in Successfully", token, data:{...rest}})
    } catch (error) {
        console.log("Login Error:", error.message)
        return res.status(500).json({status: false, message:"Internal server error. Please try again later"})
    }
}




export const verifyEmail = async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ _id: req.params.id })

        if (!existingUser) {
            return res.status(404).json({ message: "User Not Found." })
        }

        if (existingUser.verified) {
            return res.status(400).send({ message: "Email have already verified! Please Log in" })
        }

        const existingToken = await tokenModel.findOne({
            userId: req.params.id,
            token: req.params.token,
        })

        if (!existingToken) {
            return res.status(404).send({ message: "Invalid or expired token. Please request a new link to proceed" })
        }

        await userModel.findByIdAndUpdate(existingUser._id, {verified: true })
        await tokenModel.findByIdAndDelete(existingToken._id)

        return res.status(200).send({ message: "Email verified successfully! Please Log in" })
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: "Internal Server Error" });
    }
}