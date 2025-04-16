require("dotenv").config();
const jwt = require('jsonwebtoken');
let CreateOTPandToken = (Userdata) => {
    //  Create OTP
    let OTP = Math.floor(100000 + Math.random() * 900000);

    // Create Token
    let Token = jwt.sign({ Userdata, OTP }, process.env.Token_privateKey, { expiresIn: '1h' });

    return { OTP, Token };

}

module.exports = CreateOTPandToken