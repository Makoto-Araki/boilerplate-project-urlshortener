// import
const Mongoose = require('mongoose');

// Schema
const urlSchema = new Mongoose.Schema({
  short: {type: Number},
  long: {type: String}
});

// Model
exports.exports = Mongoose.model('urlList', urlSchema);