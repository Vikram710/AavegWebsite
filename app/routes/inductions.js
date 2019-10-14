const express = require('express')
const router = express.Router()
const inductionsController = require('../controllers/inductionsController.js')
const studentAuthController = require('../controllers/studentAuthController.js')

router.get('/', studentAuthController.checkStudentLogin, studentAuthController.checkFirstYear, inductionsController.show)

module.exports = router
