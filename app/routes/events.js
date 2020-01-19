const express = require('express')
const router = express.Router()
const eventsController = require('../controllers/eventsController.js')

router.get('/clusters', eventsController.apiGetClusters)
router.get('/cups', eventsController.apiGetCups)
router.get('/venue', eventsController.apiGetVenue)

router.get('/events', eventsController.apiEvents)
router.get('/events/:id', eventsController.apiEventData)
router.get('/events/cluster/:cluster', eventsController.apiCusterFilter)
router.get('/events/cup/:cup', eventsController.apiCupFilter)
router.get('/events/clustercup/:cluster/:cup', eventsController.apiClusterCupFilter)

router.post('/admin/events/create', eventsController.validate, eventsController.apiCreateEvent)
router.put('/admin/events/edit/:id/', eventsController.validate, eventsController.apiEditEvent)
router.delete('/admin/events/:id', eventsController.apiDeleteEventData)

module.exports = router
