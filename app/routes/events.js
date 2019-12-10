const express = require('express')
const router = express.Router()
const eventsController = require('../controllers/eventsController.js')

router.get('/admin/events/create', eventsController.createEventForm)
router.get('/admin/events/edit/:id/', eventsController.editEventForm)
router.post('/admin/events', eventsController.validate, eventsController.saveEventData)
router.delete('/admin/events/:id', eventsController.deleteEventData)
router.put('/admin/events/:id', eventsController.validate, eventsController.editEventData)

router.get('/events', eventsController.showEventsPage)
router.get('/events/:id', eventsController.showEvent)
// API
router.get('/api/events', eventsController.apiEvents)
router.get('/api/events/:id', eventsController.apiEventData)
router.post('/api/admin/events/create', eventsController.validate, eventsController.apiCreateEvent)
router.put('/api/admin/events/edit/:id/', eventsController.validate, eventsController.apiEditEvent)
router.delete('/api/admin/events/:id', eventsController.apiDeleteEventData)
router.get('/api/cluster/:cluster', eventsController.apiCusterFilter)
router.get('/api/cup/:cup', eventsController.apiCupFilter)
router.get('/api/clustercup/:cluster/:cup', eventsController.apiClusterCupFilter)

module.exports = router
