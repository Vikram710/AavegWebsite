const TshirtDetail = require('../models/TshirtDetail.js')
const hostelController = require('./hostelController.js')
const { check, validationResult } = require('express-validator/check')
const logger = require('../../config/winston.js')
const config = require('../../config/config.js')
const json2csv = require('json2csv').parse

exports.displayTshirtForm = async (req, res) => {
  const hostelData = await hostelController.getHostels()
  const hostelNames = hostelData.map(hostel => hostel.name)
  const dept = config.deptList
  res.render('tshirt/tshirtReg', {
    data: {
      rollno: req.session.rollnumber,
      hostels: hostelNames,
      depts: dept
    },
    title: 'Tshirt'
  })
}

exports.validate = [
  check('rollno')
    .custom((rollno, { req }) => {
      if (req.session.rollnumber !== rollno) {
        throw new Error('Session and rollnumber does not match')
      } else {
        return true
      }
    })
    .custom(rollno => {
      const exRollNos = config.rollNoList
      if (rollno.toString()[5] !== '9' && !exRollNos.includes(rollno)) {
        throw new Error('Aaveg is only for first years. Thanks for remembering aaveg and taking time out to try this :p')
      } else {
        return true
      }
    }),
  check('hostel')
    .exists().withMessage('Hostel name missing')
    .custom(async (hostel) => {
      const hostelData = await hostelController.getHostels()
      const hostelNames = hostelData.map(hostel => hostel.name)
      hostelNames.push('Day Scholar')
      if (!hostelNames.includes(hostel)) {
        throw new Error('Hostel data incorrect')
      } else {
        return true
      }
    }),
  check('dept')
    .exists().withMessage('dept name missing')
    .custom(async (d) => {
      const dept = config.deptList
      if (!dept.includes(d)) {
        throw new Error('Department incorrect')
      } else {
        return true
      }
    }),
  check('phone')
    .exists().withMessage('Phone Number missing')
    .isMobilePhone('en-IN').withMessage('Invalid Phone Number'),
  check('name')
    .exists().withMessage('Name missing'),
  check('stype')
    .exists().withMessage('Student type missing'),
  check('size')
    .exists().withMessage('Size missing')
    .custom(size => {
      const availableSizes = ['S', 'M', 'L', 'XL', 'XXL']
      if (!availableSizes.includes(size)) {
        throw new Error('Size incorrect')
      } else {
        return true
      }
    })
]

exports.savetTshirtData = async (req, res) => {
  const errors = validationResult(req).array()
  if (errors.length) {
    const errorMessages = errors.map(error => error.msg)
    const hostelData = await hostelController.getHostels()
    const hostelNames = hostelData.map(hostel => hostel.name)
    logger.error({ user: req.session.rollnumber, errors: errorMessages })
    const data = req.body
    data.hostels = hostelNames
    data.depts = config.deptList
    res.render('tshirt/tshirtReg', {
      data: data,
      error: errorMessages,
      title: 'Tshirt'
    })
  } else {
    logger.info(`Registration done for ${req.session.rollnumber}`)
    const newTshirt = new TshirtDetail()
    newTshirt.hostel = req.body.hostel
    newTshirt.dept = req.body.dept
    newTshirt.size = req.body.requirement === 'foodcard' ? '' : req.body.size
    newTshirt.rollNumber = req.session.rollnumber
    newTshirt.phone = req.body.phone
    newTshirt.name = req.body.name
    newTshirt.isDayScholar = req.body.stype === 'ds'
    newTshirt.save().then(() => {
      res.redirect(config.APP_BASE_URL + 'tshirt')
    })
  }
}

exports.getExcel = async (req, res) => {
  try {
    const tshirtData = await TshirtDetail.find({}).exec()
    const fields = ['rollNumber', 'name', 'phone', 'hostel', 'size', 'dept']
    const opts = { fields }
    const data = json2csv(tshirtData, opts)
    res.attachment('tshirt.csv')
    res.status(200).send(data)
  } catch (err) {
    logger.error(err)
    res.status(500).json(err)
  }
}

exports.registrationCheck = async (req, res, next) => {
  try {
    const tshirtData = await TshirtDetail.find({ rollNumber: req.session.rollnumber }).exec()
    if (tshirtData.length) {
      return res.render('tshirt/alreadyRegistered', { title: 'Tshirt' })
    } else {
      return next()
    }
  } catch (err) {
    logger.error(err)
    res.status(500).send(err)
  }
}
