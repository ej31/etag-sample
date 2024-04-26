const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require("node:fs");
const crypto = require('crypto');

// const indexRouter = require('./routes/index');

const app = express();
app.set('etag', 'strong')  //  strong etag를 쓰지 않으면 "W/ " etag에 prefix가 추가됨
// app.set('etag', false); // turn off

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);

app.get('/image', function (req, res) {
  const imagePath = path.join(__dirname, 'public', 'sample_20mb.png');
  res.sendFile(imagePath);
});

app.get('/image-with-etag', function (req, res) {
  const imagePath = path.join(__dirname, 'public', 'sample_20mb.png');

  // Read the file and calculate the ETag
  fs.readFile(imagePath, (err, data) => {
    if (err) {
      res.status(500).send('Error reading file');
      return;
    }

    const hash = crypto.createHash('sha1').update(data).digest('base64');
    const etag = `"${hash}"`;

    // Compare the ETag with the If-None-Match header
    if (req.headers['if-none-match'] === etag) {
      res.status(304).end(); // Not Modified
    } else {
      res.setHeader('ETag', etag);
      res.sendFile(imagePath);
    }
  });
});
app.get('/case-1', (req, res) => {
  res.send({message: "Hey!"})
});

module.exports = app;
