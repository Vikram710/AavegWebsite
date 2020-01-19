const express = require('express')
const router = express.Router()
const adminAuthController = require('../controllers/adminAuthController.js')

// API
router.use('/admin/', adminAuthController.validateJWT)
router.post('/admin/isAdmin/', adminAuthController.isAdmin)

module.exports = router
