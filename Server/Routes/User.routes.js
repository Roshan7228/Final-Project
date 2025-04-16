let express=require("express");
const UserController = require("../Controller/User.controller");

let Userroutes=express.Router();

Userroutes.post("/signup",UserController.signup);
Userroutes.post("/verify",UserController.verify);
Userroutes.post("/signin",UserController.signin);
Userroutes.post("/forget-password",UserController.ForgetPasswordEmailVerify);
Userroutes.post("/verify-reset-otp",UserController.VerifyResetOTP);
Userroutes.post("/reset-password",UserController.ResetPassword)



module.exports=Userroutes;