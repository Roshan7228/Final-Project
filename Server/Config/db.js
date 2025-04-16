let mongoose=require("mongoose");
require("dotenv").config();
let Connection=mongoose.connect(process.env.Mongoose_URL);

module.exports=Connection