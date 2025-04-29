let express=require("express");
const Commentcontroller = require("../Controller/Comment.controller");
const Auth = require("../Middleware/Auth");


let Commentroutes=express.Router();

Commentroutes.post("/createcomment/:postid",Auth,Commentcontroller.create);
Commentroutes.delete("/deletecomment/:userId/:commentid",Auth,Commentcontroller.deletecomment);
Commentroutes.patch("/updatecomment/:userId/:commentid",Auth,Commentcontroller.Updatecomment);

module.exports=Commentroutes;