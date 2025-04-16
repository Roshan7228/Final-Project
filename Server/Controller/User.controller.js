const UserModel = require("../Model/User.model");
const SendMail = require("../Util/Mail");
const CreateOTPandToken = require("../Util/OtpandToken");
let ejs = require('ejs');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const bcrypt = require('bcrypt');

const UserController = {
    signup: async (request, response) => {
        let { Username, Email, Password } = request.body
        if (!(Username, Email, Password)) {
            return response.status(400).json({
                message: "Please fill the all feilds"
            })
        }
        if (request.body.role) {
            return response.status(400).json({
                message: "You can not have permission for this."
            })
        }
        try {
            let isExist = await UserModel.findOne({ Email });
            if (isExist) {
                return response.status(400).json({
                    message: "User all Rady Register!"
                })
            }
            let UserResult = await CreateOTPandToken({ ...request.body });

            let MainHTMLTemplate = await ejs.renderFile(__dirname + "/../views/email.ejs", { OTP: UserResult.OTP, Username });

            await SendMail(MainHTMLTemplate, Email, "OTP Verification !");


            response.cookie("Verification_Token", UserResult.Token).status(200).json({
                message: "OTP Send on Your E-Mail."
            })
        } catch (error) {
            return response.status(400).json({
                message: error.message
            })
        }
    },
    verify: async (request, response) => {
        let token = request.cookies.Verification_Token;
        if (!token) {
            return response.status(400).json({
                message: "Invaild Token"
            })
        }
        try {

            let decoded = jwt.verify(token, process.env.Token_privateKey);
            let { OTP, Userdata } = decoded
            if (OTP != request.body.otp) {
                return response.status(400).json({
                    message: "Invaild OTP !"
                })
            }
            try {
                let hashPassword = await bcrypt.hash(Userdata.Password, 10);

                const user = await UserModel.create({ ...Userdata, Password: hashPassword });

                // Confirmation message
                const MainHTMLTemplate = await ejs.renderFile(__dirname + "/../views/Confirmation.ejs", { name: Userdata.Username, Email: Userdata.Email });
                await SendMail(MainHTMLTemplate, Userdata.Email, "Confirmation message !");

                response.status(201).json({
                    message: "User Create Successfully",
                    user
                })
            } catch (error) {
                return response.status(400).json({
                    message: error.message
                })
            }
        } catch (error) {
            return response.status(400).json({
                message: error.message
            })
        }
    },
    signin: async (request, response) => {
        let { Email, Password } = request.body;
        if (!(Email, Password)) {
            return response.status(400).json({
                message: "Please fill the all Feilds"
            })
        }
        try {
            let isExist = await UserModel.findOne({ Email })
            if (!isExist) {
                return response.status(400).json({
                    message: "User does not Account"
                })
            }
            let validPassword = await bcrypt.compare(Password, isExist.Password);
            if (!validPassword) {
                return response.status(400).json({
                    message: "Invaild Password."
                })
            }
            response.status(200).json({
                message: "Login SuccessFull."
            })



        } catch (error) {
            return response.status(400).json({
                message: error.message
            })
        }




    },
    ForgetPasswordEmailVerify: async (request, response) => {
        let { Email } = request.body;
        if (!Email) {
            return response.status(400).json({
                message: "Please fill the feilds"
            })
        }
        try {

            let isExist = await UserModel.findOne({ Email });
            if (!isExist) {
                return response.status(400).json({
                    message: "Invaild Email"
                })
            }

            let { OTP, Token } = await CreateOTPandToken(isExist);
            let MainHTMLTemplate = await ejs.renderFile(__dirname + "/../views/ForgetOTP.ejs", { OTP: OTP, Username: isExist.Username });
            await SendMail(MainHTMLTemplate, Email, "OTP Verification");
            return response.cookie("Verification_Token", Token).status(200).json({
                message: "OTP has been sent to your registered email. Please verify."
            });
        } catch (error) {
            return response.status(400).json({
                message: error.message
            })
        }




    },
    VerifyResetOTP: async (request, response) => {
        let { otp } = request.body;
        if (!otp) {
            return response.status(400).json({
                message: "Please fill the feilds"
            })
        }
        try {
            let token = request.cookies.Verification_Token;

            const decoded = jwt.verify(token, process.env.Token_privateKey);
            let { OTP } = decoded;
            if (OTP != otp) {
                return response.status(400).json({
                    message: "Invaild OTP"
                })
            }
            response.status(200).json({
                message: "OTP Verified. You can now reset your password."
            });
        } catch (error) {
            return response.status(400).json({
                message: error.message
            })
        }



    },
    ResetPassword: async (request, response) => {
        let { Password } = request.body
        if (!Password) {
            return response.status(400).json({
                message: "Please fill the feilds"
            })
        }
        try {
            let token = request.cookies.Verification_Token
            if (!token) {
                return response.status(400).json({
                    message: "Invaild Token!"
                })
            }

            let decoded = await jwt.verify(token, process.env.Token_privateKey);
            let { Userdata } = decoded;
            let hashPassword = await bcrypt.hash(Password, 10);

            await UserModel.updateOne({ Email: Userdata.Email }, { $set: { Password: hashPassword } });
            let MainHTMLTemplate = await ejs.renderFile(__dirname + "/../views/Passwordupdate.ejs", { Username: Userdata.Username });
            await SendMail(MainHTMLTemplate, Userdata.Email, "Password Reset Successfull");
            response.status(200).json({
                message: "Password Reset Successfull"
            })
        } catch (error) {
            return response.status(400).json({
                message: error.message
            })
        }
    }
}


module.exports = UserController