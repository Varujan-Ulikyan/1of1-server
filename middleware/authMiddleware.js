const ApiError = require('../exeptions/apiError')
const tokenService = require("../services/TokenService")

module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization
        if(!authorizationHeader){
            return next(ApiError.unothorizedError())
        }

        const accsesToken = authorizationHeader.split(' ')[1]
        if(!accsesToken){
            return next(ApiError.unothorizedError())
        }

        const userData = tokenService.validationAccesToken(accsesToken)
        if(!userData){
            return next(ApiError.unothorizedError())
        }

        req.user = userData
        next()
    } catch (error) {
        return next(ApiError.unothorizedError())
    }
}