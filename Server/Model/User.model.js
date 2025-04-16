let mongoose = require("mongoose");


let UserSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    role: {
        type: Boolean,
        default: false
    },
    ProfilePicture: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/5951/5951752.png"
    }
},{
    timestamps:true
})


let UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;