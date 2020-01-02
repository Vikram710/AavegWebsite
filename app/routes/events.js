const express = require('express')
const router = express.Router()
const eventsController = require('../controllers/eventsController.js')

router.get('/api/clusters', eventsController.apiGetClusters)
router.get('/api/cups', eventsController.apiGetCups)

router.get('/api/events', eventsController.apiEvents)
router.get('/api/events/:id', eventsController.apiEventData)
router.get('/api/events/cluster/:cluster', eventsController.apiCusterFilter)
router.get('/api/events/cup/:cup', eventsController.apiCupFilter)
router.get('/api/events/clustercup/:cluster/:cup', eventsController.apiClusterCupFilter)

router.post('/api/admin/events/create', eventsController.validate, eventsController.apiCreateEvent)
router.put('/api/admin/events/edit/:id/', eventsController.validate, eventsController.apiEditEvent)
router.delete('/api/admin/events/:id', eventsController.apiDeleteEventData)

module.exports = router
