// Import & Config
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const url = require('url');
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

// GET - /api/shorturl/:id
app.get('/api/shorturl/:id', function(req, res) {
  urlList
  .find({short: req.params.id})
  .exec((err, data) => {
    if (!err) {
      res.redirect(data.long);  // Redirect your request page
    } else {
      console.error(err);  // Error Message
    }
  });
});

// POST - /api/shorturl
app.post('/api/shorturl', function(req, res) {
  let longurl = url.parse(req.body.url);
  let invalid = {error: 'invalid url'};
  
  // Developer Code
  // console.log(longurl.protocol);
  // console.log(longurl.hostname);
  // console.log(longurl.port);
  // console.log(longurl.pathname);
  
  if (longurl.protocol === null || longurl.hostname === null) {
    return res.json(invalid);
  }
  
  dns.lookup(longurl.hostname, { family: 4 }, (error, address, family) => {
    if (error) return res.json(invalid);
  });
  
  urlList
  .find({long: req.body.url})
  .count()
  .exec((err, count) => {
    if (!err) {
      if (count === 0) {
        let newurl = new urlList();
        newurl.short = count + 1;
        newurl.long = req.body.url;
        newurl.save((err, data) => {
          if (!err) {
            res.json({
              original_url: data.long,
              short_url: data.short,
            });
          } else {
            console.error(err);
          }
        });
      } else {
        urlList
        .find({long: req.body.url})
        .exec((err, data) => {
          if (!err) {
            res.json({
              original_url: data[0].long,
              short_url: data[0].short,
            });
          } else {
            console.error(err);
          }
        });
      }
    } else {
      console.error(err);
    }
  });
  
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
