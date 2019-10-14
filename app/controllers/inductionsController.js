// const logger = require('../../config/winston.js')
// const config = require('../../config/config')

exports.show = (req, res) => {
  res.render('inductions', { title: 'Inductions', rollnumber: req.session.rollnumber })
}
