
function isAdmin(request, response, next) {
    if (request.User.role) {
        next()
    }
    return response.status(400).json({
        message: "You Can't Access."
    })

}
module.exports = isAdmin