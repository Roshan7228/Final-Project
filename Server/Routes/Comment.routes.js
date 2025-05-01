let express=require("express");
const Commentcontroller = require("../Controller/Comment.controller");
const Auth = require("../Middleware/Auth");
const isAdmin = require("../Middleware/Admin");


let Commentroutes=express.Router();

Commentroutes.post("/createcomment/:postid",Auth,Commentcontroller.create);
Commentroutes.delete("/deletecomment/:userId/:commentid",Auth,Commentcontroller.deletecomment);
Commentroutes.patch("/updatecomment/:userId/:commentid",Auth,Commentcontroller.Updatecomment);
Commentroutes.get("/allcomment/:Postid",Auth,Commentcontroller.getPostallcomment);
Commentroutes.get("/allcommentadmin/:userid",Auth,isAdmin,Commentcontroller.getALlbyadmincomment);
Commentroutes.patch("/like-comment/:userid/:commentid",Auth,Commentcontroller.commentLikeAction);

module.exports=Commentroutes;
