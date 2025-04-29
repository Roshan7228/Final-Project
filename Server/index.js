let express = require('express');
const Connection = require('./Config/db');
const Userroutes = require('./Routes/User.routes');
require("dotenv").config();
const cookieParser = require('cookie-parser');
const Postroutes = require('./Routes/Post.routes');
const Commentroutes = require('./Routes/Comment.routes');
let app = express();
app.set("view engine","ejs");
app.use(cookieParser());
app.use(express.static("./UploadImage"));

app.use(express.json());



app.use("/api/users", Userroutes);
app.use("/api/post",Postroutes);
app.use("/api/comment",Commentroutes);

app.listen(process.env.PORT || 8000, async () => {
    try {
        await Connection;
        console.log(`Server was Start on Port ${process.env.PORT}`);
    } catch (error) {
        console.log(error);
    }
});
