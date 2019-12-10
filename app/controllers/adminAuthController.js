const passport = require('passport')
const Admin = require('../models/Admin.js')
const jwt = require('jsonwebtoken')
const accessList = require('../../config/adminAccess.js')
const logger = require('../../config/winston.js')
const config = require('../../config/config')

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

exports.validateJWT = (req, res, next) => {
  if (!Object.prototype.hasOwnProperty.call(req.body, 'APIToken')) {
    return res.status(400).send({ message: 'Missing API Token' })
  }
  jwt.verify(req.body.APIToken, config.apiSecret, function (err, decoded) {
    if (err) {
      logger.error(err)
    }
    if (typeof decoded !== 'undefined') {
      Admin.findOne({ username: decoded.username }, function (err, admin) {
        if (!err && !!admin) {
          req.adminuser = decoded.username
          next()
        } else {
          logger.error(err)
          res.status(500).send({ message: 'Server Error' })
        }
      })
    } else {
      res.status(401)
      res.send({ message: 'Invalid API Token' })
    }
  })
}

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
    failureRedierct: '/apiLoginError'
  })

exports.apilogin = (req, res) => {
  const response = {}
  response.username = req.body.username

  response.APIToken = jwt.sign({ username: response.username, time: Date.now() }, config.apiSecret)

  logger.info(`Admin ${req.body.username} logged in using API`)
  res.send(response)
}
exports.apiLoginError = (req, res) => {
  const response = { }
  response.message = 'NOT WORKING'
  res.json(response)
}
