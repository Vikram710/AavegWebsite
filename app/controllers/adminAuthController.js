const passport = require('passport')
const Admin = require('../models/Admin.js')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator/check')
const accessList = require('../../config/adminAccess.js')
const logger = require('../../config/winston.js')
const config = require('../../config/config')
const imaps = require('imap-simple')

exports.showLogin = (req, res) => {
  res.render('auth/admin/login', { title: 'Login' })
}

exports.showRegister = (req, res) => {
  res.render('auth/admin/register', { title: 'Register' })
}

exports.authenticate = passport.authenticate('local',
  {
    failureRedirect: config.APP_BASE_URL + 'login'
  })

exports.logout = (req, res) => {
  req.logout()
  req.session.type = null
  req.session.save()
  res.redirect(config.APP_BASE_URL)
}

exports.logOutFromStudent = (req, res, next) => {
  if (req.session.type === 'student') {
    req.session.username = null
    req.session.type = null
  }
  next()
}

exports.login = (req, res) => {
  req.session.type = 'admin'
  req.session.save()
  res.redirect(config.APP_BASE_URL)
}

exports.register = (req, res) => {
  const newAdmin = {
    username: req.body.username,
    permissions: accessList[req.body.username]
  }
  Admin.register(new Admin(newAdmin), req.body.password, (err, newAdmin) => {
    if (err) {
      logger.error(err.message)
      return res.redirect(config.APP_BASE_URL + 'register')
    } else {
      passport.authenticate('local')(req, res, () => {
        res.redirect(config.APP_BASE_URL)
      })
    }
  })
}
// Check if the admin should be allowed to register
exports.checkAdminAccess = (req, res, next) => {
  if (Object.keys(accessList).includes(req.body.username)) {
    next()
  } else {
    logger.warn(`Access denied for ${req.body.username}`)
    res.redirect(config.APP_BASE_URL + 'register') // Need to dsiplay a message saying access denied
  }
}

// Middleware for admin login check
exports.checkAdminLogin = (req, res, next) => {
  if (req.session && req.session.type === 'admin' && req.user.permissions.length) {
    return next()
  } else {
    res.redirect(config.APP_BASE_URL + 'login')
  }
}

exports.getAdminUsernames = async () => {
  const admins = await Admin.find({}).exec()
  return admins.map(admin => admin.username)
}

// API

// Check if the admin should be allowed to register
exports.apiCheckAdminAccess = (req, res, next) => {
  if (Object.keys(accessList).includes(req.body.username)) {
    next()
  } else {
    logger.warn(`Access denied for ${req.body.username}`)
    res.json({ error: `Access denied for ${req.body.username}` })
  }
}

exports.apiRegister = (req, res) => {
  const newAdmin = {
    username: req.body.username,
    permissions: accessList[req.body.username]
  }
  Admin.register(new Admin(newAdmin), req.body.password, (err, newAdmin) => {
    if (err) {
      logger.error(err.message)
      return res.send({ message: 'Bad Request', error: err })
    } else {
      passport.authenticate('local')(req, res, () => {
        res.send({ message: 'Registered', username: req.body.username })
      })
    }
  })
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
      user: req.body.username,
      password: req.body.password,
      host: '203.129.195.133',
      port: 143,
      tls: false,
      authTimeout: 30000
    }
  }
  imaps.connect(imapConfig).then(async connection => {
    const response = {}
    // Find User ID
    Admin.findOne({ username: req.body.username }, function (err, admin) {
      if (err || !admin) {
        logger.error(err)
        res.status(400)
        response.message = 'Not admin'
        res.send(response)
      } else {
        response.username = admin.username

        response.APIToken = jwt.sign({ username: response.username, time: Date.now() }, config.apiSecret)

        logger.info(`Admin ${req.body.username} logged in using API`)

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
