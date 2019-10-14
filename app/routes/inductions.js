const express = require('express')
const router = express.Router()
const inductionsController = require('../controllers/inductionsController.js')

router.get('/', inductionsController.show)

module.exports = router
