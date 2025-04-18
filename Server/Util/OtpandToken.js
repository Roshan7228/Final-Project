require("dotenv").config();
const jwt = require('jsonwebtoken');

let CreateOTPandToken = (Userdata, Privatekey, ExprieTime) => {
    // Create OTP
    let OTP = Math.floor(100000 + Math.random() * 900000);
    // Update Email in Userdata if it is passed
    
    
    // Create Token
    let Token = jwt.sign({ Userdata, OTP }, Privatekey, { expiresIn: ExprieTime });

    return { OTP, Token };
}

module.exports = CreateOTPandToken;
