import nodemailer from 'nodemailer'



const sendEmail = async (recipient, subject, message) => {

    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE, 
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS
            }
        })

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER, 
            to: recipient,
            subject: subject,
            html: message   
        })
    } catch (error) {
        console.log(error.message)
    }
}

export default sendEmail