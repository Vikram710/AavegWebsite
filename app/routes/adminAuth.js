const express = require('express')
const router = express.Router()
const adminAuthController = require('../controllers/adminAuthController.js')

// API
router.use('/api/admin/', adminAuthController.validateJWT)

module.exports = router
