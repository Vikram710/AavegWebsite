const express = require('express')
const router = express.Router()
const hostelController = require('../controllers/hostelController.js')

router.get('/api/hostels', hostelController.getHostelData)

router.post('/api/user/hostel', hostelController.getHostel)
router.put('/api/user/hostel', hostelController.validateSetHostel, hostelController.setHostel)

module.exports = router
