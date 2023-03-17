const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
    email: {type: String, uniqe: true, required: true},
    password: {type: String, required: true},
    phone: {type: Number, required: true, uniqe: true},
    country: {type: String, required: true},
    city: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String, required: true}
})

module.exports = model('User', UserSchema)