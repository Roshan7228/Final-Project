let express=require("express");
const UserController = require("../Controller/User.controller");
const Auth = require("../Middleware/Auth");
const upload = require("../Config/Multer.config");

let Userroutes=express.Router();

Userroutes.post("/signup",UserController.signup);
Userroutes.post("/verify",UserController.verify);
Userroutes.post("/signin",UserController.signin);
Userroutes.post("/forget-password",UserController.ForgetPasswordEmailVerify);
Userroutes.post("/verify-reset-otp",UserController.VerifyResetOTP);
Userroutes.post("/reset-password",UserController.ResetPassword);
Userroutes.get("/getuserinfo/:id",Auth,UserController.GetUserinfo);
Userroutes.patch("/Updateinfo/:id",Auth,upload.single('ProfilePictures'),UserController.UpdateUserinfo);



module.exports=Userroutes;