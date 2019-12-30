const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  name: 'string',
  cluster: 'string',
  cup: 'string',
  points: ['number'],
  places: 'number',
  venue: 'string',
  description: 'string',
  rules: 'string',
  startTime: 'string',
  endTime: 'string',
  date: 'string'
})

module.exports = mongoose.model('Event', eventSchema)
