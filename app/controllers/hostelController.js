const Hostels = require('../models/Hostel.js')
const Student = require('../models/Student.js')
const { check, validationResult } = require('express-validator/check')
const logger = require('../../config/winston.js')

exports.validateSetHostel = [
  check('hostel')
    .exists().withMessage('Hostel Name Missing')
    .custom(async (hostel) => {
      const hostelData = await exports.getHostels()
      const hostelNames = hostelData.map(hostel => hostel.name)
      if (!hostelNames.includes(hostel)) {
        throw new Error('Hostel data incorrect')
      } else {
        return true
      }
    })
]

exports.getHostels = async () => {
  const hostelData = await Hostels.find({}).exec()
  return hostelData
}

exports.getHostelById = async (id) => {
  const hostel = await Hostels.findById(id).exec()
  return hostel
}

exports.getHostelByName = async (name) => {
  const hostel = await Hostels.find({ name: name }).exec()
  return hostel
}

exports.getHostelData = async (req, res) => {
  try {
    const hostelData = await Hostels.find({}).exec()
    return res.send(hostelData)
  } catch (error) {
    return res.status(500).send(error)
  }
}

exports.setHostel = (req, res) => {
  const errors = validationResult(req).array()
  if (errors.length) {
    logger.error(errors.map(error => error.msg))

    res.status(400)
    res.send({ message: 'Bad Request' })
    return false
  }

  Student.findById(
    req.user_id,
    function (err, student) {
      if (err) {
        logger.error(err)
      }
      student.hostel = req.body.hostel
      student.save()
      res.send({ message: 'Hostel Updated' })
    }
  )
}

exports.getHostel = (req, res) => {
  Student.findById(
    req.user_id,
    function (err, student) {
      if (err) {
        logger.error(err)
      }
      if (!student) {
        res.status(400)
        res.send({ message: 'User does not exist' })
      } else {
        const response = {
          hostel_chosen: student.hostel !== 'Not Chosen',
          hostel: student.hostel || 'Not Chosen'
        }
        res.send(response)
      }
    }
  )
}
