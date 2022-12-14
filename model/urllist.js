// import
const Mongoose = require('mongoose');

// Schema
const urlSchema = new Mongoose.Schema({
  short: {type: Number},
  long: {type: String}
});

// Model
module.exports = Mongoose.model('urlList', urlSchema);