const express = require('express')
const router = express.Router()
const studentAuthController = require('../controllers/studentAuthController.js')

router.get('/studentLogin', studentAuthController.showLogin)
router.post('/studentLogin', studentAuthController.validateLogin, studentAuthController.logOutFromAdmin, studentAuthController.login)
router.get('/studentLogout', studentAuthController.checkStudentLogin, studentAuthController.logout)

router.post('/api/studentLogin', studentAuthController.validateLogin, studentAuthController.apiLogin)
router.use('/api/user', studentAuthController.validateJWT)

module.exports = router
