const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const db = require('../db.js');

router.get('/', (req, res) => {
  let name = null;
  if(req.user){
    console.log(`요청된 회원정보 id : ${req.user.id}, 이름 : ${req.user.name}`)
    name = req.user.name
  };
  res.render('main', {name : name})
});

module.exports = router;