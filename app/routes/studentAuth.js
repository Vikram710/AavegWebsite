const express = require('express')
const router = express.Router()
const studentAuthController = require('../controllers/studentAuthController.js')

router.get('/studentLogin', studentAuthController.showLogin)
router.post('/studentLogin', studentAuthController.validateLogin, studentAuthController.logOutFromAdmin, studentAuthController.login)
router.get('/studentLogout', studentAuthController.checkStudentLogin, studentAuthController.logout)

router.post('/api/user/login', studentAuthController.validateLogin, studentAuthController.apiLogin)
router.get('/api/user/hostel', studentAuthController.getHostel)
router.put('/api/user/hostel', studentAuthController.validateHostel, studentAuthController.validateJWT, studentAuthController.setHostel)

module.exports = router
