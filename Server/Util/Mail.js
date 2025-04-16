const nodemailer = require("nodemailer");
require("dotenv").config();

async function SendMail(MainHTMLTemplate, Email,subject) {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.Service,
            auth: {
                user: process.env.Company_Email,
                pass: process.env.Password, 
            },
        });

        const info = await transporter.sendMail({
            from: process.env.Company_Email,
            to: Email,
            subject: subject,
            html: MainHTMLTemplate,
        });

    } catch (error) {
        console.error("Error sending email: ", error);
    }
}

module.exports = SendMail;
