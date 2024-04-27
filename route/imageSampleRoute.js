const express = require('express');
const path = require('path');
const fs = require("fs");
const router = express.Router();

router.get('/case1', (req, res) => {  // 이 요청에서도 ETag 값은 발행이 됨 (ExpressJS 에서 ETag 발행이 안되게 하려면 옵션을 꺼야함). 요청 시 no-cache 로 요청해야 200 나감
  const imagePath = path.join(__dirname, 'public', 'sample_20mb.png');
  res.sendFile(imagePath);
});

router.get('/case2', function (req, res) { // with Etag
  const imagePath = path.join(__dirname, 'public', 'sample_20mb.png');

  // ETag에 사용할 파일 해시값 계산
  fs.readFile(imagePath, (err, data) => {
    if (err) {
      res.status(500).send('Error reading file');
      return;
    }

    const hash = crypto.createHash('sha1').update(data).digest('base64');
    const etag = `"${hash}"`;

    // ETag를 If-None-Match 헤더와 비교
    if (req.headers['if-none-match'] === etag) { // express 는 헤더 값 가져올 때 대소문자 구분 안함 (lower-case 로 자동 변환함)
      // https://www.notion.so/goorm/ETag-128c3a07a2b6407698c9c83229f32083?pvs=4#2a3b35d384f24938842cc3dc9b07100a
      // INM 조건에서 ETag 의 값이 같은 경우 304 이다. 위 블로그에서 언급한 "If-None-Match 헤더의 조건이 충족되지 않았다" 라는 문장은 표현이 모호하다. (뭐가 충족됐다는 건 ETag가 일치한다는 걸 말하는건지 모호)
      // 어쨌든 중요한건 INM 조건에서는..
      // - Etag가 일치 하지 않으면 `200 Ok` 를 리턴한다.
      // - Etag가 일치 하면 `304 Not Modified` 를 리턴한다.
      res.status(304).end(); // Not Modified
    } else {
      res.setHeader('ETag', etag);
      res.sendFile(imagePath);
    }
  });
});
