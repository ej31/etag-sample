const express = require('express');
const router = express.Router();

// Document data
let document = {
  content: 'Initial content',
  etag: '1' // 단순화를 위해 일반 숫자로 사용
};


router.route('/')
  .get((req, res) => { // 문서 호출 엔드포인트

    res.setHeader('ETag', document.etag);
    res.send(document.content);
  })
  .put((req, res) => { // 문서 업데이트
    const clientEtag = req.headers['if-match']; // PUT 헤더에는 요청 받을 때 클라이언트는 GET 했을 때 얻은 ETag 값을 포함해서 요청 보내야함 (초기 1로 시작해서 수정 때 마다 1씩 증가함)
    if (clientEtag === undefined) {
      res.status(400).send("If-Match 헤더 없음")
      return;
    }

    if (clientEtag !== document.etag) {
      res.status(412).send('Precondition Failed: The document has been modified by another user.');
      return;
    }

    document.content = req.body.content; // 문서를 업데이트하고 ETag를 증가시킴
    document.etag = (parseInt(document.etag) + 1).toString();

    res.setHeader('ETag', document.etag);
    res.send(document.content);
  })
module.exports = router