// Import & Config
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const url = require('./model/urllist');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const urlList = require('./model/urllist');

// Secrets
const user = process.env['user']
const pass = process.env['pass']
const cluster = process.env['cluster']
const option1 = process.env['option1']
const option2 = process.env['option2']
const database = process.env['database']

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));

// Mongo_URI
const mongo_URI = `mongodb+srv://${user}:${pass}@${cluster}/${database}?${option1}`;

// MongoDB Connect Config
mongoose.set('strictQuery', false);

// MongoDB Connect
mongoose.connect(mongo_URI)
.then(() => console.log('Database connection successed'))
.catch(err => console.error(err))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
