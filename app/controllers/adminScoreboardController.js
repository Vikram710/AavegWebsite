const config = require('../../config/config')
const logger = require('../../config/winston.js')
const { check, validationResult } = require('express-validator/check')
const Events = require('../models/Event.js')
const Hostels = require('../models/Hostel.js')
const Score = require('../models/Score.js')

exports.getPoints = async (req, res) => {
  const event = await Events.findById(req.query.data).exec()
  return res.status(200).send(event.points)
}

exports.validate = [
  check('eventId')
    .exists().withMessage('Event missing')
    .custom(async (eventId) => {
      const eventData = await Events.find({}).exec()
      const eventIdList = eventData.map(eventId => eventData._id)
      if (!eventIdList.includes(eventId)) {
        throw new Error('Event data incorrect')
      } else {
        return true
      }
    }),
  check('position*').exists().withMessage('Hostel missing')
    .custom(async (hostelId) => {
      const hostelData = await Hostels.find({}).exec()
      const hostelIdList = hostelData.map(hostelId => hostelData._id)
      if (!hostelIdList.includes(hostelId)) {
        throw new Error('Hostel data incorrect')
      } else {
        return true
      }
    }),
  check('points*', 'It should be a whole number').isInt()

]

exports.createScore = async (req, res) => {
  const errors = validationResult(req).array()
  if (errors.length) {
    const errorMessages = errors.map(error => error.msg)
    logger.error({ user: req.session.rollnumber, errors: errorMessages })
    const data = req.body
    res.render('admin/scoreboard', {
      data: data,
      error: errorMessages
    })
  } else {
    await Score.deleteMany({ event: req.body.eventId }).exec()
    const noOfPositions = []// array of hostels at different positions with keys position1, position2... in the body's object
    const noOfPoints = []// array of points of different positions with keys points1,points2.... in the body's object
    const keys = Object.keys(req.body)
    keys.forEach(function (item) {
      if (item.indexOf('position') !== -1) {
        if (typeof req.body[item] !== 'object') {
          const tempStr = req.body[item]
          req.body[item] = [tempStr]
        }
        noOfPositions.push(req.body[item])// items entered into the array after checking the key
      }
      if (item.indexOf('points') !== -1) { noOfPoints.push(req.body[item]) }// items added into the array after checking the key
    })
    for (let j = 0; j < noOfPositions.length; j++) {
      const hostelList = noOfPositions[j]// get hostels at a particular position
      const points = noOfPoints[j]// get points at a particular position
      for (let i = 0; i < hostelList.length; i++) {
        const pos = new Score({
          hostel: hostelList[i],
          event: req.body.eventId,
          position: (j + 1),
          points: points
        })
        try {
          const savedPos = await pos.save()
          logger.info(`Scores of ${savedPos._id} added by ${req.user.username}`)
        } catch (error) {
          logger.error(error)
          return res.status(500).send(error)
        }
      }
    }
    res.redirect(config.APP_BASE_URL + 'events')
  }
}
