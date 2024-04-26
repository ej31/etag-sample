const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require("fs");
const crypto = require('crypto');


const app = express();
app.set('etag', 'strong')  //  strong etag를 쓰지 않으면 "W/ " etag에 prefix가 추가됨. (MDN Says -> 약한 알고리즘일 경우 If-Match 에서 ETag는 절대 일치 할 수 없다.)
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


// Document data
let document = {
  content: 'Initial content',
  etag: '1' // This should be a hash of the content, but for simplicity we'll use a version number
};

// 문서 호출 엔드포인트
app.get('/document', (req, res) => {
  res.setHeader('ETag', document.etag);
  res.send(document.content);
});

// 문서 업데이트
app.put('/document', (req, res) => {
  // 요청 헤더에 GET 했을 때 얻은 ETag 값을 (초기 1로 시작해서 수정 때 마다 1씩 증가함) 포함해서 요청 보내야함.
  const clientEtag = req.headers['if-match'];
  if (clientEtag === undefined) {
    res.status(400).send("If-Match 헤더 없음")
    return;
  }

  if (clientEtag !== document.etag) {
    res.status(412).send('Precondition Failed: The document has been modified by another user.');
    return;
  }

  // 문서를 업데이트하고 ETag를 증가시킴
  document.content = req.body.content;
  document.etag = (parseInt(document.etag) + 1).toString();

  res.setHeader('ETag', document.etag);
  res.send(document.content);
});

module.exports = app;
