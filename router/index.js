const Router = require("express").Router
const UserController = require("../controllers/userController")
const {body} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
const router = new Router()

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max:32}),
    UserController.registration)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)
router.get('/activate/:link', UserController.activate)
router.get('/refresh', UserController.refresh)
router.get('/purchase',authMiddleware)



module.exports = router