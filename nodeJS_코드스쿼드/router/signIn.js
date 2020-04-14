const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const db = require('../db.js');
const url = require('url');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/signIn.html'));
});
router.post('/check_name', (req, res) => {
  const name = req.body.name;
  db.query('SELECT characters.id, name, age, grade, kind, description, kindDescription FROM characters LEFT JOIN age ON characters.age_id = age.id LEFT JOIN kind on characters.kind_id = kind.id Where characters.name = ?', [name], (err, data) => {
    if(err) throw err;
    if(data[0]){
      req.session.data = data[0];
      res.json({result : 'Ok', data : data[0]});
    }else{
      res.json({result : 'No'});
    }
  })
})

module.exports = router;