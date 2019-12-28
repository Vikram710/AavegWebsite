const express = require('express')
const router = express.Router()
const adminAuthController = require('../controllers/adminAuthController.js')

// API
router.use('/api/admin/', adminAuthController.validateJWT)
router.post('/api/admin/isAdmin/', adminAuthController.isAdmin)

module.exports = router
