let express = require('express');
const Connection = require('./Config/db');
const Userroutes = require('./Routes/User.routes');
require("dotenv").config();
const cookieParser = require('cookie-parser')
let app = express();
app.set("view engine","ejs");
app.use(cookieParser());
app.use(express.static("./UpdateImage"));

app.use(express.json());



app.use("/api/users", Userroutes);


app.listen(process.env.PORT || 8000, async () => {
    try {
        await Connection;
        console.log(`Server was Start on Port ${process.env.PORT}`);
    } catch (error) {
        console.log(error);
    }
});
