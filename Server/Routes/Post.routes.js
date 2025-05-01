let express=require("express");
const PostController = require("../Controller/Post.controller");
const Auth = require("../Middleware/Auth");
const upload = require("../Config/Multer.config");
const isAdmin = require("../Middleware/Admin");

let Postroutes=express.Router();

Postroutes.post("/createpost",Auth,PostController.Createpost);
Postroutes.delete("/delete/:userid/:id",Auth,PostController.Deletepost);
Postroutes.patch("/update/:userid/:id",Auth,upload.single("PostImage"),PostController.Update);
Postroutes.get("/discription/:userid/:id",Auth,PostController.GetSinglepost);
Postroutes.get('/allpost',Auth,PostController.GetAllPost);
Postroutes.get("/getpostbyuser/:userid",Auth,PostController.GetAllPostbyUser);
Postroutes.patch("/like-post/:userid/:Postid",Auth,PostController.getpostlike);
Postroutes.get("/alllikebyadmin/:userid",Auth,isAdmin,PostController.getalllikebyadmin);
Postroutes.get("/alllikepost/:Postid",Auth,PostController.getalllikepost);

module.exports=Postroutes