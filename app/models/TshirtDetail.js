const mongoose = require('mongoose')

const tshirtDetailSchema = new mongoose.Schema({
  rollNumber: 'number',
  name: 'string',
  phone: 'number',
  hostel: 'string',
  size: 'string'
})

module.exports = mongoose.model('TshirtDetail', tshirtDetailSchema)
