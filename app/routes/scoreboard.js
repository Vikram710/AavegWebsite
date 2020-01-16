const express = require('express')
const router = express.Router()
const scoreController = require('../controllers/scoreboardController.js')
const adminScoreController = require('../controllers/adminScoreboardController.js')

router.get('/api/scoreboard', scoreController.apiScoreboard)
router.get('/api/scoreboard/full', scoreController.getScoreData)
router.get('/api/scoreboard/event/:eventId', scoreController.apiEventScore)

router.post('/api/admin/scoreboard', adminScoreController.apiCreateScore)

module.exports = router
