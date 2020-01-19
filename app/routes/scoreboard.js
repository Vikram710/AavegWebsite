const express = require('express')
const router = express.Router()
const scoreController = require('../controllers/scoreboardController.js')
const adminScoreController = require('../controllers/adminScoreboardController.js')

router.get('/scoreboard', scoreController.apiScoreboard)
router.get('/scoreboard/full', scoreController.getScoreData)
router.get('/scoreboard/event/:eventId', scoreController.apiEventScore)

router.post('/admin/scoreboard', adminScoreController.apiCreateScore)

module.exports = router
