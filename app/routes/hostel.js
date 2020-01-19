const express = require('express')
const router = express.Router()
const hostelController = require('../controllers/hostelController.js')

router.get('/hostels', hostelController.getHostelData)

router.post('/user/hostel', hostelController.getHostel)
router.put('/user/hostel', hostelController.validateSetHostel, hostelController.setHostel)

module.exports = router
