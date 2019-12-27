const express = require('express')
const router = express.Router()
const studentAuthController = require('../controllers/studentAuthController.js')

router.post('/api/studentLogin', studentAuthController.validateLogin, studentAuthController.apiLogin)
router.use('/api/user', studentAuthController.validateJWT)

module.exports = router
