const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require("fs");
const crypto = require('crypto');
const documentRouter = require('./route/documentRoute')

const app = express();
app.set('etag', 'strong')  //  strong etag를 쓰지 않으면 "W/ " etag에 prefix가 추가됨. (MDN Says -> 약한 알고리즘일 경우 If-Match 에서 ETag는 절대 일치 할 수 없다.)
// app.set('etag', false); // turn off

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/document', documentRouter);

// app.use('/', indexRouter);


app.get('/case-1', (req, res) => {
  res.send({message: "Hey!"})
});

module.exports = app;
