let jwt = require('jsonwebtoken');


function Auth(request, response, next) {
    try {
        let token = request.cookies.Access_Token
        if (!token) {
            return response.status(400).json({
                message: "Access Denied: No Token Provided"
            })
        }
        let decoded = jwt.verify(token, process.env.User_Token_privateKey);
        if (!decoded) {
            return response.status(400).json({
                message: "Not Authorized"
            })
        }

        request.User = decoded.Userdata;
        next();
    } catch (error) {
        return response.status(400).json({
            message: error.message
        })
    }
}
module.exports = Auth;