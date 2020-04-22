const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const db = require('../db.js');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
  let name = null;
  if(req.user){
    console.log(`요청된 회원정보 id : ${req.user.id}, 이름 : ${req.user.name}`)
    name = req.user.name
  }else{
    console.log('처음접속')
  }
  res.render('main', {name : name})
});

// router.post('/authCheck', (req, res, next) => {
//   const token = req.headers.authorization;
//   jwt.verify(token, 'SangminToken', (err, decoded) => {
//     if(err) throw err;
//     res.json({decoded})
//   })
// })

module.exports = router;