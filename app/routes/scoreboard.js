const express = require('express')
const router = express.Router()
const scoreController = require('../controllers/scoreboardController.js')
const adminScoreboardController = require('../controllers/adminScoreboardController.js')

router.get('/admin/scoreboard', adminScoreboardController.showScoreForm)
router.post('/admin/scoreboard', adminScoreboardController.createScore)
// router.get('/scoreboard', scoreController.showScoreboard)
// router.get('/getPoints', adminScoreboardController.getPoints)

// API
router.get('/api/scoreboard', scoreController.apiScoreboard)
router.get('/api/scoreboard/full', scoreController.getScoreData)
router.get('/api/scoreboard/event/:eventId', scoreController.apiEventScore)

module.exports = router
