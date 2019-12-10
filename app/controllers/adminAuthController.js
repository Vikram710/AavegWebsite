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

exports.apiAuthenticate = passport.authenticate('local',
  {
    failureRedierct: 'Put a error response please'
  })

exports.apilogin = (req, res) => {
  let response ={}
  response.username = req.body.username

  response.APIToken = jwt.sign({ username: response.username, time: Date.now() }, config.apiSecret)

  logger.info(`Admin ${req.body.username} logged in using API`)
  res.send(response)
}
