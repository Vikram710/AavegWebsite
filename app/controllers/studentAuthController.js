const imaps = require('imap-simple')
const jwt = require('jsonwebtoken')
const Student = require('../models/Student.js')
const { check, validationResult } = require('express-validator/check')
const logger = require('../../config/winston.js')
const config = require('../../config/config')

exports.validateLogin = [
  check('rollnumber')
    .exists().withMessage('Roll Number missing'),
  check('password')
    .exists().withMessage('Password Missing')
]

exports.showLogin = (req, res) => {
  res.render('auth/student/login', { title: 'Login' })
}

exports.login = async (req, res) => {
  const errors = validationResult(req).array()
  if (errors.length) {
    logger.error(errors.map(error => error.msg))

    res.status(400)
    res.send({ message: 'Bad Request' })
    return false
  }

  const imapConfig = {
    imap: {
      user: req.body.rollnumber,
      password: req.body.password,
      host: '203.129.195.133',
      port: 143,
      tls: false,
      authTimeout: 30000
    }
  }

  imaps.connect(imapConfig).then(connection => {
    req.logout()
    req.session.rollnumber = req.body.rollnumber
    req.session.type = 'student'
    req.session.save()
    logger.info(`student ${req.session.rollnumber} logged in`)
    res.redirect(config.APP_BASE_URL)
  }).catch(err => {
    logger.error(err)
    return res.redirect(config.APP_BASE_URL + 'studentLogin')
  })
}

exports.checkStudentLogin = (req, res, next) => {
  if (req.session.rollnumber && req.session.type === 'student') {
    next()
  } else {
    res.redirect(config.APP_BASE_URL + 'studentLogin')
  }
}

exports.logout = (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect(config.APP_BASE_URL)
}
exports.logOutFromAdmin = (req, res, next) => {
  req.logout()
  next()
}

exports.apiLogin = async (req, res) => {
  const errors = validationResult(req).array()
  if (errors.length) {
    logger.error(errors.map(error => error.msg))

    res.status(400)
    res.send({ message: 'Bad Request' })
    return false
  }

  const imapConfig = {
    imap: {
      user: req.body.rollnumber,
      password: req.body.password,
      host: '203.129.195.133',
      port: 143,
      tls: false,
      authTimeout: 30000
    }
  }

  imaps.connect(imapConfig).then(async connection => {
    let response = {
      message: 'Login Successful'
    }

    // Find User ID
    Student.findOne({ rollnumber: req.body.rollnumber }, function (err, student) {
      if (err) {
        logger.error(err)
      }

      // If student doesn't exist create a new entry.
      if (!student) {
        Student.create({ rollnumber: req.body.rollnumber, hostel: 'Not Chosen' }, function (err, newstudent) {
          if (err) {
            logger.error(err)
          }
          response.user_id = newstudent.id

          response.APIToken = jwt.sign({ user_id: response.user_id, time: Date.now() }, config.apiSecret)

          logger.info(`student ${req.body.rollnumber} logged in using API`)

          res.status(200)
          res.send(response)
        })
      } else {
        response.user_id = student.id

        response.APIToken = jwt.sign({ user_id: response.user_id, time: Date.now() }, config.apiSecret)

        logger.info(`student ${req.body.rollnumber} logged in using API`)

        res.status(200)
        res.send(response)
      }
    })
  }).catch(err => {
    logger.error(err)

    const response = {
      message: 'Invalid Credentials'
    }

    res.status(401)
    res.send(response)
  })
}

exports.validateJWT = (req, res, next) => {
  if (!req.body.hasOwnProperty('APIToken')) {
    res.status(500)
    return res.send({ message: 'Missing API Token' })
  }

  jwt.verify(req.body.APIToken, config.apiSecret, function (err, decoded) {
    if (err) {
      logger.error(err)

      res.status(401)
      res.send({ message: 'Invalid API Token' })
    } else {
      Student.findById(decoded.user_id, function (err, student) {
        if (err) {
          logger.error(err)
        }
        if (!student) {
          res.status(401)
          res.send({ message: 'Invalid API Token' })
        } else {
          req.user_id = decoded.user_id
          next()
        }
      })
    }
  })
}
