const jwt = require('jsonwebtoken')
const accessList = require('../../config/adminAccess.js')
const logger = require('../../config/winston.js')
const config = require('../../config/config')

exports.validateJWT = (req, res, next) => {
  if (!Object.prototype.hasOwnProperty.call(req.body, 'APIToken')) {
    return res.status(400).send({ message: 'Missing API Token' })
  }
  jwt.verify(req.body.APIToken, config.apiSecret, function (err, decoded) {
    if (err) {
      logger.error(err)
    }
    console.log(accessList, decoded, decoded.rollnumber);
    if (typeof decoded !== 'undefined' && accessList.includes(decoded.rollnumber)) {
      req.adminuser = decoded.rollnumber
      next()
    } else {
      res.status(401)
      res.send({ message: 'Invalid API Token' })
    }
  })
}

exports.isAdmin = (req, res) => {
  res.send({ isAdmin: true })
}
