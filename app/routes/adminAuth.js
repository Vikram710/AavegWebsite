const express = require('express')
const router = express.Router()
const adminAuthController = require('../controllers/adminAuthController.js')

router.get('/login', adminAuthController.showLogin)
router.post('/login', adminAuthController.logOutFromStudent, adminAuthController.authenticate, adminAuthController.login)
router.get('/register', adminAuthController.showRegister)
router.get('/logout', adminAuthController.checkAdminLogin, adminAuthController.logout)
router.post('/register', adminAuthController.checkAdminAccess, adminAuthController.register)

// API
router.post('/api/login', adminAuthController.apiAuthenticate, adminAuthController.apilogin)
router.post('/api/register', adminAuthController.apiCheckAdminAccess, adminAuthController.apiRegister)
router.use('/api/admin/', adminAuthController.validateJWT)
router.post('/apiLoginError', adminAuthController.apiLoginError)

module.exports = router
