const UserModel = require("../models/UserModel")
const bcrypt = require("bcrypt")
const uuid = require('uuid')
const mailService = require("../services/mailService")
const tokenService = require('./TokenService')
const UserDto = require('../dtos/userDtos')
const ApiError = require("../exeptions/apiError")
class UserService {
    async registration(email, password, phone, country, city) {
        const candidate = await UserModel.findOne({email})
        const phoneCandidate = await UserModel.findOne({phone})
        if (candidate || phoneCandidate) {
            throw ApiError.badRequest("User with that email or phone number already exist!")            
        }
        const activationLink = uuid.v4()
        const hashPassword = await bcrypt.hash(password, 3)
        const user = await UserModel.create({email, password: hashPassword, phone, country, city, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)
        const userDto = new UserDto(user) 
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink){
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.badRequest('incorrect activation link')
        }
        user.isActivated = true
        await user.save()
    }

    async login(email, password){
        const user = await UserModel.findOne({email})
        if(!user){
            throw ApiError.badRequest('User did`t find')
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if(!isPassEquals){
            throw ApiError.badRequest('wrong password')
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.unothorizedError()
        }
        const userData = tokenService.validationRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)

        if(!userData || !tokenFromDb){
            throw ApiError.unothorizedError()
        }

        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }
}

module.exports = new UserService()