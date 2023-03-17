const jwt = require('jsonwebtoken')
const tokenModel = require('../models/TokenModel')
class TokenSerivce {
    generateTokens(payload){
        const accsesToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accsesToken,
            refreshToken
        }
    }
    async saveToken(userId, refreshToken){
        const tokenData = await tokenModel.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const token = await tokenModel.create({user: userId, refreshToken})
        return token
    }

    async removeToken(refreshToken){
        const tokenData = await tokenModel.deleteOne({ refreshToken })
        return tokenData
    }

    async findToken(refreshToken){
        const tokenData = await tokenModel.findOne({ refreshToken })
        return tokenData
    }

    validationAccesToken(token){
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch (error) {
            return null
        }
    }
    validationRefreshToken(token){
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        } catch (error) {
            return null
        }
    }


}

module.exports = new TokenSerivce()