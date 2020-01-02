const mongoose = require('mongoose')
const logger = require('../../config/winston.js')
const Event = require('../models/Event.js')
const Cup = require('../models/Cup.js')
const Cluster = require('../models/Cluster.js')
const venueController = require('./venueController.js')
const { check, validationResult } = require('express-validator/check')
const ObjectId = mongoose.Types.ObjectId

/* Returns venue data, cluster names, cup names all at once for simplification */
async function getVenueClusterCup () {
  const venue = venueController.getVenues()
  const clusterData = Cluster.find({}).exec()
  const cupData = Cup.find({}).exec()
  const [venueData, clusterNames, cupNames] = await Promise.all([venue, clusterData, cupData])
  return {
    venueData,
    clusterNames: clusterNames.map(a => a.name),
    cupNames: cupNames.map(a => a.name)
  }
}

exports.validate = [
  check('name')
    .trim().not().isEmpty().withMessage('Event name is missing'),
  check('cluster')
    .custom(async (cluster) => {
      const clusterNames = (await getVenueClusterCup()).clusterNames
      if (!clusterNames.includes(cluster)) {
        throw new Error('Select appropriate cluster')
      } else {
        return true
      }
    }),
  check('cup')
    .custom(async (cup) => {
      const cupNames = (await getVenueClusterCup()).cupNames
      if (!cupNames.includes(cup)) {
        throw new Error('Select appropriate cup')
      } else {
        return true
      }
    }),
  check('venue')
    .exists().withMessage('Venue is missing')
    .custom(async (venue) => {
      const venueData = await venueController.getVenues()
      const venueName = venueData.map(v => v.name.toString())
      if (!venueName.includes(venue)) {
        throw new Error('Venue data incorrect')
      } else {
        return true
      }
    }),
  check('description')
    .trim().isLength({ min: 1, max: 1000 }).withMessage('Your description is either blank or too long'),
  check('rules')
    .trim().not().isEmpty().withMessage('Rules is missing'),
  check('startTime')
    .not().isEmpty().withMessage('Start time is missing')
]

exports.apiEvents = async (req, res) => {
  try {
    const eventsByCluster = await Event.aggregate([
      {
        $group: {
          _id: '$cluster',
          events: { $push: '$$ROOT' }
        }
      }
    ])
    res.json({ title: 'Events', eventsData: eventsByCluster })
  } catch (e) {
    res.status(500).json({ title: 'Error', error: 'Internal server error' })
  }
}

exports.apiEventData = async (req, res) => {
  try {
    const eventData = await Event.aggregate([
      { $match: { _id: ObjectId(req.params.id) } },
      { $group: { _id: '$name', details: { $push: '$$ROOT' } } }
    ])
    if (eventData) {
      return res.json(eventData)
    }
  } catch (e) {
    logger.error(e)
    return res.json({ title: 'Error', error: 'Internal server error' })
  }
}

exports.apiDeleteEventData = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id).exec()
    logger.info(`Event ${req.params.id} deleted by ${req.adminuser}`)
    res.sendStatus(200)
  } catch (err) {
    logger.error(err)
    res.sendStatus(500)
  }
}

exports.apiCreateEvent = async (req, res) => {
  const errors = validationResult(req).array()
  const errorMessages = errors.map(error => error.msg)
  logger.error({ errors: errorMessages })
  const response = {}
  if (errors.length) {
    response.message = 'error'
    response.error = errorMessages
    res.json(response)
  } else {
    try {
      req.body.date = req.body.startTime.split(' ')[0]
      req.body.startTime = req.body.startTime.split(' ')[1]
      console.log(req.body)
      const { name, cluster, cup, description, rules, date, startTime, points, venue, places } = req.body
      const newEvent = await Event.create({
        name,
        cluster,
        cup,
        description,
        rules,
        date,
        startTime,
        points,
        venue,
        places
      })
      logger.info(`Event ${newEvent.name} has been created by ${req.adminuser}`)
      response.message = `Event ${newEvent.name} has been created by ${req.adminuser}`
      res.json(response)
    } catch (err) {
      logger.error(err)
      res.json({ title: 'Error', error: 'Internal server error' })
    }
  }
}

exports.apiEditEvent = async (req, res) => {
  const errors = validationResult(req).array()
  const errorMessages = errors.map(error => error.msg)
  logger.error({ errors: errorMessages })
  const response = {}
  if (errors.length) {
    response.message = 'error'
    response.error = errorMessages
    res.json(response)
  } else {
    try {
      const eventToEdit = await Event.findById(req.params.id)
      const {
        name, cluster, cup, description, rules, venue, date, startTime, endTime, places, points
      } = req.body
      Object.assign(eventToEdit, {
        name,
        cluster,
        cup,
        description,
        rules,
        venue,
        date,
        startTime,
        endTime,
        places,
        points
      })
      await eventToEdit.save()
      logger.info(`Event ${eventToEdit.name} has been Edited by ${req.adminuser}`)
      response.message = `Event ${eventToEdit.name} has been Edited by ${req.adminuser}`
      res.json(response)
    } catch (err) {
      logger.error(err)
      res.json({ title: 'Error', error: 'Internal server error' })
    }
  }
}

exports.apiGetCups = async (req, res) => {
  try {
    const cupData = await Cup.find({}).exec()
    return res.send(cupData)
  } catch (error) {
    return res.status(500).send(error)
  }
}

exports.apiGetClusters = async (req, res) => {
  try {
    const clusterData = await Cluster.find({}).exec()
    return res.send(clusterData)
  } catch (error) {
    return res.status(500).send(error)
  }
}

// FILTERS
exports.apiCusterFilter = async (req, res) => {
  try {
    const eventData = await Event.aggregate([
      { $match: { cluster: req.params.cluster } },
      { $group: { _id: '$name', details: { $push: '$$ROOT' } } }
    ])
    if (eventData) {
      return res.json(eventData)
    }
  } catch (e) {
    logger.error(e)
    return res.json({ title: 'Error', error: 'Internal server error' })
  }
}

exports.apiCupFilter = async (req, res) => {
  try {
    const eventData = await Event.aggregate([
      { $match: { cup: req.params.cup } },
      { $group: { _id: '$name', details: { $push: '$$ROOT' } } }
    ])
    if (eventData) {
      return res.json(eventData)
    }
  } catch (e) {
    logger.error(e)
    return res.json({ title: 'Error', error: 'Internal server error' })
  }
}

exports.apiClusterCupFilter = async (req, res) => {
  try {
    const eventData = await Event.aggregate([
      {
        $match: {
          $and: [
            { cup: req.params.cup },
            { cluster: req.params.cluster }
          ]
        }
      },
      { $group: { _id: '$name', details: { $push: '$$ROOT' } } }
    ])
    if (eventData) {
      return res.json(eventData)
    }
  } catch (e) {
    logger.error(e)
    return res.json({ title: 'Error', error: 'Internal server error' })
  }
}
