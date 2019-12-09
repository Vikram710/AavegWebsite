const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
  rollnumber: String,
  hostel: String
})

module.exports = mongoose.model('Student', studentSchema)
