// const express = require('express');
// const path = require('path');
// const {etag} = require("express/lib/utils");
// const router = express.Router();
//
//
// /* GET home page. */
// router.get('/', function (req, res, next) {
//   let data = {
//     message: getRandomInt(0, 1)
//   };
//   let dataEtag = etag(JSON.stringify(data), 'utf8');
//   let noneMatch = req.header('If-None-Match');
//   if (noneMatch === dataEtag) {
//     res.status(304).end(); // Not Modified
//   } else {
//     res.setHeader('If-None-Match', dataEtag);
//     res.json(data); // This will return with status 200
//   }
// });
//
// function getRandomInt(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }
//
//
// router.get('/random-image', function (req, res, next) {
//   const images = ['etag_sample.png', 'etag_sample2.png'];
//   const randomIndex = getRandomInt(0, images.length - 1);
//   const imagePath = path.join(__dirname, images[randomIndex]);
//
//   res.sendFile(imagePath);
// });
// module.exports = router;
//
