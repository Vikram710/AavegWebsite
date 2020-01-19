const express = require('express')
const router = express.Router()
const studentAuthController = require('../controllers/studentAuthController.js')

router.post('/studentLogin', studentAuthController.validateLogin, studentAuthController.apiLogin)
router.use('/user', studentAuthController.validateJWT)

module.exports = router
