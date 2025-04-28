const UserModel = require("../Model/User.model");
const SendMail = require("../Util/Mail");
const CreateOTPandToken = require("../Util/OtpandToken");
let ejs = require('ejs');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const bcrypt = require('bcrypt');
const Userroutes = require("../Routes/User.routes");

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
            let UserResult = await CreateOTPandToken({ ...request.body }, process.env.Token_privateKey, "5m");

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
        if (!request.body.Password || !request.body.Email) {
            return response.status(400).json({
                message: "Please fill the all Feilds"
            })
        }
        try {
            let isExist = await UserModel.findOne({ Email: request.body.Email })
            if (!isExist) {
                return response.status(400).json({
                    message: "User does not Account"
                })
            }
            let validPassword = await bcrypt.compare(request.body.Password, isExist.Password);
            if (!validPassword) {
                return response.status(400).json({
                    message: "Invaild Password."
                })
            }

            let { Password, ...rest } = isExist._doc;
            const { Token } = CreateOTPandToken({ ...rest }, process.env.User_Token_privateKey, "7d");
            if (!Token) {
                return response.status(400).json({
                    message: "Invalid Token"
                })
            }
            response.cookie("Access_Token", Token).status(200).json({
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

            let { OTP, Token } = await CreateOTPandToken(isExist, process.env.Token_privateKey, "5m");
            let MainHTMLTemplate = await ejs.renderFile(__dirname + "/../views/ForgetOTP.ejs", { OTP: OTP, Username: isExist.Username });
            await SendMail(MainHTMLTemplate, Email, "OTP Verification");
            return response.cookie("Verification_Token", Token).status(200).json({
                message: "OTP has been sent to your registered email. Please verify."
            });
        } catch (error) {
            console.log(error.message)
            return response.status(400).json({
                message: error.message,

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
    },
    GetUserinfo: async (request, response) => {
        if (!request.params.id) {
            return response.status(400).json({
                message: "Somthing went wrong!"
            })
        }

        try {
            let Userinfo = await UserModel.findOne({ _id: request.params.id }).select("-Password -__v");
            if (!Userinfo) {
                return response.status(400).json({
                    message: "User Not Found!"
                })
            }
            response.status(200).json({
                User: Userinfo
            })
        } catch (error) {
            return response.status(400).json({
                message: error.message
            })
        }


    },
    UpdateUserinfo: async (request, response) => {
        const userId = request.params.id;

        if (!userId) {
            return response.status(400).json({
                message: "Something went wrong!"
            });
        }

        if (userId !== request.User._id) {
            return response.status(403).json({
                message: "You can't access the data"
            });
        }

        try {
            if (!request.file) {
                const updateresult = await UserModel.findByIdAndUpdate(
                    userId,
                    { $set: { ...request.body } },
                );
                if (!updateresult) {
                    return response.status(400).json({
                        message: "Error While updateing Profile!"
                    })
                }
            }
            if (request.file) {
                const updateresult = await UserModel.findByIdAndUpdate(
                    userId,
                    { $set: { ...request.body, ProfilePicture: request.file.originalname } },
                );
                if (!updateresult) {
                    return response.status(400).json({
                        message: "Error While updateing Profile!"
                    })
                }
                return response.status(200).json({
                    message: "Profile Update Successfully."
                })
            }
            // if (request.file) {
            //     request.body.ProfilePicture = request.file.originalname;
            // } else {
            //     return response.status(400).json({
            //         message: "Error While Updating Profile, File not found!"
            //     });
            // }

            // const updateresult = await UserModel.findByIdAndUpdate(
            //     userId,
            //     { $set: { ...request.body } },
            // );

            // if (!updateresult) {
            //     return response.status(404).json({
            //         message: "User not found or Error While Updating Profile"
            //     });
            // }

            return response.status(200).json({
                message: "Profile Updated Successfully."
            });

        } catch (error) {
            return response.status(500).json({
                message: error.message
            });
        }
    },
    DeletebyAdmin: async (request, response) => {
        let { id } = request.params;
        if (!id) {
            return response.status(400).json({
                message: "Something Went Wrong"
            });
        }

        try {
            let deleteUser = await UserModel.findByIdAndDelete(id);
            if (!deleteUser) {
                return response.status(400).json({
                    message: "User Not Found"
                })
            }

            return response.status(400).json({
                message: "User Delete Successfully"
            })
        } catch (error) {
            return response.status(400).json({
                message: error.message
            })
        }

    },
    GetAllUserinfo:async (request,response)=>{
        let limit=request.query.limit||null;
        let search=request.query.search||"";
        let order=request.query.order||"asc";
        try {
            let AllUser=await UserModel.find({$or:[{Username:{$regex:search,options:"i"}},{Role:{$regex:search,options:"i"}}]}).limit(limit).sort({createdAt:order=="desc"?-1:1});
            if(!AllUser){
                return response.status(400).json({
                    message:"User Not Found"
                })
            }
            return response.status(200).json({
                message:"Get All Users",
                User:AllUser
            })
            
        } catch (error) {
             return response.status(400).json({
                message:error.message
             })
        }
    },
    Logout:async(request,response)=>{
        return response.clearCookie("Access_Token").status(200).json({
            message:"Logged out successfully"
        })
    }

}


module.exports = UserController


